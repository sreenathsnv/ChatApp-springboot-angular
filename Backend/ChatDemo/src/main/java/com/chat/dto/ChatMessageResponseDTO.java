package com.chat.dto;


import com.chat.entity.Type;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@Builder
@ToString
public class ChatMessageResponseDTO {
    private  String msg;
    private String senderId;
    private String receiverId;
    private Type type;
    private Date createdAt;
}
