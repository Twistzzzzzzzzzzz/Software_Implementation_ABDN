package org.broky.backend.service;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

public interface OssService {
    Mono<String> uploadFile(FilePart filePart, String folder);
    Mono<Void> deleteFile(String fileUrl);
}
