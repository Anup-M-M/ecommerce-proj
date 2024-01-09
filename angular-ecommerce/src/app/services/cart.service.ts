import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[]=[];

  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage = sessionStorage;
//  storage : Storage = localStorage;

  constructor() { 

    // read data from storage
    // JSON.parse(...) Reads JSON string and converts to javascript object
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      this.computeCartTotals();
    }

  }

  addToCart(theCartItem : CartItem){

    // check if we have the item in our cart
    let alreadyExistingsInCart : boolean = false;
    let existingCartItem!: CartItem; 

    if(this.cartItems.length > 0){
      // find the item in the cart based on item id

      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }

      // existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistingsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistingsInCart){
      // increment the quantity
      existingCartItem.quantity++;
    }else{
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity 
    this.computeCartTotals();
    
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue); 
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems(){
    // JSON.stringify() is converts a JavaScript object or value to a JSON string. often used when sending data from a client to a server.
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart');

    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalProce=${subTotalPrice} `);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantityValue: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id === theCartItem.id
    );

    // if found, remove the item from the array at the give index
    if( itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
