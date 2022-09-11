import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import logo from './img/logo.png';

import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import UserView from './components/UserView';
import Logout from './components/Logout';
import CreateProduct from './components/Vendor/CreateProduct';
import ViewProducts from './components/Vendor/ViewProducts';
import Dispatched from './components/Vendor/Dispatched';
import DispatchReady from './components/Vendor/DispatchReady';
import BuyProduct from './components/Customer/BuyProduct';
import ViewCustomerProducts from './components/Customer/ViewCustomerProducts';

class App extends React.Component
{
  constructor(props) {
    super(props);

    if(localStorage.getItem("isLogin") === null) {
      this.state = { isLogin: false, userType: 0, email: "" }
    } else {
      if ( localStorage.getItem("userType") === "0" ) {
        this.state = { isLogin: true, userType: 0, email: localStorage.getItem("email") }
      } else {
        this.state = { isLogin: true, userType: 1, email: localStorage.getItem("email") }
      }
    }
  }

  loginHandler = (email, password) => {
    
    axios({

        method:"POST",
        url:"http://localhost:8000/login",
        data:  {email: email, password: password},
        withCredentials: true,
        headers:{
            'Content-Type': 'application/json',
        }

    }).then((response)=>{

        if(response.data["success"] !== true) {
          alert(response.data["message"]);
        } else {

          console.log(response.data)

          let userType = 1;

          if (response.data["isVendor"] === true) {
            userType = 0;
          }

          localStorage.setItem("isLogin", true);
          localStorage.setItem("userType", userType);
          localStorage.setItem("email", email);

          this.setState({
            isLogin: true,
            userType: userType,
            email: email,
          });
        }
    })  
  

  }

  logoutHandler = () => {
    
    axios.post({
      method:"POST",
      url:"http://localhost:8000/logout",
      withCredentials: true,
    }).then((res) => {

      })
      .catch((err) => {
        console.log(err);
        console.log("Logout Failed.");
      })

    localStorage.removeItem("isLogin");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");

    this.setState({
      isLogin: false,
    });
  }

  render() {

    let Button;

    if (this.state.isLogin) {
      Button = <Link to="/logout" className="btn btn-danger text-white">Logout</Link>
    }
    else {
      Button = <Link to="/login" className="btn btn-success text-white">Login</Link>
    }

    return (
      <Router>
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand"><img src={logo} className="img-fluid" alt="logo"/></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/dashboard" className="text-dark">Dashboard</Link>
                </li>
              </ul>
              <div className="navbar-text">
                  {Button}
                </div>
            </div>
          </nav>
        </header>
        <Switch>
          <Route exact path="/" component={Landing}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" render={(props) => <Login loginHandler={this.loginHandler} userState={this.state}/>} />
          <Route exact path="/dashboard" render={(props) => <UserView userState={this.state}/>}/>
          <Route path="/dashboard/new-product" render={(props) => <CreateProduct userState={this.state}/>}/>
          <Route path="/dashboard/all-products" render={(props) => <ViewProducts userState={this.state}/>}/>
          <Route path="/dashboard/dispatch-ready" render={(props) => <DispatchReady userState={this.state}/>} />
          <Route exact path="/dashboard/dispatched" render={(props) => <Dispatched userState={this.state}/>}/>
          <Route exact path="/dashboard/buy-product" render={(props) => <BuyProduct userState={this.state}/>}/>
          <Route exact path="/dashboard/view-products" render={(props) => <ViewCustomerProducts userState={this.state}/>}/>
          <Route path="/logout" render={(props) => <Logout logoutHandler={this.logoutHandler}/>}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
