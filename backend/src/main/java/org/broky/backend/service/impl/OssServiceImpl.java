package org.broky.backend.service.impl;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.ObjectMetadata;
import org.broky.backend.service.OssService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class OssServiceImpl implements OssService {
    
    @Autowired
    private OSS ossClient;
    
    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;
    
    @Value("${aliyun.oss.endpoint}")
    private String endpoint;
    
    @Override
    public Mono<String> uploadFile(FilePart filePart, String folder) {
        return Mono.fromCallable(() -> {
            try {
                // 生成唯一文件名
                String originalFilename = filePart.filename();
                String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String fileName = folder + "/" + timestamp + "_" + UUID.randomUUID().toString() + extension;
                
                // 设置文件元数据
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(getContentType(extension));
                
                // 上传文件
                ossClient.putObject(bucketName, fileName, filePart.content().blockFirst().asInputStream(), metadata);
                
                // 返回文件访问URL
                String fileUrl = "https://" + bucketName + "." + endpoint.replace("https://", "") + "/" + fileName;
                return fileUrl;
                
            } catch (Exception e) {
                throw new RuntimeException("Fail to upload File " + e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
    
    @Override
    public Mono<Void> deleteFile(String fileUrl) {
        return Mono.fromRunnable(() -> {
            try {
                // 从URL中提取文件key
                String prefix = "https://" + bucketName + "." + endpoint.replace("https://", "") + "/";
                if (fileUrl.startsWith(prefix)) {
                    String fileKey = fileUrl.substring(prefix.length());
                    ossClient.deleteObject(bucketName, fileKey);
                }
            } catch (Exception e) {
                throw new RuntimeException("Fail to delete File" + e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    
    private String getContentType(String extension) {
        switch (extension.toLowerCase()) {
            case ".mp4":
                return "video/mp4";
            case ".avi":
                return "video/avi";
            case ".mov":
                return "video/quicktime";
            case ".wmv":
                return "video/x-ms-wmv";
            case ".flv":
                return "video/x-flv";
            default:
                return "application/octet-stream";
        }
    }
}
