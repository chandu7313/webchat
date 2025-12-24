package com.nexuschat.controller;

import com.nexuschat.dto.SendMessageRequest;
import com.nexuschat.model.User;
import com.nexuschat.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> users(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        }
        return ResponseEntity.ok(messageService.getUsersForSidebar(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> messages(@AuthenticationPrincipal User user, @PathVariable("id") String id) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        }
        return ResponseEntity.ok(messageService.getMessages(user, id));
    }

    @PutMapping("/mark/{id}")
    public ResponseEntity<Map<String, Object>> markSeen(@PathVariable("id") String id) {
        return ResponseEntity.ok(messageService.markMessageAsSeen(id));
    }

    @PostMapping("/send/{id}")
    public ResponseEntity<Map<String, Object>> send(@AuthenticationPrincipal User user,
                                                    @PathVariable("id") String id,
                                                    @RequestBody @Valid SendMessageRequest request) throws Exception {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        }
        return ResponseEntity.ok(messageService.sendMessage(user, id, request));
    }
}

