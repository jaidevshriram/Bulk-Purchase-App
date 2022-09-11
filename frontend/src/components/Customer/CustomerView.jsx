import React from 'react';
import { Link } from "react-router-dom";

export default class VendorView extends React.Component {
    render() {
        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-black bg-primary w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1 text-white">Customer</h1>
                        </div>
                    </div>
                </div>

                <div className="container my-5">
                    <div className="row h-100">
                        <div className="col">
                            <h1 className="font-weight-bold">Buy a Product</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/buy-product" className="btn btn-danger my-1">Go!</Link>
                        </div>
                        <div className="col">
                            <h1 className="font-weight-bold">View Ordered Products</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/view-products" className="btn btn-warning my-1">Go!</Link>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}