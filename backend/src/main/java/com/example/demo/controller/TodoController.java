package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.service.TodoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return service.create(todo);
    }

    @GetMapping
    public List<Todo> getAll(@RequestParam(required = false) Boolean completed) {
        return service.getAll(completed);
    }


@PutMapping("/{id}")
public Todo update(@PathVariable Long id,
                   @RequestBody Todo updatedTodo) {
    return service.update(id, updatedTodo);
}



    


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
