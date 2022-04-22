package io.adingeist.userservice.service;

import io.adingeist.userservice.domain.Post;
import io.adingeist.userservice.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional @Slf4j
public class PostServiceImplementation implements PostService {
    private final PostRepository postRepository;

    @Override
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post postPost(Post post) {
        log.info("Posting new post \"{}\" to the database.", post.getMessage());
        return postRepository.save(post);
    }
}
