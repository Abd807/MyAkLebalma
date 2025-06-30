package com.mobile.demo.config;

import com.mobile.demo.entity.User;
import com.mobile.demo.entity.Product;
import com.mobile.demo.service.UserService;
import com.mobile.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        if (userService.findAll().isEmpty()) {
            System.out.println("🔄 Création des données de test...");

            User testUser = new User();
            testUser.setFirstName("Abdou");
            testUser.setLastName("Khadre");
            testUser.setEmail("abdou@test.com");
            testUser.setPassword("123456");
            testUser.setPhoneNumber("221701234567");
            testUser.setPurchasingPower(new BigDecimal("1000000"));
            testUser.setRemainingToPay(new BigDecimal("150000"));
            userService.save(testUser);

            Product[] products = {
                new Product("iPhone 15 Pro", "Dernier iPhone avec puce A17 Pro", new BigDecimal("850000"), 5),
                new Product("Nike Air Force 1", "Chaussures Nike classiques", new BigDecimal("85000"), 12),
                new Product("Samsung TV 55", "TV Samsung 55 pouces 4K", new BigDecimal("450000"), 3),
                new Product("MacBook Air M2", "MacBook Air avec puce M2", new BigDecimal("1200000"), 2)
            };

            for (Product product : products) {
                product.setBrand(product.getName().split(" ")[0]);
                product.setImageUrl("https://example.com/" + product.getName().toLowerCase().replace(" ", "_") + ".jpg");
                product.setCategoryId(1L);
                productService.save(product);
            }

            System.out.println("✅ Données de test créées !");
            System.out.println("📱 Test: http://localhost:8080/api/users");
            System.out.println("🛍️ Test: http://localhost:8080/api/products");
        }
    }
}
