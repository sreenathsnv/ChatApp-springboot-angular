package com.chat.config;

import com.chat.service.CustomUserDetailsService;
import com.chat.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketChatConfiguration implements WebSocketMessageBrokerConfigurer {


    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    CustomUserDetailsService customUserDetailsService;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:4200")

                .withSockJS();

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.enableSimpleBroker("/test","/topic","/queue")
                ;
        registry.setApplicationDestinationPrefixes("/app");

        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            String email = jwtUtil.extractUserEmail(token);
                            UserDetails user =  customUserDetailsService.loadUserByUsername(email);
                            if (jwtUtil.validateToken(token, user)) {
                                UsernamePasswordAuthenticationToken authToken =
                                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                                accessor.setUser(authToken);
                                System.out.println("WebSocket JWT auth successful for user: " + email);
                            } else {
                                System.err.println("Invalid JWT token for user: " + email);
                            }
                        } catch (Exception e) {
                            System.err.println("WebSocket JWT auth failed: " + e.getMessage());
                            e.printStackTrace(); // Log stack trace for debugging
                        }
                    } else {
                        System.err.println("Missing or invalid Authorization header");
                    }
                }
                return message;
            }
        });
    }
}
