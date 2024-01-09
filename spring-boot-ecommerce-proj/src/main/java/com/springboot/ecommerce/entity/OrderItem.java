package com.springboot.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "order_item")
@Getter
@Setter
@ToString
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name= "image_url")
    private String imageUrl;

    @Column(name = "unit_price")
    private String unitPrice;

    @Column(name= "quantity")
    private String quantity;

    @Column(name = "product_id")
    private String productId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}
