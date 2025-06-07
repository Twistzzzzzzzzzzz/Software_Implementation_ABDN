package org.broky.backend.model.Resources;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoListResponse {
    private Integer total;
    private List<VideoListItem> items;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VideoListItem {
        private String video_id;
        private String title;
        private String pictrue_address;
    }
}
