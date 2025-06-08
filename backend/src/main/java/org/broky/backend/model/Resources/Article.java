package org.broky.backend.model.Resources;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("article")
public class Article {

    @Id
    private String id;

    private String title;

    private String excerpt;

    private String content;

    private String category;

    private String author;

    private String authorTitle;

    private String date;

    private int views;

    private int likes;

    private int readTime;

    private String image;
}