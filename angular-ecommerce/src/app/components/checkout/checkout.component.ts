import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number=0;

  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];

  countries : Country[] = [];

  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  storage : Storage = sessionStorage;

  // initilize the Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo : PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any= "";
  isDisabled: boolean = false;
  
  constructor(private formBuilder : FormBuilder, 
              private shopFormService : ShopFormService,
              private cartService : CartService,
              private checkoutService : CheckoutService,
              private router : Router){}

  ngOnInit(): void { 

    // setup stripe payment form
    this.setupStripePaymentForm();
    
    this.reviewCartDetails();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer : this. formBuilder.group({
        firstName : new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2), 
                                   ShopValidators.notOnlyWhitespace]),
        lastName : new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2), 
                                   ShopValidators.notOnlyWhitespace]),
        email : new FormControl(theEmail,
                                [Validators.required, 
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street : new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidators.notOnlyWhitespace]),
        city : new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidators.notOnlyWhitespace]),
        state : new FormControl('', [Validators.required,]),
        country : new FormControl('', [Validators.required,]),
        zipCode : new FormControl('', [Validators.required, Validators.minLength(2), 
                                       ShopValidators.notOnlyWhitespace])
      }),
      billingAddress : this.formBuilder.group({
        street : new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidators.notOnlyWhitespace]),
        city : new FormControl('', [Validators.required, Validators.minLength(2), 
                                    ShopValidators.notOnlyWhitespace]),
        state : new FormControl('', [Validators.required,]),
        country : new FormControl('', [Validators.required,]),
        zipCode : new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ShopValidators.notOnlyWhitespace])
      }),   
      creditCard : this.formBuilder.group({
        /*
        cardType :  new FormControl('', [Validators.required]),
        nameOnCard : new FormControl('', [Validators.required, Validators.minLength(2), 
                                          ShopValidators.notOnlyWhitespace]),
        cardNumber : new FormControl('', [Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode : new FormControl('', [Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth : [''],
        expirationYear : ['']
        */ 
      })
    });


    /*
    // populate the credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("StartMonth : "+ startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate the credit card years
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years : "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    */

    // populate countries
      this.shopFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries : "+ JSON.stringify(data));
          this.countries = data ;
        }
      );
  }

  setupStripePaymentForm() {
    
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card elements and hide zip code field
    this.cardElement = elements.create('card', { hidePostalCode: true});

    // add a instanse of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContext = "";
      }else if(event.error){
        // show validation error to customer
        this.displayError.textContext = event.error.message;
      }


    });

  }

  reviewCartDetails() {
    
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    
    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCartType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCartNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creditCardFormGroup?.value.expirationYear);

    // if current year equals the selected year, then start with current month
    let startMonth : number ;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }else{
      startMonth = 1; 
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }  
    );
    
  }

  // coptShippingAddressToBillingAddress(event) {
  //   if(event.target.checked){
  //     this.checkoutFormGroup.controls['billingAddress']
  //       .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
  //   }
  //   else{
  //     this.checkoutFormGroup.controls['billingAddress'].reset();
  //   }
  // }

  onSubmit(){
    console.log("Handling the sumbit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
      // Long Way
    /*
    let orderItems: OrderItem[] = [];
    for(let i=0; i<cartItems.length; i++){
      orderItems[i]= new OrderItem(cartItems[i]);
    }
    */

      //short way
    let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));  
      
    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase shipping address, billing address , 
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry : State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry : State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    
    //populate purchase order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`this.paymentInfo.amount : ${this.paymentInfo.amount}`);

    /*
    // call Rest API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next : response => {
          alert(`Your order has been received.\n Order tracking numver : ${response.orderTrackingNumber}`)
          
          //reset cart
          this.resetCart();
        },
        error : err => {
          alert(`Tjere has been error : ${err.message}`); 
        }
      }
    );
    */

    // if valid form then 
    // - create payment intent
    // - confirm card payment
    // -place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContext === ""){

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, 
            {
              payment_method : {
                card : this.cardElement,
                billing_details: {
                  email : purchase.customer.email,
                  name : `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city:purchase.billingAddress.city,
                    state:purchase.billingAddress.state,
                    postal_code:purchase.billingAddress.zipCode,
                    country:this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false})
            .then((result : any) => {
              if(result.error){
                // inform the customer there was an error 
                alert(`There was an error : ${result.error.message}`);
                this.isDisabled = false;
              }else{
                // call REST API via the checkoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                    // reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error : ${err.message}`);
                    this.isDisabled= false;
                  }
                });
              }
            });
        }
      );
    } else{
      this.checkoutFormGroup.markAllAsTouched();
      return ;
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email addrss is: "+ this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The Shipping Address country is : "+ this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The Shipping Address state is : "+ this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }
  
  resetCart() {   
    //reset the cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // updates storage with latest state of the cart
    this.cartService.persistCartItems();

    //reset the form data
    this.checkoutFormGroup.reset();

    // navigate back to home page
    this.router.navigateByUrl("/products")
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`); 
    console.log(`${formGroupName} country name : ${countryName}`);
    
    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first item bt defalut
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
    
  }

}
