package org.broky.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String base64EncodedSecret;

    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        byte[] decodedKey = Base64.getDecoder().decode(base64EncodedSecret);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateAccessToken(String username, String userId) {
        return buildToken(username, userId, "access_token", accessTokenExpirationMs);
    }

    public String generateRefreshToken(String username, String userId) {
        return buildToken(username, userId, "refresh_token", refreshTokenExpirationMs);
    }

    private String buildToken(String username, String userId, String tokenType, long expirationMs) {
        return Jwts.builder()
                .setClaims(new HashMap<>(Map.of(
                        "username", username,
                        "userId", userId,
                        "type", tokenType
                )))
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Mono<String> getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.error(new JwtException("Invalid authorization format"));
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if (!"access_token".equals(claims.get("type", String.class))) {
                return Mono.error(new JwtException("Invalid token type"));
            }

            String userId = claims.get("userId", String.class);
            return userId != null ?
                    Mono.just(userId) :
                    Mono.error(new JwtException("Missing user ID in token"));
        } catch (ExpiredJwtException e) {
            return Mono.error(new JwtException("Token expired"));
        } catch (SecurityException | MalformedJwtException e) {
            return Mono.error(new JwtException("Invalid token signature"));
        } catch (JwtException | IllegalArgumentException e) {
            return Mono.error(new JwtException("Invalid token"));
        }
    }
}