package com.example.ApproveIt.repository;

import com.example.ApproveIt.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}