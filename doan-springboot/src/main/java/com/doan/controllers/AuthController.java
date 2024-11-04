package com.doan.controllers;

import com.doan.entities.User;
import com.doan.services.AuthService;
import com.doan.services.MyUserDetails;
import com.doan.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    // login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            boolean success = authService.login(username, password);
            if (success) {
                User user = userService.findByUsername(username);
                String token = authService.generateJwtToken(user);
                return ResponseEntity.ok(Map.of("success", true, "token", token, "message", "Login successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An error occurred during login"));
        }
    }

    // register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String fullName = registerRequest.get("fullName");
        String email = registerRequest.get("email");
        String username = registerRequest.get("username");
        String password = registerRequest.get("password");
        String birthDate = registerRequest.get("birthDate");
        String gender = registerRequest.get("gender");
        String phoneNumber = registerRequest.get("phoneNumber");
        String role = "USER"; // Mặc định

        User registeredUser = authService.register(fullName, email, username, password, role, birthDate, gender, phoneNumber);
        if (registeredUser != null) {
            String token = authService.generateJwtToken(registeredUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "user", registeredUser, "token", token));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "User already exists or invalid registration"));
        }
    }

    // đăng xuất
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            authService.logout();
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", true, "message", "Logged out successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An error occurred during logout"));
        }
    }
}
