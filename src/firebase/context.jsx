import React from 'react';
import { watchUserChanges } from './index';

//Crear el context
export const AuthContext = React.createContext({});

//Crear el consumer
export const AuthContextConsumer = AuthContext.Consumer;

// Clase para exportar el Provider
export class AuthContextProvider extends React.Component {
    state = {
      isLoggedIn: false,
      authReady: false,
      user: null,
      userid: ""
    }

    componentDidMount() {

      this.userWatcherUnsub = watchUserChanges((user) => {

        if (user) {
          sessionStorage.setItem('email', user.email);
          this.setState({
            authReady: true,
            isLoggedIn: true,
            user,
            userid: user["id"]
          });
        } else {

          this.setState({
            authReady: true,
            isLoggedIn: false,
            user: null,
            userid: ""
          });
        }
      });

     

    }

    componentWillUnmount() {
      if (this.userWatcherUnsub) {
        this.userWatcherUnsub();
      }
    }

    render() {
      const {
        children,
      } = this.props;

      return (
        
        <AuthContext.Provider
          value={{
            ...this.state,
          }}
        >
          {children}
        </AuthContext.Provider>
      );
    }
}
