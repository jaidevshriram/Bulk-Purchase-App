import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.color = 'bg-info';
        this.containerClass = "container my-5 p-5 rounded " + this.color;
    }

    dispatch = () => {
        // console.log("Dispatching");
        this.props.dispatchHandler(this.props._id);
    }

    render() {
        return (
            <div className={this.containerClass}>
                <div className="row align-items-center">
                    <h1 className="font-weight-bold mr-auto text-white">{this.props.name}</h1>
                    {
                        this.props.status < 2 ? <button className="ml-5 btn btn-light" onClick={this.dispatch}>Dispatch</button> : <React.Fragment></React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default class DispatchReady extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };

        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/dispatch-ready",
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                this.setState({products: response.data["products"]});
            }
        })
    }

    dispatch = (id) => {
        // console.log("Dispatching the item");
        axios({
            method:"POST",
            url:"http://localhost:8000/vendor/dispatch",
            data: {id: id},
            withCredentials: true,    
        }).then((response)=>{
    
            if(response.data["success"] !== true) {
              alert(response.data["message"]);
            } else {
                window.location.reload();
            }
        })
    }

    returnItem = (product) => {
        if(!product)
            return;

        return <Product {...product} dispatchHandler={this.dispatch} key={product._id}/>
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
                            <h1 className="display-1">Dispatch Ready</h1>
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