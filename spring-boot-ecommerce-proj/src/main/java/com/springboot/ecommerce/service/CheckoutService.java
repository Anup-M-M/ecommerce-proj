package com.springboot.ecommerce.service;

import com.springboot.ecommerce.dto.PaymentInfo;
import com.springboot.ecommerce.dto.Purchase;
import com.springboot.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;

}
