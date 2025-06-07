package org.broky.backend.model.Resources;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDetailResponse {
    private String article_id;
    private String title;
    private String content_address;
    private String author;

}
