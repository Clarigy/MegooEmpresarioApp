import React, {Component, useState, useEffect} from 'react';
import { startUi } from '../../firebase';
import firebase from '../../firebase';
import logo from '../../assets/login/logo.svg';
import banner from '../../assets/login/login.jpg';
import '../../assets/styles/login/login.scss';
import auth from "../../firebase/setup.jsx";

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LoginButton from '../../components/molecule/LoginButton';
import Facebook from '@material-ui/icons/Facebook';
import Mail from '@material-ui/icons/Mail';
import Smartphone from '@material-ui/icons/Smartphone';
import { AuthContext } from '../../firebase/context';

const LoginNew = () => {

    document.getElementById('accordionSidebar').style.display = 'none';
    

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hasAcount, setHasAcount] = useState(false);

    const clearInputs = () =>{
        setEmail('');
        setPassword('');
    }
    const clearErros = () =>{
        setPasswordError('');
        setEmailError('');
    }

    const handleLogin = () => {
        clearErros();
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .cath(err => {
                switch(err.code){
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        setEmailError(err.message);
                    break;
                    case "auth/wrong-password":
                        setPasswordError(err.message);
                    break;

                }

            });
    };

    const handleSignup = () => {
        clearErros();
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .cath((err) => {
                switch(err.code){
                    case "auth/email-already-in-use":
                    case "auth/invalid-email":
                        setEmailError(err.message);
                    break;
                    case "auth/weak-password":
                        setEmailError(err.message);
                    break;
                }

            });
    };

    const handleLogout = () => {
        firebase.auth().signOut();      
    }

    const authListener = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                clearInputs();
                setUser(user);    
            } else{
                setUser('');
            } 
        });
    };

    useEffect(() => {
        authListener();
    }, []);


/* <section className="Login">
            <div className="loginContainer">
                <label>Username</label>
                <input type="text" autoFocus required value={email} onChanged={e => setEmail(e.target.value)}></input>
                <p className="errorMsg">{emailError}</p>
                <label>Password</label>
                <input type="text" autoFocus required value={pasword} onChanged={e => setPassword(e.target.value)}></input>
                <p className="errorMsg">{passwordError}</p>
            </div>
        </section>*/ 


    return (<div>
        <main>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-6 login-section-wrapper'>
                <div className='brand-wrapper'>
                  <img src={logo} alt='logo' className='logo' />
                </div>
                <div className='login-wrapper my-auto'>
                  
                  <div id="firebaselogin">

                  </div>
                  
                </div>
              </div>
              <div className='col-sm-6 px-0 d-none d-sm-block'>
                <img src={banner} alt='login image' className='login-img' />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
    
};

export default LoginNew;