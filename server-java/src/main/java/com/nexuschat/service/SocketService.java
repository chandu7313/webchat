package com.nexuschat.service;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.nexuschat.model.Message;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SocketService {

    private final SocketIOServer server;
    private final Map<String, UUID> userSocketMap = new ConcurrentHashMap<>();

    public SocketService(SocketIOServer server) {
        this.server = server;
    }

    @PostConstruct
    public void start() {
        server.addConnectListener(client -> {
            String userId = client.getHandshakeData().getSingleUrlParam("userId");
            if (userId != null && !userId.isBlank()) {
                userSocketMap.put(userId, client.getSessionId());
                broadcastOnlineUsers();
            }
        });

        server.addDisconnectListener(client -> {
            String userId = client.getHandshakeData().getSingleUrlParam("userId");
            if (userId != null) {
                userSocketMap.remove(userId);
                broadcastOnlineUsers();
            }
        });

        server.start();
    }

    public void broadcastOnlineUsers() {
        Set<String> onlineIds = userSocketMap.keySet();
        server.getBroadcastOperations().sendEvent("getOnlineUsers", onlineIds);
    }

    public void sendNewMessage(String receiverId, Message newMessage) {
        UUID clientId = userSocketMap.get(receiverId);
        if (clientId == null) return;
        SocketIOClient client = server.getClient(clientId);
        if (client != null) {
            client.sendEvent("newMessage", newMessage);
        }
    }

    @PreDestroy
    public void stop() {
        server.stop();
    }
}

