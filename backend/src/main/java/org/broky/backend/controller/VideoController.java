package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.ApiResponse;
import org.broky.backend.model.Resources.VideoComment;
import org.broky.backend.model.Resources.VideoDetailResponse;
import org.broky.backend.model.Resources.VideoListResponse;
import org.broky.backend.service.JwtTokenService;
import org.broky.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;

@Tag(name = "VideoController", description = "视频管理")
@RestController
@RequestMapping("/api/v1/resources")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Operation(summary = "获取视频列表")
    @GetMapping("/video")
    public Mono<ApiResponse<VideoListResponse>> getVideoList(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "1") int page)
    {
        return videoService.getVideoList(size, page)
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(65, e.getMessage())));
    }
    
    @Operation(summary = "获取具体视频")
    @GetMapping("/video/{video_id}")
    public Mono<ApiResponse<VideoDetailResponse>> getVideoDetail(@PathVariable String video_id) {
        return videoService.getVideoDetail(video_id)
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(63, e.getMessage())));
    }

    @Operation(summary = "提交对视频的评论")
    @PostMapping("/video/comment/{video_id}")
    public Mono<ApiResponse<VideoComment>> createVideoComment(
            @PathVariable String video_id,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        return jwtTokenService.getUserIdFromToken(authHeader)
                .flatMap(userId -> videoService.createVideoComment(video_id, request.get("content"), userId))
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
    }
    
    @Operation(summary = "提交对评论的点赞")
    @PutMapping("/video/comment-like/{comment_id}")
    public Mono<ApiResponse<Map<String, Object>>> updateCommentLike(
            @PathVariable Long comment_id,
            @RequestBody Map<String, Integer> request) {
        Integer originLike = request.get("origin_like");
        Integer updateLike = request.get("update_like");
        
        return videoService.updateCommentLike(comment_id, originLike, updateLike)
                .then(Mono.just(ApiResponse.<Map<String, Object>>success(Map.of())))
                .onErrorResume(e -> Mono.just(ApiResponse.<Map<String, Object>>error(1, e.getMessage())));
    }
    
    @Operation(summary = "上传视频文件")
    @PostMapping("/video/upload")
    public Mono<ApiResponse<Map<String, String>>> uploadVideo(
            @RequestPart("file") Mono<FilePart> filePart,
            @RequestHeader("Authorization") String authHeader) {
        return jwtTokenService.getUserIdFromToken(authHeader)
                .flatMap(userId -> filePart)
                .flatMap(file -> videoService.uploadVideo(file))
                .map(contentAddress -> ApiResponse.success(Map.of("content_address", contentAddress)))
                .onErrorResume(e -> Mono.just(ApiResponse.<Map<String, String>>error(1, e.getMessage())));
    }
    
    @Operation(summary = "上传视频封面图片")
    @PostMapping("/video/upload-image")
    public Mono<ApiResponse<Map<String, String>>> uploadImage(
            @RequestPart("file") Mono<FilePart> filePart,
            @RequestHeader("Authorization") String authHeader) {
        return jwtTokenService.getUserIdFromToken(authHeader)
                .flatMap(userId -> filePart)
                .flatMap(file -> videoService.uploadImage(file))
                .map(pictureAddress -> ApiResponse.success(Map.of("picture_address", pictureAddress)))
                .onErrorResume(e -> Mono.just(ApiResponse.<Map<String, String>>error(1, e.getMessage())));
    }
}
