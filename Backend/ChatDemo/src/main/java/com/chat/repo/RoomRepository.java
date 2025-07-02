package com.chat.repo;

import com.chat.entity.Room;
import com.chat.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByMembersContains(User user);
    @Query("{ '$or': [ " +
            "  { 'roomName': { $regex: ?0, $options: 'i' } }, " +
            "  { 'bio': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Room> searchRoomsByName(String text);

}
