import React from 'react';
import { watchUserChanges } from './index';
import { auth, db, provider} from '../firebase';

//Crear el context
export const AuthContext = React.createContext({});

//Crear el consumer
export const AuthContextConsumer = AuthContext.Consumer;

// Clase para exportar el Provider
export class AuthContextProvider extends React.Component {
    state = {
      isLoggedIn: false,
      isSignup: false,
      authReady: false,
      user: null,
      userid: ""
    }

    componentDidMount() {

      this.userWatcherUnsub = watchUserChanges((user) => {

        if (user) {
          sessionStorage.setItem('email', user.email);
          let docRef = db.collection("Perfil").doc(user.id);

          docRef.get().then((doc) => {
            if (doc.exists) {
              console.log("JDJKSFHSDJKFHDJKHJKDHGJKSDFHGJKHDFG")
              this.setState({
                authReady: true,
                isLoggedIn: true,
                isSignup: false,
                user,
                userid: user["id"],
              });
            } else {
              this.setState({
                authReady: true,
                isLoggedIn: true,
                isSignup: true,
                user,
                userid: user["id"],
              });
          }});
        
        } else {

          this.setState({
            authReady: true,
            isLoggedIn: false,
            user: null,
            userid: "",
            isSignup: false,
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
