package com.market.billing.service;

import com.market.billing.dto.AuthResponse;
import com.market.billing.dto.LoginRequest;
import com.market.billing.dto.MessageResponse;
import com.market.billing.dto.SignupRequest;
import com.market.billing.dto.UserDto;
import com.market.billing.exception.BadRequestException;
import com.market.billing.exception.ConflictException;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.User;
import com.market.billing.repository.UserRepository;
import com.market.billing.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is deactivated. Contact an administrator.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public MessageResponse signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }

        User.Role assignedRole = User.Role.CASHIER;
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            String secretKey = request.getAdminSecretKey() != null ? request.getAdminSecretKey().trim() : "";
            if (!"ADMIN@BILLMASTER2026".equals(secretKey) && !"MASTER123".equals(secretKey)) {
                throw new BadRequestException("Invalid Administrator Secret Key. An authorized management key is required to register an Admin account.");
            }
            assignedRole = User.Role.ADMIN;
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                assignedRole
        );

        userRepository.save(user);
        String roleLabel = (assignedRole == User.Role.ADMIN) ? "Administrator" : "Cashier";
        return MessageResponse.ok("Registration successful as " + roleLabel + "! You can now log in.");
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromEntity(user);
    }
}
