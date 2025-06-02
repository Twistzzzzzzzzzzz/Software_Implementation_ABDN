package org.broky.backend.model;

public class ArticleDetailResponse {
    private String article_id;
    private String title;
    private String content_address;
    private String author;
    
    public ArticleDetailResponse() {}
    
    public ArticleDetailResponse(String article_id, String title, String content_address, String author) {
        this.article_id = article_id;
        this.title = title;
        this.content_address = content_address;
        this.author = author;
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
    
    public String getContent_address() {
        return content_address;
    }
    
    public void setContent_address(String content_address) {
        this.content_address = content_address;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
}
