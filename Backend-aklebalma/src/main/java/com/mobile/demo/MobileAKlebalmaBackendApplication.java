package com.mobile.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.mobile.demo.entity")
@EnableJpaRepositories("com.mobile.demo.repository")
public class MobileAKlebalmaBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MobileAKlebalmaBackendApplication.class, args);
    }
}
