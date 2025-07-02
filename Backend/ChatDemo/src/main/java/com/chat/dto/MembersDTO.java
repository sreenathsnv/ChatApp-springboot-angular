package com.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MembersDTO {

    private String username;
    private String bio;
    private String email;
}

