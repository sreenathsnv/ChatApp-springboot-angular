package com.chat.service;

import com.chat.entity.ChatMessage;
import com.chat.entity.Room;
import com.chat.repo.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;


    public void saveRoomMessageToDB(Room room , ChatMessage chatMessage) {

        chatMessage.setRoomName(room);
        chatMessage.setCreatedAt(new Date());
        chatMessageRepository.save(chatMessage);


    }

    public List<ChatMessage> getAllRoomMessages(String roomName){

        return chatMessageRepository.findByRoomNameId(roomName);
    }
}
