package org.broky.backend.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

@Component
public class CensorWordFilter {

    private final Set<String> censorWords = new HashSet<>();

    @PostConstruct
    public void init() throws Exception {
        ClassPathResource resource = new ClassPathResource("static/CensorWords.txt");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                censorWords.add(line.trim().toLowerCase());
            }
        }
    }

    public boolean containsSensitiveWord(String content) {
        String lowerContent = content.toLowerCase();
        return censorWords.stream().anyMatch(lowerContent::contains);
    }
}