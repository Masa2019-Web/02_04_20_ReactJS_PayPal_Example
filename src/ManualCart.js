import React, {Component} from "react";
import ReactDOM from "react-dom";
import scriptLoader from 'react-async-script-loader';

const CLIENT_ID = 'SB_CLIENT_ID'; // Required. Replace SB_CLIENT_ID with your sandbox client ID.

const Loader = (
    <div className="lds-ring">
        <div/>
        <div/>
        <div/>
        <div/>
    </div>
);

let PayPalButtons = null;

class ManualCart extends Component {
    state = {
        loading: true,
        showCart: false,
        paidSuccess: false
    };

    componentWillReceiveProps({isScriptLoaded, isScriptLoadSucceed}, nextState) {
        if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
            if (isScriptLoadSucceed) {
                PayPalButtons = window.paypal.Buttons.driver('react',{React,ReactDOM});
                this.setState({...this.state,loading:false,showCart:true});
            } else this.props.onError()
        }
    }

    componentDidMount() {
        const {isScriptLoaded, isScriptLoadSucceed} = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {
            PayPalButtons = window.paypal.Buttons.driver('react',{React,ReactDOM});
            this.setState({...this.state,loading:false,showCart:true});
        }
    }

    createOrder = (data,action) => {
        return action.order.create({
            purchase_units:[
                {
                    description:'My order',
                    amount: {
                        value:200,
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
                {this.state.loading && Loader}
                {this.state.showCart && (
                <>
                    <h2>My SuperPuper Cart</h2>
                    <p>Product 348</p>
                    <p>Price: 200$</p>
                    <PayPalButtons
                        createOrder={(data,action) => this.createOrder(data,action)}
                        onApprove={this.onApprove}
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

export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(ManualCart);

