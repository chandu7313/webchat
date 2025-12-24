package com.nexuschat.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nexuschat.dto.LoginRequest;
import com.nexuschat.dto.SignupRequest;
import com.nexuschat.dto.UpdateProfileRequest;
import com.nexuschat.model.User;
import com.nexuschat.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Cloudinary cloudinary;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.cloudinary = cloudinary;
    }

    public Map<String, Object> signup(SignupRequest request) {
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return failure("Account already exists");
        }
        User user = new User(request.getEmail(), request.getFullName(), passwordEncoder.encode(request.getPassword()), request.getBio());
        userRepository.save(user);
        maskPassword(user);
        String token = jwtService.generateToken(user.getId());
        Map<String, Object> response = success("Account created successfully");
        response.put("userData", user);
        response.put("token", token);
        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        if (user == null || user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return failure("Invalid credentials");
        }
        maskPassword(user);
        String token = jwtService.generateToken(user.getId());
        Map<String, Object> response = success("Login successful");
        response.put("userData", user);
        response.put("token", token);
        return response;
    }

    public Map<String, Object> updateProfile(UpdateProfileRequest request, User currentUser) throws IOException {
        if (request.getProfilePic() != null && !request.getProfilePic().isBlank()) {
            Map upload = cloudinary.uploader().upload(request.getProfilePic(), ObjectUtils.emptyMap());
            currentUser.setProfilePic((String) upload.get("secure_url"));
        }
        currentUser.setFullName(request.getFullName());
        currentUser.setBio(request.getBio());
        userRepository.save(currentUser);
        maskPassword(currentUser);
        Map<String, Object> response = success("Profile updated successfully");
        response.put("user", currentUser);
        return response;
    }

    public void maskPassword(User user) {
        user.setPassword(null);
    }

    private Map<String, Object> success(String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", true);
        map.put("message", message);
        return map;
    }

    private Map<String, Object> failure(String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("message", message);
        return map;
    }
}

