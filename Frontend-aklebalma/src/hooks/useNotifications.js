// src/hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from 'react';
import NotificationApiService from '../services/notificationApiService';
import { handleApiError, StorageHelper } from '../utils/api';

export const useNotifications = (options = {}) => {
    const {
        userId = null,
        autoRefresh = false,
        refreshInterval = 30000, // 30 secondes
        enablePolling = false
    } = options;

    // États
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

    // Refs pour la gestion du polling
    const pollingRef = useRef(null);
    const mountedRef = useRef(true);

    // Charger les notifications
    const loadNotifications = useCallback(async (showLoading = true) => {
        if (showLoading && !refreshing) setLoading(true);
        setError(null);

        try {
            const data = await NotificationApiService.getUserNotifications(userId);
            const processedData = await NotificationApiService.processNotifications(data);

            if (mountedRef.current) {
                setNotifications(processedData);

                // Compter les non lues
                const unread = processedData.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            const errorInfo = handleApiError(err, 'chargement notifications');
            if (mountedRef.current) {
                setError(errorInfo);
                console.error('Erreur lors du chargement des notifications:', err);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [userId, refreshing]);

    // Refresh (pull-to-refresh)
    const refreshNotifications = useCallback(async () => {
        setRefreshing(true);
        await loadNotifications(false);
    }, [loadNotifications]);

    // Charger les notifications filtrées
    const loadFilteredNotifications = useCallback(async (filterType) => {
        setLoading(true);
        setError(null);

        try {
            let data;
            switch (filterType) {
                case 'UNREAD':
                    data = await NotificationApiService.getUnreadNotifications(userId);
                    break;
                case 'READ':
                    data = await NotificationApiService.getReadNotifications(userId);
                    break;
                default:
                    data = await NotificationApiService.getUserNotifications(userId);
            }

            const processedData = await NotificationApiService.processNotifications(data);

            if (mountedRef.current) {
                setNotifications(processedData);
                setFilter(filterType);
            }
        } catch (err) {
            const errorInfo = handleApiError(err, 'filtrage notifications');
            if (mountedRef.current) {
                setError(errorInfo);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [userId]);

    // Marquer comme lue
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await NotificationApiService.markAsRead(notificationId, userId);

            if (mountedRef.current) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );

                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            return { success: true };
        } catch (err) {
            const errorInfo = handleApiError(err, 'marquage comme lu');
            setError(errorInfo);
            return { success: false, error: errorInfo };
        }
    }, [userId]);

    // Marquer toutes comme lues
    const markAllAsRead = useCallback(async () => {
        try {
            await NotificationApiService.markAllAsRead(userId);

            if (mountedRef.current) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
                setUnreadCount(0);
            }

            return { success: true };
        } catch (err) {
            const errorInfo = handleApiError(err, 'marquage global');
            setError(errorInfo);
            return { success: false, error: errorInfo };
        }
    }, [userId]);

    // Supprimer une notification
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await NotificationApiService.deleteNotification(notificationId, userId);

            if (mountedRef.current) {
                const wasUnread = notifications.find(n => n.id === notificationId)?.isRead === false;

                setNotifications(prev =>
                    prev.filter(notif => notif.id !== notificationId)
                );

                if (wasUnread) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }

            return { success: true };
        } catch (err) {
            const errorInfo = handleApiError(err, 'suppression notification');
            setError(errorInfo);
            return { success: false, error: errorInfo };
        }
    }, [userId, notifications]);

    // Supprimer toutes les notifications lues
    const deleteAllRead = useCallback(async () => {
        try {
            await NotificationApiService.deleteAllReadNotifications(userId);

            if (mountedRef.current) {
                setNotifications(prev =>
                    prev.filter(notif => !notif.isRead)
                );
            }

            return { success: true };
        } catch (err) {
            const errorInfo = handleApiError(err, 'suppression notifications lues');
            setError(errorInfo);
            return { success: false, error: errorInfo };
        }
    }, [userId]);

    // Obtenir les notifications filtrées localement
    const getFilteredNotifications = useCallback(() => {
        switch (filter) {
            case 'UNREAD':
                return notifications.filter(n => !n.isRead);
            case 'READ':
                return notifications.filter(n => n.isRead);
            case 'HIGH_PRIORITY':
                return notifications.filter(n => n.priority === 'HIGH');
            case 'RECENT':
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return notifications.filter(n => new Date(n.timestamp) >= yesterday);
            default:
                return notifications;
        }
    }, [notifications, filter]);

    // Obtenir les statistiques
    const getStats = useCallback(() => {
        const total = notifications.length;
        const unread = notifications.filter(n => !n.isRead).length;
        const highPriority = notifications.filter(n => n.priority === 'HIGH').length;
        const recent = notifications.filter(n => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return new Date(n.timestamp) >= yesterday;
        }).length;

        return {
            total,
            unread,
            read: total - unread,
            highPriority,
            recent
        };
    }, [notifications]);

    // Vérifier s'il y a des non lues (depuis l'API)
    const checkUnreadNotifications = useCallback(async () => {
        try {
            const hasUnread = await NotificationApiService.hasUnreadNotifications(userId);
            return hasUnread;
        } catch (err) {
            console.error('Erreur vérification notifications non lues:', err);
            return false;
        }
    }, [userId]);

    // Obtenir le nombre de non lues (depuis l'API)
    const getUnreadCountFromAPI = useCallback(async () => {
        try {
            const count = await NotificationApiService.getUnreadNotificationsCount(userId);
            setUnreadCount(count);
            return count;
        } catch (err) {
            console.error('Erreur comptage notifications non lues:', err);
            return 0;
        }
    }, [userId]);

    // Démarrer le polling
    const startPolling = useCallback(() => {
        if (enablePolling && !pollingRef.current) {
            pollingRef.current = setInterval(() => {
                loadNotifications(false);
            }, refreshInterval);
        }
    }, [enablePolling, refreshInterval, loadNotifications]);

    // Arrêter le polling
    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    // Effets
    useEffect(() => {
        mountedRef.current = true;

        if (autoRefresh) {
            loadNotifications();
        }

        if (enablePolling) {
            startPolling();
        }

        return () => {
            mountedRef.current = false;
            stopPolling();
        };
    }, [autoRefresh, enablePolling, loadNotifications, startPolling, stopPolling]);

    // Retourner toutes les fonctions et états
    return {
        // États
        notifications: getFilteredNotifications(),
        allNotifications: notifications,
        loading,
        refreshing,
        error,
        unreadCount,
        filter,
        stats: getStats(),

        // Actions principales
        loadNotifications,
        refreshNotifications,
        loadFilteredNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,

        // Filtres et recherche
        setFilter,
        getFilteredNotifications,

        // Utilitaires
        checkUnreadNotifications,
        getUnreadCountFromAPI,
        startPolling,
        stopPolling,

        // État de connexion
        clearError: () => setError(null),
        retry: () => loadNotifications()
    };
};