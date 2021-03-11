import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../firebase/context';

class ProtectRoute extends React.Component {
  
  render() {
    const { type, history, ...rest } = this.props;
    const { isLoggedIn } = this.context;

    if (type === 'private' && !isLoggedIn) {
      
      return <Redirect to='/' />;
      
    } if (type === 'public' && isLoggedIn) {

      
      return <Redirect to='/perfil' />;
    }

    return <Route {...rest} />;
  };
}

ProtectRoute.contextType = AuthContext;

export default ProtectRoute;
