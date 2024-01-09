package com.springboot.ecommerce.dto;

import lombok.Data;

// Use this class to send back a Java Object as JSON
@Data
public class PurchaseResponse {

    // lombok @Data will generate constructor for final fields only or @NonNull annotation on the field instead of final
    private final String orderTrackingNumber;
}
