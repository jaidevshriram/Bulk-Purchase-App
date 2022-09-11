import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {

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
        this.props.loginHandler(this.formData["email"], this.formData["password"]);
    }

    render() {
        if(this.props.userState.isLogin === true) {
            return <Redirect to='/dashboard'/>
        }

        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-white bg-dark w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">Login</h1>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <form onSubmit={this.handleSubmit}>

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

                        <button type="submit" className="btn btn-success w-100 my-5" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}