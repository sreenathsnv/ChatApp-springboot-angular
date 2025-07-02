package com.chat.controller;


import com.chat.entity.AuthenticationRequest;
import com.chat.entity.SignUpRequest;
import com.chat.service.UserService;
import com.chat.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registeruser(@RequestBody SignUpRequest signUpRequest){

        return ResponseEntity.ok(Map.of("message",userService.signUp(signUpRequest)));


    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authRequest) {

        //System.out.println("Request Recieved"+authRequest);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUserEmail(), authRequest.getPassword())
        );


        //System.out.println("--------------------------");

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUserEmail());
        //System.out.println("AuthentiactionManager received the user "+ userDetails);
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        return ResponseEntity.ok(response);
    }
}
