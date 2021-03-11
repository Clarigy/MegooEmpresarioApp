import React, { Component } from "react";
import ButtonComponent from "../atom/Button";
import firebaseConfig from "../../firebase/setup.jsx";
import "firebase/auth";
import { Redirect } from "react-router-dom";

export default class LoginButton extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);

        this.state = {
            isLogin: false,
            name: "",
            userid: "",
        }
    }

    login = () => {

        
    
        let provider;

        if (this.props.Method === "Celular") {
             provider = new firebaseConfig.auth.PhoneAuthProvider();

        } else if (this.props.Method === "Google") {
            provider = new firebaseConfig.auth.GoogleAuthProvider();
           
        } else if (this.props.Method === "Facebook") {
            provider = new firebaseConfig.auth.FacebookAuthProvider();
        }

        firebaseConfig.auth().signInWithPopup(provider).then(result => {
            
            console.log(result);
        }).catch(error => {
            console.log(error);
        });

      


  


    }



   

    componentDidMount = () => {

        firebaseConfig.auth().onAuthStateChanged(user => {
            
            if (user) {  
            
                console.log("Usuario logueado correctamente");


                this.setState({
                    isLogin: true,
                    name: user.displayName,
                    userid: user.uid
                });
               // console.log(user.displayName);
            } else {
                console.log("Usuario no logueado");
            }
        })

    

}


    render() {
        return (
            < React.Fragment >
                {
                    this.state.isLogin === false
                        ? <ButtonComponent text={"Ingresar con " + this.props.Method} variant="contained" color="secondary" onClick={this.login} icon={this.props.Icon} />
                        : <Redirect
                            to={{
                                //pathname: "/perfil",
                                data: "mia"
                            }}
                        />
                }
            </ React.Fragment >
        )
    }
}