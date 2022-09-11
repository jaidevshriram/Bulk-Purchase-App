import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
    }

    handleChange = (event) => {
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios({
            method:"POST",
            url:"http://localhost:8000/customer/review-product",
            data: {id: this.props._id, review: this.formData["review"]},
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true,   
        })
        .then((response)=>{
            if(response.data["success"] !== true) {
                alert(response.data["message"]);
            } else {
                window.location.reload();
            }
        })
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="review" className="h4 text-secondary col-sm-2 col-form-label font-weight-bold">Review</label><br/>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="review" id="review" placeholder="Loved it!" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success my-2" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}

class VendorReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
    }

    handleChange = (event) => {
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios({
            method:"POST",
            url:"http://localhost:8000/customer/review-vendor",
            data: {id: this.props._id, review: this.formData["review"]},
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true,   
        })
        .then((response)=>{
            if(response.data["success"] !== true) {
                alert(response.data["message"]);
            } else {
                window.location.reload();
            }
        })
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="review" className="h4 text-secondary col-sm-2 col-form-label font-weight-bold">Review</label><br/>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="review" id="review" placeholder="Amazing Person!" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success my-2" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
    }

    handleChange = (event) => {
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if( (parseInt(this.props.quantity) + parseInt(this.formData["quantity"])) > this.props.requiredQuantity ) {
            console.log("Cannot buy more than what's left!");
            console.log(this.formData["quantity"] + this.props.requiredQuantity, this.props.quantity);
            return;
        } 

        axios({
            method:"POST",
            url:"http://localhost:8000/customer/edit-product",
            data: {id: this.props._id, quantity: (parseInt(this.props.quantity) + parseInt(this.formData["quantity"]))},
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true,   
        })
        .then((response)=>{
            if(response.data["success"] !== true) {
                alert(response.data["message"]);
            } else {
                window.location.reload();
            }
        })
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="review" className="h4 text-secondary col-sm-2 col-form-label font-weight-bold">New Amount:</label><br/>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" name="quantity" id="quantity" placeholder="2" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success my-2" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}

const RateReview = (props) => {
    const [show, setShow] = useState(false);

    var rating = 5;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rate = () => axios({
            method:"POST",
            url:"http://localhost:8000/customer/rate-product",
            data: {id: props._id, rating: rating},
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true,   
        });
    const rate1 = () => {rating = 1; rate()}
    const rate2 = () => {rating = 2; rate()}
    const rate3 = () => {rating = 3; rate()}
    const rate4 = () => {rating = 4; rate()}
    const rate5 = () => {rating = 5; rate()}

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Rate and Review
            </Button>
    
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold">Rate and Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="d-inline font-weight-bold text-secondary my-auto">Rate: </h4>
                                <Button variant="danger" className="mx-2" onClick={rate1}>
                                        1
                                </Button>
                                <Button variant="warning"  className="mx-2" onClick={rate2}>
                                        2
                                </Button>
                                <Button variant="light" className="mx-2"  onClick={rate3}>
                                        3
                                </Button>
                                <Button variant="info" className="mx-2"  onClick={rate4}>
                                        4
                                </Button>
                                <Button variant="success" className="mx-2" onClick={rate5}>
                                        5
                                </Button>
                            </div>
                        </div>
                        <div className="row my-5">
                            <ReviewForm {...props}/>
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

const Edit = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="info" onClick={handleShow}>
                Edit Amount Placed
            </Button>
    
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold">Buy More:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row my-5">
                            <EditForm {...props}/>
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

const VendorRateReview = (props) => {
    const [show, setShow] = useState(false);

    var rating = 5;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rate = () => axios({
            method:"POST",
            url:"http://localhost:8000/customer/rate-vendor",
            data: {id: props._id, rating: (props.rating + rating)/2},
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true,   
        });
    const rate1 = () => {rating = 1; rate()}
    const rate2 = () => {rating = 2; rate()}
    const rate3 = () => {rating = 3; rate()}
    const rate4 = () => {rating = 4; rate()}
    const rate5 = () => {rating = 5; rate()}

    return (
        <>
            <Button variant="warning" onClick={handleShow}>
                Rate and Review Vendor
            </Button>
    
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold">Rate and Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4 className="d-inline font-weight-bold text-secondary my-auto">Rate: </h4>
                                <Button variant="danger" className="mx-2" onClick={rate1}>
                                        1
                                </Button>
                                <Button variant="warning"  className="mx-2" onClick={rate2}>
                                        2
                                </Button>
                                <Button variant="light" className="mx-2"  onClick={rate3}>
                                        3
                                </Button>
                                <Button variant="info" className="mx-2"  onClick={rate4}>
                                        4
                                </Button>
                                <Button variant="success" className="mx-2" onClick={rate5}>
                                        5
                                </Button>
                            </div>
                        </div>
                        <div className="row my-5">
                            <VendorReviewForm {...props}/>
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


class Product extends React.Component {
    constructor(props) {
        super(props);
        this.color = 'bg-dark';
        this.status = 'Waiting';
        if(this.props.status === 1) {
            this.color = 'bg-secondary';
            this.status = 'Placed';
        } else if(this.props.status === 2) {
            this.color = 'bg-warning';
            this.status = 'Dispatched';
        } else if(this.props.status === 3) {
            this.color = 'bg-danger';
            this.status = 'Cancelled';
        }

        this.containerClass = "container my-5 p-5 rounded " + this.color;
    }

    render() {
        return (
            <React.Fragment>
                <div className={this.containerClass}>
                    <div className="row align-items-center">
                        <h1 className="font-weight-bold text-white">{this.props.name}</h1>
                        <small className="mx-2 font-weight-bold mr-auto">{this.status}</small>
                        {
                            this.props.status === 0 ? <p className="my-auto text-white pr-3">Quantity Left: {parseFloat(this.props.requiredQuantity) - parseFloat(this.props.quantity)}</p> : <React.Fragment></React.Fragment>
                        }
                        {
                            this.props.status === 0 ? <Edit {...this.props}/> : <React.Fragment></React.Fragment>
                        }
                        {
                            this.props.status === 2 ? <RateReview {...this.props}/> : <React.Fragment></React.Fragment>
                        }
                        {
                            this.props.status === 1 ? <VendorRateReview {...this.props}/> : <React.Fragment></React.Fragment>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default class ViewCustomerProducts extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: [],
        };

        axios({
            method:"POST",
            url:"http://localhost:8000/customer/view-products",
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
        return <Product {...product} key={product._id}/>
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
                            <h1 className="display-1">View All Products</h1>
                        </div>
                    </div>
                </div>

                <div className="container-fluid pb-5">
                    {
                        this.state.products.map(this.returnItem)                    
                    }
                </div>
            </React.Fragment>
        )
    }
}