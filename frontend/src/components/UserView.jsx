import React from 'react';
import { Redirect } from 'react-router-dom';

import CustomerView from './Customer/CustomerView';
import VendorView from './Vendor/VendorView';

export default class UserView extends React.Component {
    render() {
        if(this.props.userState.isLogin === false) {
            return <Redirect to='/login'/>
        }

        if (this.props.userState.userType === 0) {
            return <VendorView/>
        }
        else {
            return <CustomerView/>
        }
    }
}