package org.broky.backend.model;

import java.util.List;

public class ArticleListResponse {
    private int total;
    private List<ArticleListItem> items;
    
    public ArticleListResponse() {}
    
    public ArticleListResponse(int total, List<ArticleListItem> items) {
        this.total = total;
        this.items = items;
    }
    
    public int getTotal() {
        return total;
    }
    
    public void setTotal(int total) {
        this.total = total;
    }
    
    public List<ArticleListItem> getItems() {
        return items;
    }
    
    public void setItems(List<ArticleListItem> items) {
        this.items = items;
    }
    
    public static class ArticleListItem {
        private String article_id;
        private String title;
        private String summary;
        private String published_at;
        
        public ArticleListItem() {}
        
        public ArticleListItem(String article_id, String title, String summary, String published_at) {
            this.article_id = article_id;
            this.title = title;
            this.summary = summary;
            this.published_at = published_at;
        }
        
        public String getArticle_id() {
            return article_id;
        }
        
        public void setArticle_id(String article_id) {
            this.article_id = article_id;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getSummary() {
            return summary;
        }
        
        public void setSummary(String summary) {
            this.summary = summary;
        }
        
        public String getPublished_at() {
            return published_at;
        }
        
        public void setPublished_at(String published_at) {
            this.published_at = published_at;
        }
    }
}
