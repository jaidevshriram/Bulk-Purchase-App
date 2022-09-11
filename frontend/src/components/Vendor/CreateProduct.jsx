import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class CreateProduct extends React.Component {
    constructor(props) {
        super(props);
        this.formData = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        event.preventDefault();
        this.formData[event.target.id] = event.target.value;
    }

    handleSubmit(event){
        event.preventDefault();

        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/new-product",
            data: {
                name: this.formData["name"],
                requiredQuantity: parseInt(this.formData["quantity"]),
                price: parseFloat(this.formData["price"]),
            },
            withCredentials: true,
            headers:{
                'Content-Type': 'application/json',
            }
        }).then((response)=>{
            alert(response.data["message"]);
        })
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
                            <h1 className="display-1">Create New Product</h1>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-2 col-form-label font-weight-bold">Name</label>
                            <div className="col-sm-10">
                                <input className="form-control" name="name" id="name" placeholder="Soap" onChange={this.handleChange} required/>
                                <small className="form-text text-muted">This is the product's name</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="email" className="col-sm-2 col-form-label font-weight-bold">Price</label>
                            <div className="col-sm-10">
                                <input type="number" className="form-control" name="price" id="price"  onChange={this.handleChange} required/>
                                <small className="form-text text-muted">This is price per item</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">Quantity</label>
                            <div className="col-sm-10">
                                <input type="number" className="form-control" name="quantity" id="quantity" onChange={this.handleChange} required></input>
                                <small className="form-text text-muted">Number of items</small>
                            </div>
                        </div>


                        <button type="submit" className="btn btn-success w-100 my-5" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}