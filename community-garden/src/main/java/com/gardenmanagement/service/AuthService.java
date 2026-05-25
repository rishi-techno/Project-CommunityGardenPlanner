package com.gardenmanagement.service;

import com.gardenmanagement.dto.AuthResponse;
import com.gardenmanagement.dto.LoginRequest;
import com.gardenmanagement.dto.RegisterRequest;
import com.gardenmanagement.entity.User;
import com.gardenmanagement.exception.DuplicateEmailException;
import com.gardenmanagement.repository.UserRepository;
import com.gardenmanagement.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for authentication operations: registration and login.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    /**
     * Registers a new user and returns a JWT token.
     */
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        // Determine role (default MEMBER)
        User.Role role = User.Role.MEMBER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            role = User.Role.ADMIN;
        }

        // Create and save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(),
                savedUser.getEmail(), savedUser.getRole().name());
    }

    /**
     * Authenticates a user and returns a JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate credentials (throws BadCredentialsException if invalid)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name());
    }
}
