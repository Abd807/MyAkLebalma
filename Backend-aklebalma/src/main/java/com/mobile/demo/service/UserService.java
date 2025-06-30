package com.mobile.demo.service;

import com.mobile.demo.entity.User;
import com.mobile.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User save(User user) {
        if (user.getId() == null) {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Cet email est déjà utilisé");
            }
            if (user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
                throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
            }
        }
        return userRepository.save(user);
    }

    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public User findByEmail(String email) {
        // CORRECTION : findByEmail retourne User, pas Optional<User>
        User user = userRepository.findByEmail(email);
        return user;
    }

    public User findByEmailAndPassword(String email, String password) {
        // CORRECTION : findByEmailAndPassword retourne User, pas Optional<User>
        User user = userRepository.findByEmailAndPassword(email, password);
        return user;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }
}
