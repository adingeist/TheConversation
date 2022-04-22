package io.adingeist.userservice.service;

import io.adingeist.userservice.domain.Post;

import java.util.List;

public interface PostService {
    List<Post> getPosts();
    Post postPost(Post post);
}
