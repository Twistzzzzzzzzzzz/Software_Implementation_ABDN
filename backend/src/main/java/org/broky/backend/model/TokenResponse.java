package org.broky.backend.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponse {
    private String access_token;
    private String refresh_token;


}