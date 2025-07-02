package com.chat.repo;

import com.chat.entity.ChatMessage;
import com.chat.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage,String> {

    List<ChatMessage> findByRoomName(Room room);

    // Find messages by Room's _id in DBRef
    @Query("{ 'roomName.$id' : ?0 }")
    List<ChatMessage> findByRoomNameId(String roomId);

    // Kept for reference, but not used due to missing 'name' field
    @Query("{ 'roomName.name' : ?0 }")
    List<ChatMessage> findByRoomNameName(String roomName);
}
