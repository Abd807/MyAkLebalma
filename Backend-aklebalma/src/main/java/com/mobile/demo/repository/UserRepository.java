package com.mobile.demo.repository;

import com.mobile.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Méthodes de base pour UserService
    User findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    User findByEmailAndPassword(String email, String password);
    
    // Méthodes pour les stats admin
    long countByIsActiveTrue();
    
    @Query("SELECT SUM(u.purchasingPower) FROM User u")
    Double sumPurchasingPower();
    
    @Query("SELECT SUM(u.remainingToPay) FROM User u")
    Double sumRemainingToPay();
    
    @Query("SELECT AVG(u.purchasingPower) FROM User u")
    Double averagePurchasingPower();
}
