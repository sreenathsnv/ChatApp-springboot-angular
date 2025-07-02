package com.chat.controller;

import com.chat.dto.ChatMessageDTO;
import com.chat.dto.ChatMessageResponseDTO;
import com.chat.entity.ChatMessage;
import com.chat.entity.Room;
import com.chat.service.ChatMessageService;
import com.chat.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;


@Controller
public class WebSocketChatcontroler {


    @Autowired
    private SimpMessagingTemplate messageTemplate;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ChatMessageService chatMessageService;

    @MessageMapping("/resume")
    @SendTo("/test")
    public String chat(String msg){
        System.out.println(msg);
        return msg;
    }




    @MessageMapping("/chat/{roomName}/send")
    @SendTo("/topic/chat/{roomName}")
    public ChatMessageResponseDTO sendToRoom(
            @DestinationVariable String roomName,
            @Payload ChatMessageDTO msg

    ){

        Room room = roomService.getRoomByRoomName(roomName);
        ChatMessage chatMsg = ChatMessage.builder()
                                        .msg(msg.getMsg())
                                        .type(msg.getType())
                                        .receiverId(msg.getReceiverId())
                                        .senderId(msg.getSenderId())
                                        .createdAt(new Date())
                                         .build();
        chatMessageService.saveRoomMessageToDB(room,chatMsg);

        ChatMessageResponseDTO resp = ChatMessageResponseDTO.builder()
                .msg(msg.getMsg())
                .createdAt(new Date())
                .receiverId(msg.getReceiverId())
                .senderId(msg.getSenderId())
                .type(msg.getType())
                .build();

        return resp;
    }
}
