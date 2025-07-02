package com.chat.dto;

import com.chat.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class RoomResponseDTO {

    private String roomName;
    private String bio;
    private User createdBy;
    private List<MembersDTO> members;
}
