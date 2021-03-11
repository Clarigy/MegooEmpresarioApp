import React, { Component } from 'react';
import ButtonComponent from '../atom/Button';
import firebaseConfig from "../../firebase/setup.jsx";
import "firebase/auth";
import { Redirect } from 'react-router-dom';

export default class LogoutButton extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);

        const user = firebaseConfig.auth().currentUser;
        if (user) {
            console.log("Existe usuario")
            this.state = {
                isLogin: true,
                name: user.displayName,
            }
        } else {
            console.log("No existe usuario")
            this.state = {
                isLogin: false,
                name: "",
            }
        }

    }

    logout = () => {
        firebaseConfig.auth().signOut().then(() => {
            console.log("Cerro sesion");
        }).catch(error => {
            console.log(error);
        })
        this.setState({
            isLogin: false
        })
    }

    render() {
        return (
            <li className='nav-item my-2' >
                <a href="/" className='nav-link ' onClick={() => this.logout()}>
                    Cerrar sesion
                </a>
            </li>
        );
    }
}

