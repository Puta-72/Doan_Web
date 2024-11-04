package com.doan.controllers;

import com.doan.entities.User;
import com.doan.services.JwtUtil;
import com.doan.services.UserService;
import com.doan.services.MyUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

//    // thông tin người dùng hiện tại (user đã xác thực)
//    @GetMapping("/me")
//    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
//        // Lấy thông tin user từ SecurityContext
//        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
//        User user = userService.findByUsername(userDetails.getUsername());
//        return ResponseEntity.status(HttpStatus.OK).body(user);
//    }

    // tất cả người dùng (Admin)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    // Tạo mới người dùng (Admin)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Cập nhật thông tin người dùng (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user != null) {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User không tìm thấy");
        }
    }

    // Xóa người dùng (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("User đã được xóa thành công");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User không tìm thấy");
        }
    }

    // thông tin người dùng theo tên người dùng (username)
    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An error occurred while retrieving user data"));
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);

            String username = jwtUtil.extractUsername(jwtToken);

            User currentUser = userService.findByUsername(username);

            if (currentUser != null) {
                currentUser.setFullName(updatedUser.getFullName());
                currentUser.setEmail(updatedUser.getEmail());
                currentUser.setPhoneNumber(updatedUser.getPhoneNumber());

                userService.updateUser(currentUser.getId(), currentUser);

                return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "An error occurred while updating the profile"));
        }
    }

}
