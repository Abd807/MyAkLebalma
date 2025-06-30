package com.mobile.demo.controller;

import com.mobile.demo.entity.User;
import com.mobile.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.save(user);
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de l'inscription: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            User user = userService.findByEmailAndPassword(email, password);
            if (user != null) {
                user.setPassword(null);
                return ResponseEntity.ok(user);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email ou mot de passe incorrect");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la connexion: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            if (user != null) {
                user.setPassword(null);
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/credit-info")
    public ResponseEntity<?> getCreditInfo(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            if (user != null) {
                Map<String, Object> creditInfo = new HashMap<>();
                creditInfo.put("userId", user.getId());
                creditInfo.put("fullName", user.getFullName());
                creditInfo.put("purchasingPower", user.getPurchasingPower());
                creditInfo.put("remainingToPay", user.getRemainingToPay());
                
                BigDecimal availableCredit = user.getPurchasingPower().subtract(user.getRemainingToPay());
                creditInfo.put("availableCredit", availableCredit);
                
                return ResponseEntity.ok(creditInfo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.findAll();
            users.forEach(user -> user.setPassword(null));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
