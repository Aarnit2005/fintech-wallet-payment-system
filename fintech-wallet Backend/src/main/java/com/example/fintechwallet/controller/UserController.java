package com.example.fintechwallet.controller;

import com.example.fintechwallet.dto.UserResponse;
import com.example.fintechwallet.entity.User;
import com.example.fintechwallet.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        User savedUser =
                userService.registerUser(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User registered successfully",
                        "userId",
                        savedUser.getId()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        User user = userService
                .getUserByEmail(email);

        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }

        boolean success =
                userService.login(email, password);

        if (!success) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",
                        "userId",
                        user.getId(),
                        "name",
                        user.getName(),
                        "email",
                        user.getEmail()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {

        User user =
                userService.getUserById(id);

        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                );

        return ResponseEntity.ok(response);
    }
}