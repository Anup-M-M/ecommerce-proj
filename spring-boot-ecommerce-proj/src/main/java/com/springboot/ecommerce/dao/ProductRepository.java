package com.springboot.ecommerce.dao;

import com.springboot.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    //behind the scene spring will execute the query similar to Select * From Product where category_id=?
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    //spring will execute the query similar to Select * From Product p where p.name Like CONCAT('%', :name , '%')
    Page<Product> findByNameContaining(@Param("name") String name, Pageable page);



}
