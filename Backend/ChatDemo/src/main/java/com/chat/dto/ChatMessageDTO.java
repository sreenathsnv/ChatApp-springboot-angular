package com.chat.dto;

import com.chat.entity.Type;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class ChatMessageDTO {

    private  String msg;
    private String senderId;
    private String receiverId;
    private Type type;
}
