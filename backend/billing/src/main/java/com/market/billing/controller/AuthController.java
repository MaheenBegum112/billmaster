package com.market.billing.controller;

import com.market.billing.model.User;
import com.market.billing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
@PostMapping("/signup")
public Map<String, String> signup(@RequestBody User newUser) {
    if (userRepository.findByUsername(newUser.getUsername()) != null) {
        throw new RuntimeException("Username already exists");
    }
    User saved = userRepository.save(newUser);
    return Map.of("username", saved.getUsername(), "role", saved.getRole());
}
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());

        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        return Map.of("username", user.getUsername(), "role", user.getRole());
    }
}