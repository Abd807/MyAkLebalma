package com.mobile.demo.service;

import com.mobile.demo.entity.Product;
import com.mobile.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product findById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> findByIsAvailableTrue() {
        return productRepository.findByIsAvailableTrue();
    }

    public List<Product> searchByName(String searchTerm) {
        return productRepository.findByNameContainingIgnoreCase(searchTerm);
    }

    public List<Product> findByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    public List<Product> findAvailableProducts() {
        return productRepository.findAvailableProducts();
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateStock(Long productId, Integer quantity) {
        Product product = findById(productId);
        if (product != null) {
            product.updateStock(quantity);
            return save(product);
        }
        return null;
    }
}
