import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {Button, Modal } from 'react-bootstrap';

const VendorInfo = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="light" onClick={handleShow}>
                Vendor: {props.name}
            </Button>
    
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold">Vendor: {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="font-weight-bold">Reviews</h4>
                                <ul class="list-group pt-3">
                                {
                                    props.reviews.map((review) => <li className="list-group-item">{review}</li>)
                                }
                                </ul>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

class VendorProduct extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
    }

    handleChange = event => {
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;
    }

    handleSubmit = event => {
        event.preventDefault();

        if(this.formData.quantity > (this.props.product.requiredQuantity - this.props.product.quantity)) {
            alert("You cannot buy more than what's there!");
        } else {
            axios({
                method:"POST",
                url:"http://localhost:8000/customer/buy-product",
                data: {product: this.props.product, quantity: this.formData.quantity},
                headers:{
                    'Content-Type': 'application/json',
                },
                withCredentials: true,    
            }).then((response)=>{
                if(response.data["success"] !== true) {
                    alert(response.data["message"]);
                } else {
                    window.location.reload();
                }
            })
        }
    }

    render() {

        console.log(this.props);

        return (
            <React.Fragment>
                <div className="container py-1 my-5">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="font-weight-bold text-info my-auto">{this.props.product.name}</h3>
                            <br/>
                            <VendorInfo {...this.props.user}/>
                            <br/>
                            <small className="text-italic text-secondary">Vendor Rating: {this.props.user.rating}</small>
                        </div>
                        <div className="col">
                            <p className="my-auto">{this.props.product.requiredQuantity - this.props.product.quantity} Left</p>
                        </div>
                        <div className="col">
                            <p className="font-weight-bold my-auto">{this.props.product.price} per item</p>
                        </div>
                        <div className="col">
                            <form onSubmit={this.handleSubmit} className="my-auto">
                                <div className="form-group row my-auto">
                                    <div className="col">
                                        <input className="form-control" type="number" name="quantity" id="quantity" placeholder="Purchase Quantity" onChange={this.handleChange} required/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col">
                            <p className="text-italic my-auto">Rating: {this.props.product.rating}</p>
                        </div>
                        <button type="submit" className="d-inline btn btn-primary ml-auto" onClick={this.handleSubmit}>Buy</button>
                    </div>
                </div>
                <hr className="mx-3 "/>
            </React.Fragment>
        );
    }
}

export default class BuyProduct extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            results: [],
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;

        axios({
            method:"POST",
            url:"http://localhost:8000/customer/search-product",
            data: {search: event.target.value},
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                console.log(response.data["results"]);
                this.setState({results: response.data["results"]});
            }
        })
    }

    sortPrice = () => {
        let temp_results = this.state.results;
        let n = temp_results.length;
        for (let i = 0; i < n-1; i++)            
            for (let j = 0; j < n-i-1; j++)  
                if (temp_results[j].product.price > temp_results[j+1].product.price)  
                {
                    let temp = temp_results[j];
                    temp_results[j] = temp_results[j+1];
                    temp_results[j+1] = temp;
                }
        this.setState({results: temp_results});
    }

    sortQuantity = () => {
        let temp_results = this.state.results;
        let n = temp_results.length;
        for (let i = 0; i < n-1; i++)            
            for (let j = 0; j < n-i-1; j++)  
                if ((temp_results[j].product.requiredQuantity - temp_results[j].product.quantity) > (temp_results[j+1].product.requiredQuantity - temp_results[j+1].product.quantity))  
                {
                    let temp = temp_results[j];
                    temp_results[j] = temp_results[j+1];
                    temp_results[j+1] = temp;
                }
        this.setState({results: temp_results});
    }

    sortRating = () => {
        let temp_results = this.state.results;
        let n = temp_results.length;
        for (let i = 0; i < n-1; i++)            
            for (let j = 0; j < n-i-1; j++)  
                if (temp_results[j].user.rating > temp_results[j+1].user.rating)  
                {
                    let temp = temp_results[j];
                    temp_results[j] = temp_results[j+1];
                    temp_results[j+1] = temp;
                }
        this.setState({results: temp_results});
    }

    returnResults = (result) => {
        return <VendorProduct {...result} update={this.forceUpdate.bind(this)} key={result.product._id}/>
    }

    render() {
        if(this.props.userState.isLogin === false || this.props.userState.userType === 0) {
            return <Redirect to='/login'/>
        }

        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-black bg-light w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">Buy Product</h1>
                        </div>
                    </div>
                </div>
                <div className="container my-5 mx-auto">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <div className="col-12">
                                <input className="form-control" name="name" id="name" placeholder="Search for the product here" onChange={this.handleChange} required/>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="container my-5">
                    <div className="row">
                        <div className="col">
                            <h1 className="font-weight-bold text-center">
                                Search Results
                            </h1>
                        </div>
                    </div>
                    <div className="row pt-3 justify-content-center">
                        <button className="btn btn-dark mx-2" onClick={this.sortPrice}>Sort by Price</button>
                        <button className="btn btn-secondary mx-2" onClick={this.sortQuantity}>Sort by Quantity</button>
                        <button className="btn btn-dark mx-2" onClick={this.sortRating}>Sort by Rating</button>
                    </div>
                </div>

                {
                    this.state.results.map(this.returnResults)
                }
            </React.Fragment>
        )
    }
}