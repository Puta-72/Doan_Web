package com.doan;

import com.doan.entities.User;
import com.doan.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Main implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra tài khoản admin
        if (!userService.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPhoneNumber("0123456789");
            admin.setRole("ROLE_ADMIN");
            admin.setBirthDate("1990-01-01");
            userService.saveUser(admin);

            System.out.println("Admin account created successfully!");
        } else {
            System.out.println("Admin account already exists.");
        }
    }
}
