import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../firebase/context';

class ProtectRoute extends React.Component {
  
  render() {
    const { type, history, ...rest } = this.props;
    const { isLoggedIn } = this.context;
    const { isSignup } = this.context;

    if (type === 'private' && !isLoggedIn) {
      
      return <Redirect to='/' />;
      
    } if (type === 'public' && isLoggedIn && !isSignup) {

      
      return <Redirect to='/perfil' />;
    }
    if (type === 'public' && isLoggedIn && isSignup) {

      
      return <Redirect to='/signup' />;
    }

    return <Route {...rest} />;
  };
}

ProtectRoute.contextType = AuthContext;

export default ProtectRoute;
