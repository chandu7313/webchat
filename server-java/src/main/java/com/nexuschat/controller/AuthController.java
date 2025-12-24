package com.nexuschat.controller;

import com.nexuschat.dto.LoginRequest;
import com.nexuschat.dto.SignupRequest;
import com.nexuschat.dto.UpdateProfileRequest;
import com.nexuschat.model.User;
import com.nexuschat.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> check(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        }
        authService.maskPassword(user);
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
                                                             @AuthenticationPrincipal User user) throws Exception {
        return ResponseEntity.ok(authService.updateProfile(request, user));
    }
}

