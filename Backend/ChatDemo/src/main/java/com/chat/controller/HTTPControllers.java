package com.chat.controller;

import com.chat.dto.ChatMessageResponseDTO;
import com.chat.dto.RoomDTO;
import com.chat.dto.RoomResponseDTO;
import com.chat.entity.ChatMessage;
import com.chat.entity.Room;
import com.chat.entity.User;
import com.chat.service.ChatMessageService;
import com.chat.service.RoomService;
import com.chat.service.UserService;
import com.chat.util.ChatMessageUtil;
import com.chat.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET,RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = {"Authorization", "Content-Type"})
@RequestMapping("/api")
public class HTTPControllers {


    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping("/get-all-rooms")
    public Room[] getAllPublicRooms(){

        return null;
    }

    @PostMapping("/room/create")
    public ResponseEntity<?> createRoom(
            @RequestBody RoomDTO roomDTO,
            @RequestHeader(name = "Authorization") String token){

        //System.out.println("Token received"+ token);
        String userEmail = jwtUtil.extractUserEmail(token);
        //System.out.println("User Email"+ userEmail);
        User user = userService.getUserByEmail(userEmail);
        if(user == null){

            return ResponseEntity.badRequest().build();
        }

        roomService.createRoom(roomDTO,user);

        return ResponseEntity.ok(Map.of("message","ok"));
    }

    @GetMapping("/room/all")
    public ResponseEntity<?> getAllRooms(@RequestHeader(name = "Authorization") String token){

        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }

        List<RoomResponseDTO> rooms = roomService.getAllAvailableRooms();

        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/room/{roomName}/messages")
    public ResponseEntity<?> getAllRoomMessages(
            @RequestHeader(name = "Authorization") String token,
            @PathVariable(name = "roomName" ) String roomName

    ){
        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }

        List<ChatMessage> messages = chatMessageService.getAllRoomMessages(roomName);
        System.err.println("Messages from the backend"+messages);
        List<ChatMessageResponseDTO> messagesDTOs =  messages.stream()
                .map(ChatMessageUtil::toChatMessageResponseDTO)
                .toList();

        return ResponseEntity.ok(messagesDTOs);

    }

    @GetMapping("/room/user")
    public ResponseEntity<?> getAllUserRooms(
            @RequestHeader(name = "Authorization") String token

    ){

        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }



        return ResponseEntity.ok(roomService.getAllUserRooms(user));
    }

    @PostMapping("/room/{roomName}/join")
    public ResponseEntity<?> joinRoom(
            @RequestHeader(name = "Authorization") String token,
            @PathVariable(name = "roomName" ) String roomName
    ){

        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }

        try{
            return ResponseEntity.ok(Map.of("success",roomService.joinRoom(roomName,user)));
        } catch (Exception e) {
           return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getRoomByName(
            @RequestHeader(name = "Authorization") String token,
            @RequestParam String name
    ){

        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }

        return ResponseEntity.ok(roomService.getRoomByName(name));
    }

    @DeleteMapping("/room/{roomName}/leave")
    public ResponseEntity<?> leaveRoom(
            @PathVariable String roomName,
            @RequestHeader(name = "Authorization") String token
    ){

        String userEmail = jwtUtil.extractUserEmail(token);
        User user = userService.getUserByEmail(userEmail);

        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error","Unauthorized"));
        }

        try{
            return ResponseEntity.ok(roomService.leaveFromRoom(user,roomName));
        } catch (RuntimeException e) {
            return  ResponseEntity.badRequest().build();
        }
    }

}
