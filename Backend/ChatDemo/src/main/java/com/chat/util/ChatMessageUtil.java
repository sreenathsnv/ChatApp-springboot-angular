package com.chat.util;

import com.chat.dto.ChatMessageResponseDTO;
import com.chat.entity.ChatMessage;

public class ChatMessageUtil {

    public static ChatMessageResponseDTO toChatMessageResponseDTO(ChatMessage chatMessage){

        return ChatMessageResponseDTO.builder()
                .msg(chatMessage.getMsg())
                .type(chatMessage.getType())
                .receiverId(chatMessage.getReceiverId())
                .senderId(chatMessage.getSenderId())
                .createdAt(chatMessage.getCreatedAt())
                .build();

    }
}
