package com.chat.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;


public class JWTSecretBuilder {


    private static SecretKey generateSecureKey() {

        SecretKey key = Jwts.SIG.HS512.key().build();
        //System.out.println("SecretKey bean created: " + key);
        return key;
    }


    public static void main(String[] args) {

        SecretKey key = Jwts.SIG.HS512.key().build();
        String base64Key = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Base64 Encoded Secret Key = " + base64Key);
    }
}
