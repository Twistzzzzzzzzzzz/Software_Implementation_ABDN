package org.broky.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("comment")
public class Comment {
    @Id
    private String id;

    @Column("user_name")
    private String user_name;

    @Column("user_id")
    private String user_id;

    @Column("content")
    @NotBlank(message = "The content of the comment cannot be empty")
    @Size(min = 1, max = 500, message = "Length should be between 1 and 500 characters")
    private String content;

    public void generateId() {
        long randomNum = ThreadLocalRandom.current().nextLong(100_000_000_000L, 1_000_000_000_000L);
        this.id = String.format("%010d", randomNum);
    }
}