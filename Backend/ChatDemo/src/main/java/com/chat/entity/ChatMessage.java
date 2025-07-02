package com.chat.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("messages")
public class ChatMessage {

    private  String msg;
    private String senderId;
    private String receiverId;
    private Date createdAt;
    private Type type;

    @DBRef
    private Room roomName;
}
