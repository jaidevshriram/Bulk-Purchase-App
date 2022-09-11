import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Register extends React.Component {

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
            url:"http://localhost:8000/register",
            data:this.formData,
            headers:{
                'Content-Type': 'application/json',
            }
        }).then((response)=>{
            // console.log(response);
            alert(response.data["message"]);
        })
    }

    render() {
        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-white bg-dark w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">Register</h1>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-2 col-form-label font-weight-bold">Name</label>
                            <div className="col-sm-10">
                                <input className="form-control" name="name" id="name" placeholder="John Doe" onChange={this.handleChange} required/>
                                <small className="form-text text-muted">This is the person's name</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="email" className="col-sm-2 col-form-label font-weight-bold">Email address</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" name="email" id="email" placeholder="joe@email.com" onChange={this.handleChange} required/>
                                <small className="form-text text-muted">This is used to log into the portal</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">Password</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" name="password" id="password" onChange={this.handleChange} required></input>
                                <small className="form-text text-muted">Remember the password</small>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">User Type</label>
                            <div className="col-sm-10">
                                <select className="form-control" id="isVendor" onChange={this.handleChange} required> 
                                    <option>Vendor</option>
                                    <option>Customer</option>
                                </select>
                                <small className="form-text text-muted">This cannot be changed</small>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-info w-100 my-5" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}