import React from 'react';

export default class Landing extends React.Component {
    render() {

        return(
            <React.Fragment>
                <div className="container-fluid h-50 text-white bg-dark w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1 className="display-1">The Ultimate Bulk Order Solution</h1>
                        </div>
                    </div>
                </div>
                <div className="container-fluid h-25 text-white bg-secondary w-100">
                    <div className="row h-100 align-items-center justify-content-between">
                        <div className="col text-center">
                            <h1>Sell in bulk. Buy in bulk. Everyone benefits.</h1>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}