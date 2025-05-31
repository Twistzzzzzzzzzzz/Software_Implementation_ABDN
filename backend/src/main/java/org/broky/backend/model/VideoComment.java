package org.broky.backend.model;

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
    private Long commentId;
    
    @Column("video_id")
    private String videoId;
    
    @Column("user_id")
    private String userId;
    
    @Column("content")
    private String content;
    
    @Column("comment_like")
    private Integer commentLike;
    
    @Column("ctime")
    private LocalDateTime ctime;
}
