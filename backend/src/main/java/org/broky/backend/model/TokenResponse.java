package org.broky.backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TokenResponse {
    private String access_token;
    private String refresh_token;

    public TokenResponse(String accessToken, String refreshToken) {
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
    }

    public TokenResponse() {
        this("", "");
    }
}