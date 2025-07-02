package com.chat.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTUtil {


    @Value("${jwt-secret-key}")
    private String _secret;

    @Value("${jwt.expiration}")
    private Long _expiry;




    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(_secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaims(String token) {
        if (token == null) {
            throw new IllegalArgumentException("JWT token cannot be null");
        }

        String cleanedToken = token.trim();

        // Strip "Bearer " if present
        if (cleanedToken.startsWith("Bearer ")) {
            cleanedToken = cleanedToken.substring(7);
        }

        try {
            return Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(cleanedToken)
                    .getPayload();
        } catch (Exception e) {
            System.err.println("JWT Parsing Error: " + e.getMessage() + ", Token: [" + cleanedToken + "]");
            throw e;
        }
    }


    public <T> T extractClaim(String  token, Function<Claims, T> claimsResolver){

        Claims claims = extractAllClaims(token);
        System.out.println("Extracted Claims "+ claims.toString());
        return claimsResolver.apply(claims);

    }

    public String extractUserEmail(String token){

        return extractClaim(token,Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


    public String generateToken(UserDetails userDetails){

        Map<String , Object> claims = new HashMap<>();
        return createToken(claims,userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + _expiry))
                .signWith( getSecretKey(), Jwts.SIG.HS512)
                .compact();
    }

    public boolean validateToken(String token,UserDetails userDetails){
        final String username = extractUserEmail(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


}


