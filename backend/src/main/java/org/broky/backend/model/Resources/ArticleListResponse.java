package org.broky.backend.model.Resources;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleListResponse {
    private int total;
    private List<ArticleListItem> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ArticleListItem {
        private String article_id;
        private String title;
        private String summary;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private String published_at;

    }

}
