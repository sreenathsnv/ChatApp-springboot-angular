package com.chat.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {

    private String email;
    private String username;
    private String bio;
    private String password;
}
