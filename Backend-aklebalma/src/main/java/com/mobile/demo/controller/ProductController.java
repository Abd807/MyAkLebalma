package com.mobile.demo.controller;

import com.mobile.demo.entity.Product;
import com.mobile.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.findAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.findById(id);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        try {
            List<Product> products = productService.findByCategoryId(categoryId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        try {
            List<Product> products = productService.searchByName(q);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/stock/{quantity}")
    public ResponseEntity<?> checkStock(@PathVariable Long id, @PathVariable Integer quantity) {
        try {
            Product product = productService.findById(id);
            if (product != null) {
                Map<String, Object> stockInfo = new HashMap<>();
                stockInfo.put("productId", product.getId());
                stockInfo.put("productName", product.getName());
                stockInfo.put("currentStock", product.getStockQuantity());
                stockInfo.put("requestedQuantity", quantity);
                stockInfo.put("available", product.checkAvailability(quantity));
                
                return ResponseEntity.ok(stockInfo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la création: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
