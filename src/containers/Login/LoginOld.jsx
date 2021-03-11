import React, { Component} from 'react';
import { startUi } from '../../firebase';
import logo from '../../assets/login/logo.svg';
import banner from '../../assets/login/login.jpg';
import '../../assets/styles/login/login.scss';

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

class Login extends Component {

  componentDidMount() {
    document.getElementById('accordionSidebar').style.display = 'none';
    startUi('#firebaselogin');
  }

  render() {

    
    return (
      <div>
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
  }
}

export default Login;
