package com.doan.services;

import com.doan.entities.User;
import com.doan.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setFullName(updatedUser.getFullName());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setUsername(updatedUser.getUsername());
                    if (!passwordEncoder.matches(updatedUser.getPassword(), existingUser.getPassword())) {
                        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    existingUser.setRole(updatedUser.getRole());
                    existingUser.setBirthDate(updatedUser.getBirthDate());
                    existingUser.setGender(updatedUser.getGender());
                    existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
                    return userRepository.save(existingUser);
                })
                .orElse(null);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

}
