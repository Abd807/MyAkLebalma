import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, product: initialProduct, route }) => {
    const productId = route?.params?.productId;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Produit par défaut pour test
    const defaultProduct = {
        id: '1',
        name: 'iPhone 15 Pro',
        price: 850000,
        originalPrice: 950000,
        category: 'Électronique',
        description: 'Le smartphone le plus avancé jamais créé par Apple. Avec le nouveau processeur A17 Pro, un système de caméras révolutionnaire et un design en titane.',
        stockQuantity: 10,
        imageUrl: 'https://via.placeholder.com/300'
    };

    useEffect(() => {
        if (initialProduct) {
            // Si on a déjà le produit passé en props, on l'utilise directement
            setProduct(initialProduct);
            setLoading(false);
        } else if (productId) {
            // Sinon on charge depuis l'API
            loadProduct();
        } else {
            // Produit par défaut pour test
            setProduct(defaultProduct);
            setLoading(false);
        }
    }, [productId, initialProduct]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const productData = await productService.getProductById(productId);
            setProduct(productData);
        } catch (error) {
            console.error('❌ Failed to load product:', error);
            Alert.alert('Erreur', 'Impossible de charger le produit');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);

            // Simuler l'ajout au panier (vous adapterez selon votre logique)
            const userId = 3; // À remplacer par l'ID utilisateur réel
            const totalAmount = product.price * quantity;

            await cartService.updateCart(userId, totalAmount);

            Alert.alert(
                'Succès',
                `${product.name} ajouté au panier !`,
                [
                    { text: 'Continuer', style: 'cancel' },
                    { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') }
                ]
            );
        } catch (error) {
            console.error('❌ Failed to add to cart:', error);
            Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
        } finally {
            setAddingToCart(false);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stockQuantity && quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={styles.loadingText}>Chargement du produit...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Produit non trouvé</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Détail du produit</Text>
                <TouchableOpacity style={styles.favoriteBtn}>
                    <Icon name="heart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Image du produit */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.imageUrl || 'https://via.placeholder.com/300' }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <View style={styles.lowStockBadge}>
                            <Text style={styles.lowStockText}>Stock limité</Text>
                        </View>
                    )}
                    {product.stockQuantity === 0 && (
                        <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockText}>Rupture de stock</Text>
                        </View>
                    )}
                </View>

                {/* Informations du produit */}
                <View style={styles.infoContainer}>
                    <Text style={styles.category}>{product.category}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>

                    {/* Stock */}
                    <View style={styles.stockContainer}>
                        <Icon name="cube-outline" size={16} color="#666" />
                        <Text style={styles.stockText}>
                            {product.stockQuantity > 0
                                ? `${product.stockQuantity} en stock`
                                : 'Rupture de stock'
                            }
                        </Text>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {product.description || 'Aucune description disponible pour ce produit.'}
                        </Text>
                    </View>

                    {/* Sélecteur de quantité */}
                    {product.stockQuantity > 0 && (
                        <View style={styles.quantityContainer}>
                            <Text style={styles.sectionTitle}>Quantité</Text>
                            <View style={styles.quantitySelector}>
                                <TouchableOpacity
                                    style={[styles.quantityBtn, quantity <= 1 && styles.quantityBtnDisabled]}
                                    onPress={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    <Icon name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#333"} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.quantityBtn,
                                        (quantity >= product.stockQuantity || quantity >= 10) && styles.quantityBtnDisabled
                                    ]}
                                    onPress={incrementQuantity}
                                    disabled={quantity >= product.stockQuantity || quantity >= 10}
                                >
                                    <Icon
                                        name="add"
                                        size={20}
                                        color={(quantity >= product.stockQuantity || quantity >= 10) ? "#ccc" : "#333"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Total */}
                    {product.stockQuantity > 0 && (
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalPrice}>
                                {formatPrice(product.price * quantity)}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bouton d'ajout au panier */}
            {product.stockQuantity > 0 && (
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[styles.addToCartBtn, addingToCart && styles.addToCartBtnDisabled]}
                        onPress={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="cart" size={20} color="#fff" />
                                <Text style={styles.addToCartText}>Ajouter au panier</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    favoriteBtn: {
        padding: 5,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        height: 300,
        backgroundColor: '#f8f8f8',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    lowStockBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#ff9500',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    lowStockText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    outOfStockBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#dc3545',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    outOfStockText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    infoContainer: {
        padding: 20,
    },
    category: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2E8B57',
        marginBottom: 15,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stockText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
    },
    quantityContainer: {
        marginBottom: 20,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
    },
    quantityBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    quantityBtnDisabled: {
        backgroundColor: '#f0f0f0',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 30,
        color: '#333',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E8B57',
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    addToCartBtn: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
    },
    addToCartBtnDisabled: {
        backgroundColor: '#ccc',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#2E8B57',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProductDetailScreen;