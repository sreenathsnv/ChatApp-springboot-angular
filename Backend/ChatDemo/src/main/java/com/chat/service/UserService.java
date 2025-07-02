package com.chat.service;

import com.chat.entity.SignUpRequest;
import com.chat.entity.User;
import com.chat.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String signUp(SignUpRequest signUpRequest) {

        if (userRepo.existsByEmail(signUpRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepo.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword())); // Hash password
        user.setEmail(signUpRequest.getEmail());
        user.setBio(signUpRequest.getBio());
        user.setCreatedAt(new Date());

        // Save user
        userRepo.save(user);
        return "User registered successfully";
    }


    public User getUserByEmail(String userEmail){

       if(userRepo.existsByEmail(userEmail)){

           return userRepo.findByEmail(userEmail).get();
       }
       return null;
    }


}
