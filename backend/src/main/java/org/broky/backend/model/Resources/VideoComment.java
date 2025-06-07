package org.broky.backend.model.Resources;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("video_comment")
public class VideoComment {
    @Id
    @Column("comment_id")
    private Long comment_id;
    
    @Column("video_id")
    private String video_id;
    
    @Column("user_id")
    private String user_id;
    
    @Column("content")
    private String content;
    
    @Column("comment_like")
    private Integer comment_like;
    
    @Column("ctime")
    private LocalDateTime ctime;
}
