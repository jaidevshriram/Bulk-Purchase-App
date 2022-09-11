import React from 'react';
import { Link } from "react-router-dom";

export default class VendorView extends React.Component {
    render() {
        return(
            <React.Fragment>
                <div className="container-fluid h-25 text-black bg-warning w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">Vendor</h1>
                        </div>
                    </div>
                </div>

                <div className="container my-5">
                    <div className="row h-100">
                        <div className="col">
                            <h1 className="font-weight-bold">Create a new Product</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/new-product" className="btn btn-danger my-1">Go!</Link>
                        </div>
                        <div className="col">
                            <h1 className="font-weight-bold">View All Products</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/all-products" className="btn btn-warning my-1">Go!</Link>
                        </div>
                    </div>
                    <div className="row pt-5">
                        <div className="col">
                            <h1 className="font-weight-bold">Dispatched Orders</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/dispatched" className="btn btn-success my-1">Go!</Link>
                        </div>
                        <div className="col">
                            <h1 className="font-weight-bold">View Orders ready to dispatch</h1>
                            <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec finibus est. Suspendisse quis lectus mattis, dapibus urna at, vestibulum nisi. Vivamus eget arcu id dui fermentum euismod at sit amet velit. In hac habitasse platea dictumst.</p>
                            <Link to="/dashboard/dispatch-ready" className="btn btn-info my-1">Go!</Link>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}