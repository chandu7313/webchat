package com.nexuschat.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nexuschat.dto.SendMessageRequest;
import com.nexuschat.model.Message;
import com.nexuschat.model.User;
import com.nexuschat.repository.MessageRepository;
import com.nexuschat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final SocketService socketService;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, Cloudinary cloudinary, SocketService socketService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
        this.socketService = socketService;
    }

    public Map<String, Object> getUsersForSidebar(User requester) {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(user -> !user.getId().equals(requester.getId()))
                .peek(this::maskPassword)
                .collect(Collectors.toList());

        Map<String, Integer> unseenMessages = new HashMap<>();
        for (User user : users) {
            int unseen = messageRepository.findByReceiverIdAndSenderIdAndSeenFalse(requester.getId(), user.getId()).size();
            if (unseen > 0) {
                unseenMessages.put(user.getId(), unseen);
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("users", users);
        result.put("unseenMessages", unseenMessages);
        return result;
    }

    public Map<String, Object> getMessages(User requester, String otherUserId) {
        List<Message> outgoing = messageRepository.findBySenderIdAndReceiverId(requester.getId(), otherUserId);
        List<Message> incoming = messageRepository.findBySenderIdAndReceiverId(otherUserId, requester.getId());

        List<Message> messages = new java.util.ArrayList<>();
        messages.addAll(outgoing);
        messages.addAll(incoming);
        messages.sort((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        });

        incoming.stream().filter(msg -> !msg.isSeen()).forEach(msg -> {
            msg.setSeen(true);
            messageRepository.save(msg);
        });

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("messages", messages);
        return res;
    }

    public Map<String, Object> markMessageAsSeen(String id) {
        Optional<Message> messageOptional = messageRepository.findById(id);
        messageOptional.ifPresent(message -> {
            message.setSeen(true);
            messageRepository.save(message);
        });
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    public Map<String, Object> sendMessage(User sender, String receiverId, SendMessageRequest request) throws IOException {
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isBlank()) {
            Map upload = cloudinary.uploader().upload(request.getImage(), ObjectUtils.emptyMap());
            imageUrl = (String) upload.get("secure_url");
        }
        Message message = new Message(sender.getId(), receiverId, request.getText(), imageUrl);
        messageRepository.save(message);

        socketService.sendNewMessage(receiverId, message);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("newMessage", message);
        return res;
    }

    private void maskPassword(User user) {
        user.setPassword(null);
    }
}

