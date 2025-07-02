package com.chat.util;

import com.chat.dto.MembersDTO;
import com.chat.dto.RoomResponseDTO;
import com.chat.entity.Room;
import com.chat.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class RoomUtil {

    public static List<MembersDTO> convertUserListToMemberList(List<User> users){

    return users
            .stream()
            .map(User::toMemberDTO)
            .toList();

    }

    public static RoomResponseDTO toRoomResponseDTO(Room room){

        return RoomResponseDTO.builder()
                .roomName(room.getRoomName())
                .bio(room.getBio())
                .createdBy(room.getCreatedBy())
                .members(convertUserListToMemberList(room.getMembers()))
                .build();
    }
}
