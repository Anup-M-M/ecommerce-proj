import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrederHistoryService {

  private orderUrl = environment.shopApiUrl + '/orders';

  // use HttpClient to make REST API calls
  constructor(private httpClient : HttpClient) { }

  getOrderHostory(theEmail : string): Observable<GetResponseOrderHistory>{

    // need to build the url based on customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

}

interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[]
  }
}
