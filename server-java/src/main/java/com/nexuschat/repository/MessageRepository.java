package com.nexuschat.repository;

import com.nexuschat.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
    List<Message> findBySenderIdAndReceiverIdAndSeenFalse(String senderId, String receiverId);
    List<Message> findByReceiverIdAndSenderIdAndSeenFalse(String receiverId, String senderId);
}

