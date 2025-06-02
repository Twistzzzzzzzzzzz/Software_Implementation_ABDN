package org.broky.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("video")
public class Video {
    @Id
    @Column("video_id")
    private String videoId;
    
    @Column("title")
    private String title;
    
    @Column("picture_address")
    private String pictureAddress;
    
    @Column("content_address")
    private String contentAddress;
    
    @Column("description")
    private String description;
}
