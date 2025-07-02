package com.chat.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("rooms")
public class Room {

    @Id
    private String roomName;
    private String bio;
//    private
    @DBRef
    private User createdBy;
    @DBRef
    private List<User> members;


}
