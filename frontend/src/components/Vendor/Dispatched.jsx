import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Product extends React.Component {
    reviews = (review) => {
        return <li>{review}</li>
    }

    render() {
        return (
            <div className="container m-5 rounded bg-info">
                <div className="row align-items-center">
                    <h1 className="m-3 font-weight-bold text-white">{this.props.name}</h1>
                    <h3 className="text-white">(Rating: {this.props.rating})</h3>
                </div>
                <div className="row px-4 pt-3 bg-light">
                    <div className="col">
                        <h2 className="font-weight-bold">Reviews</h2>
                        <div className="pt-3">
                            <ul>
                                {
                                    this.props.review ? this.props.review.map(this.reviews) : <React.Fragment></React.Fragment>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default class Dispatched extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };

        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/dispatched",
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                this.setState({products: response.data["products"]});
            }
        })
    }

    returnItem = (product) => {
        if(!product)
            return;

        return <Product {...product}/>
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
                            <h1 className="display-1">Dispatched Products</h1>
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