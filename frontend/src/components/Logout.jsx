import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Logout extends React.Component {
    constructor(props) {
        super(props)
        this.props.logoutHandler();
    }

    render() {

        return(
            <Redirect to="/"/>
        )
    }
}