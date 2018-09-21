package com.rodyamirov.epsilon;

import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings({"Weakeraccess", "UnusedDeclaration"})
public class HelloResponseDTO {

    @JsonProperty("name")
    private String name;

    public HelloResponseDTO(String name) {
        this.name = name;
    }
}
