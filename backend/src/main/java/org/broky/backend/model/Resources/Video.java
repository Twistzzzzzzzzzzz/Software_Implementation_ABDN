package org.broky.backend.model.Resources;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private String video_id;
    
    @Column("title")
    private String title;
    
    @Column("picture_address")
    private String picture_address;
    
    @Column("content_address")
    private String content_address;
    
    @Column("description")
    private String description;
}
