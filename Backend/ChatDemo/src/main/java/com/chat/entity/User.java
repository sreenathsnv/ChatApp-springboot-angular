package com.chat.entity;


import com.chat.dto.MembersDTO;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Document("users")
public class User {


    @Id
    private String email;

    @Indexed(unique = true)
    private String username;

    private String bio;
    private String password;
    private Date createdAt;


    public MembersDTO toMemberDTO(){

        return MembersDTO.builder()
                .username(this.getUsername())
                .bio(this.getBio())
                .email(this.getEmail())
                .build();
    }

}
