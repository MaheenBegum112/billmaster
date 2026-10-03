package com.market.billing.controller;

import com.market.billing.dto.CreateCashierRequest;
import com.market.billing.dto.MessageResponse;
import com.market.billing.dto.UserDto;
import com.market.billing.exception.BadRequestException;
import com.market.billing.exception.ConflictException;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.User;
import com.market.billing.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/cashier")
    public ResponseEntity<UserDto> createCashier(@Valid @RequestBody CreateCashierRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("A user with this email already exists: " + request.getEmail());
        }

        User cashier = new User(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                User.Role.CASHIER
        );

        User saved = userRepository.save(cashier);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<MessageResponse> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Prevent self-deactivation of primary admin
        if ("admin@billmaster.com".equalsIgnoreCase(user.getEmail())) {
            throw new BadRequestException("Primary administrator account cannot be deactivated");
        }

        user.setActive(!user.isActive());
        userRepository.save(user);

        String status = user.isActive() ? "activated" : "deactivated";
        return ResponseEntity.ok(MessageResponse.ok("User account successfully " + status));
    }
}
