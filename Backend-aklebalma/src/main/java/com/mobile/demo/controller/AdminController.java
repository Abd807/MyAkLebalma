package com.mobile.demo.controller;

import com.mobile.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            // Compter les utilisateurs
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.countByIsActiveTrue();
            long inactiveUsers = totalUsers - activeUsers;
            
            // Calculer les totaux financiers
            Double totalPurchasingPower = userRepository.sumPurchasingPower();
            Double totalRemainingToPay = userRepository.sumRemainingToPay();
            Double averagePurchasingPower = userRepository.averagePurchasingPower();
            
            if (totalPurchasingPower == null) totalPurchasingPower = 0.0;
            if (totalRemainingToPay == null) totalRemainingToPay = 0.0;
            if (averagePurchasingPower == null) averagePurchasingPower = 0.0;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("inactiveUsers", inactiveUsers);
            stats.put("totalPurchasingPower", totalPurchasingPower);
            stats.put("totalRemainingToPay", totalRemainingToPay);
            stats.put("averagePurchasingPower", averagePurchasingPower);
            
            System.out.println("Stats générées: " + stats);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("Erreur lors du calcul des stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
}
