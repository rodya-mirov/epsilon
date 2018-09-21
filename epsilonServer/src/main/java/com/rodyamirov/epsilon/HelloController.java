package com.rodyamirov.epsilon;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class HelloController {

    @RequestMapping("/hello")
    public HelloResponseDTO hello(
            @RequestParam(value = "name", defaultValue = "Unnamed") String name
    ) {
        System.out.println("Hello!");
        return new HelloResponseDTO(name);
    }
}
