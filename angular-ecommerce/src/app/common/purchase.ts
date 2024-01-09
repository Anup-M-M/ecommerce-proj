
// main object that will use for sending over all the data that we read from checkout form.

import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

// frontend will assemble this purchase from all the form data and send it over to rest API for processing.

export class Purchase {

    customer : Customer;
    shippingAddress : Address;
    billingAddress : Address;
    order : Order;
    orderItems : OrderItem[];
}
