package com.springboot.ecommerce.service;

import com.springboot.ecommerce.dao.CustomerRepository;
import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.springboot.ecommerce.entity.Customer;
import com.springboot.ecommerce.entity.Order;
import com.springboot.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order info from dto
        Order order= purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();

        // check if this is an existing customers
        String theEmail = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        if(customerFromDB != null){
            customer = customerFromDB;
        }

        customer.add(order);

        //save to the Database
        customerRepository.save(customer);

        //return the response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate a random UUID(Universally Unique Identifier) number (UUID version-4)
        // Standardized methods for Generating unique IDs

        return UUID.randomUUID().toString();

    }
}
