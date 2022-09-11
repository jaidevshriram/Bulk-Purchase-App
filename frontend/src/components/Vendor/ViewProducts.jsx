import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.color = 'bg-dark';
        if(this.props.status === 1)
            this.color = 'bg-secondary'
        else if(this.props.status === 2)
            this.color = 'bg-warning'
        else if(this.props.status === 3)
            this.color = 'bg-danger'

        this.containerClass = "container my-5 p-5 rounded " + this.color;
    }

    cancel = () => {
        this.props.deleteHandler(this.props._id);
    }

    render() {
        return (
            <div className={this.containerClass}>
                <div className="row align-items-center">
                    <h1 className="font-weight-bold mr-auto text-white">{this.props.name}</h1>
                    <p className="my-auto text-white pr-3">Required Quantity: {this.props.requiredQuantity}</p>
                    <p className="text-white my-auto">Quantity Sold: {this.props.quantity}</p>
                    {
                        this.props.status < 2 ? <button className="ml-5 btn btn-danger" onClick={this.cancel}>Cancel</button> : <React.Fragment></React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default class ViewProducts extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: [],
        };

        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/view-products",
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                this.setState({products: response.data["products"]});
            }
        })
    }

    deleteItem = (_id) => {

        console.log("Deleting a product");

        let promise_delete;

        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/cancel-product",
            data: { id: _id },
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                promise_delete = new Promise((resolve, reject) => {
                    return this.setState({products: response.data["products"]});
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    returnItem = (product) => {

        if(!product)
            return;

        if(product.status === 1 || product.status === 2)
            return;

        return <Product {...product} deleteHandler={this.deleteItem} key={product._id}/>
    }

    render() {
        if(this.props.userState.isLogin === false || this.props.userState.userType === 1) {
            return <Redirect to='/login'/>
        }

        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-black bg-light w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">View All Products</h1>
                        </div>
                    </div>
                </div>

                {
                    this.state.products.map(this.returnItem)                    
                }
            </React.Fragment>
        )
    }
}