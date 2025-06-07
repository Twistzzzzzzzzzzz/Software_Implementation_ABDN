package org.broky.backend.model.Resources;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDetailResponse {
    private String video_id;
    private String title;
    private String content_address;
    private String description;
    private List<CommentDetail> comment;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CommentDetail {
        private UserInfo user;
        private String content;
        private String ctime;
        private String comment_like;
        private Long comment_id;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private String uid;
        private String avatar;
        private String uname;
    }
}
