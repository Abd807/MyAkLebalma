package com.mobile.demo.repository;

import com.mobile.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByIsAvailableTrue();
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    List<Product> findByBrand(String brand);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0 AND p.isAvailable = true")
    List<Product> findAvailableProducts();
}
