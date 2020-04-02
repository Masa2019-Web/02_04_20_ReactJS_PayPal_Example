import React, {Component} from "react";
import { PayPalButton } from "react-paypal-button-v2";


export default class extends Component{
    state ={
      showCart: true,
      paidSuccess:false
    };

    createOrder = (data,action) => {
        return action.order.create({
            purchase_units:[
                {
                    description:'Lib order',
                    amount: {
                        value:400,
                        currency_code:'USD'
                    }
                }
            ]
        });
    };

    onApprove = (data,action)=>{
        action.order.capture().then(details => {
            console.log('data',data);
            console.log('details',details);
            this.setState({...this.state,showCart:false,paidSuccess:true});
        });
    };

    render() {
        return (
            <div style={{
                width: '400px',
                margin: '100px auto',
                textAlign: 'center',
                border: '1px solid black',
                padding: '15px'
            }}>
                {this.state.showCart && (
                    <>
                        <h2>Lib Cart</h2>
                        <p>Product 345</p>
                        <p>Price: 400$</p>
                        <PayPalButton
                            createOrder={this.createOrder}
                            onApprove={this.onApprove}
                            locale='en_US'
                            style={{
                                size: 'small',
                                color: 'blue',
                                shape: 'pill',
                                label: 'checkout'
                            }}
                        />
                    </>
                )}
                {this.state.paidSuccess && (
                    <h2>Payment Success</h2>
                )}
            </div>
        );
    }
}
