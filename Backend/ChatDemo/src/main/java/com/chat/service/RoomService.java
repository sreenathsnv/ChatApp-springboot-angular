package com.chat.service;


import com.chat.dto.RoomDTO;
import com.chat.dto.RoomResponseDTO;
import com.chat.entity.Room;
import com.chat.entity.User;
import com.chat.repo.RoomRepository;
import com.chat.util.RoomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;


    public Room getRoomByRoomName(String RoomName){

        if(roomRepository.existsById(RoomName)){
            return roomRepository.findById(RoomName).get();
        }

        return null;

    }

    public boolean createRoom(RoomDTO roomDto, User user){

        Room room = new Room();
        room.setRoomName(roomDto.getRoomName());
        room.setBio(roomDto.getBio());
        room.setCreatedBy(user);
        List<User> users = new ArrayList<User>();
        users.add(user);
        room.setMembers(users);

        try{
            roomRepository.save(room);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    public List<RoomResponseDTO> getAllAvailableRooms(){

        List<Room> rooms =  roomRepository.findAll();

        return rooms
                .stream()
                .map(room-> RoomResponseDTO.builder()
                        .roomName(room.getRoomName())
                        .bio(room.getBio())
                        .members(
                                room.getMembers().stream()
                                        .map(User::toMemberDTO)
                                        .toList()
                        )
                        .build()
                ).toList();

    }


    public List<RoomResponseDTO> getAllUserRooms(User user){

        List<Room> rooms = roomRepository.findByMembersContains(user);


//        System.err.println("User rooms "+ rooms);

        return rooms
                .stream()
                .map(room-> RoomResponseDTO.builder()
                        .roomName(room.getRoomName())
                        .bio(room.getBio())
                        .members(
                                room.getMembers().stream()
                                        .map(User::toMemberDTO)
                                        .toList()
                        )
                        .build()
                ).toList();
    }


    public String joinRoom(String roomName, User user) {

        Optional<Room> room = roomRepository.findById(roomName);
        if(room.isPresent()){
           Room existingRoom = room.get();
           List<User> members = existingRoom.getMembers();
           members.add(user);
            existingRoom.setMembers(members);
           roomRepository.save(existingRoom);
           System.err.println("User has been added to the group");
           return "Member has been added";
        }
        else{
            throw new RuntimeException("room does not exist");
        }


    }

    public List<RoomResponseDTO> getRoomByName(String roomName){

        List<Room> rooms = roomRepository.searchRoomsByName(roomName);
        return rooms.stream()
                .map(RoomUtil ::toRoomResponseDTO )
                .toList();
    }

    public Boolean leaveFromRoom(User user, String roomName) {

        Optional<Room> room = roomRepository.findById(roomName);


        if(room.isPresent()){

            boolean isMember = room.get().getMembers()
                    .stream()
                    .anyMatch(member -> member.getEmail().equals(user.getEmail()));


            Room existingRoom = room.get();

            if(isMember){
                if(existingRoom.getMembers().size() == 1){
                    roomRepository.delete(existingRoom);
                    return true;
                }
                List<User> updatedMembers = existingRoom.getMembers().stream()
                        .filter(u-> !u.getUsername().equals(user.getUsername()))
                        .toList();
                existingRoom.setMembers(updatedMembers);
                roomRepository.save(existingRoom);
                return true;
            }

        }
        return false;

    }
}
