import useRequest from "../../hooks/use-requests";
import { Router } from 'next/router';
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout"
import useRequest from "../../hooks/use-requests"

const OrderIndex = ({orders, currentUser}) => {
 
     
    return( 
   <u>
       {orders.map(order => {
           return (
             <li key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
           );
       })}
   </u>
     );
};

OrderIndex.getInitialProps = async (context, client) => {    
    const { data } = await client.get(`api/orders`);

    return { orders: data };
  }

export default OrderIndex;