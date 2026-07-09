package com.example.ApproveIt.config;

import com.example.ApproveIt.entity.Category;
import com.example.ApproveIt.entity.Role;
import com.example.ApproveIt.repository.CategoryRepository;
import com.example.ApproveIt.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        seedRole("EMPLOYEE");
        seedRole("MANAGER");
        seedRole("ADMIN");

        seedCategory("Travel");
        seedCategory("Meals");
        seedCategory("Software");
        seedCategory("Office Supplies");
    }

    private void seedRole(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }

    private void seedCategory(String name) {
        if (categoryRepository.findAll().stream().noneMatch(c -> c.getName().equals(name))) {
            Category category = new Category();
            category.setName(name);
            category.setActive(true);
            categoryRepository.save(category);
        }
    }
}