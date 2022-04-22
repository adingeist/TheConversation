package io.adingeist.userservice.requests;

public class PostPostRequest {
    private String message;

    public PostPostRequest(String message) {
        this.message = message;
    }

    // Explicit default constructor needed to map request
    public PostPostRequest() {}

    public String getMessage() { return message; }
}
