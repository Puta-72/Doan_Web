package com.doan.services;

import com.doan.entities.User;
import com.doan.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
//
//    // thông tin user đã xác thực
//    public MyUserDetails getAuthenticatedUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//            return (MyUserDetails) userDetails;
//        }
//        return null;
//    }

    // đăng nhập
    public boolean login(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return true;
        } catch (AuthenticationException e) {
            return false;
        }
    }

    // Đăng ký
    public User register(String fullName, String email, String username, String password, String role, String birthDate, String gender, String phoneNumber) {
        if (userRepository.findByUsername(username) != null) {
            return null;
        }
        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);
        newUser.setBirthDate(birthDate);
        newUser.setGender(gender);
        newUser.setPhoneNumber(phoneNumber);
        return userRepository.save(newUser);
    }

//    // Thêm phương thức getUserByUsername vào AuthService
//    public User getUserByUsername(String username) {
//        // Tìm kiếm người dùng theo username từ cơ sở dữ liệu (UserRepository)
//        return userRepository.findByUsername(username);
//    }

    // Tạo JWT token
    public String generateJwtToken(User registeredUser) {
        return jwtUtil.generateToken(new MyUserDetails(registeredUser));
    }

    // Đăng xuất
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
