import React, { useState, useCallback, useEffect } from 'react';
import { auth, db, provider} from '../../firebase';
import firebase from '../../firebase/setup';
import { withRouter } from 'react-router-dom';
import imgLogin from '../../assets/login/Login.png';
import Fondo from '../../assets/login/Fondo.png';
import '../../assets/styles/login/loginNew.scss';
import meegoLogin from '../../assets/login/meegologin.png';

const LoginTest = (props) => {

  


  document.getElementById('accordionSidebar').style.display = 'none';

  //Definir el estado
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [hasAcount, setHasAcount] = useState(true);
  const [accountState, setAccountState] = useState(true);
  //const [esRegistro, setEsRegistro] = useState(true);



  //Procesar Datos
  const procesarDatos = (e) => {
    e.preventDefault();
    //Validar Datos
    if (!email.trim()) {
      setError('Ingrese un email');
      return;
    }
    if (!pass.trim()) {
      setError('Ingrese un password');
      return;
    }
    if (pass.length < 6) {
      setError('Ingrese un password mayor a 6 cáracteres');
      return;
    }

    setError(null);
    console.log('Validaciones correctas');


    //llamar el registro
    if(accountState == false){
        registrar();
    }else if (accountState == true){ 
        Login();
    }
  };

  //Función que inicia sesión
  const Login = useCallback(async () => {
    try {

      const res = await auth.signInWithEmailAndPassword(email, pass);
      console.log(res.user.email);
      console.log(res.user);
      //TODO: comparar el correo

      await db
        .collection('users/')
        .get()

        db.collection('users/').doc(res.user.uid).set({
          email: res.user.email,
          uid: res.user.uid
        });
        

      //Limpiar los txt
      setEmail('');
      setPass('');
      setError(null);
      //redireccionar a home
      props.history.push('/perfil');
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/invalid-email') {
        setError('Email no válido');
        return;
      }

      if (error.code === 'auth/user-not-found') {
        setError('Email no existe');
        return;
      }

      if (error.code === 'auth/wrong-password') {
        setError('Password incorrecto');
        return;
      }
    }
  }, [email, pass]);


  //Función que inicia sesión
  const LoginGoogle = useCallback(async () => {
    var ruta = '';
    var user = '';
    var email = '';
    var id = '';

    try{
      

        var provider = new firebase.auth.GoogleAuthProvider();
        console.log("aaaaaaaaaaaaaaaaaaaaaaa", )

        const res = await auth
        .signInWithPopup(provider)
        .then((result) => {
          user = result.user;
          var credential = result.credential
          var token = credential.accessToken;
        }); 
      } catch (error){
            if (error.code === 'auth/account-exists-with-different-credential') {
                setError('Esta cuenta ya esta registrada con otro provedor, ingresa de otra manera');
                return;
            }
        }
        email= user.email;
        uid = user.id;
        db.collection('users').doc(user.uid).set({
          email: user.email,
          uid: user.uid
        });
        console.log("bbbbbbbbbbbbbbbbbbbbb", user)
        let docRef = db.collection("Perfil").doc(user.id);

        docRef.get().then((doc) => {
          if (doc.exists) {
            ruta = '/perfil';
            console.log(ruta)
          } else {
                 
            ruta = '/signup'; 
            console.log(ruta)
            }
        })
      //Limpiar los txt
      setEmail('');
      setPass('');
      setError(null);
      //redireccionar a home
      props.history.push(ruta);
    
  }, [email, props.history]);

  //Función que inicia sesión
  const LoginFacebook = useCallback(async () => {
    var user = '';
    var ruta = '';
  
    try{

        var provider = new firebase.auth.FacebookAuthProvider();
        const res = await auth
    .signInWithPopup(provider)
    .then((result) => {
      // The signed-in user info.
      user = result.user;
        
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;
    });
    } catch (error){
    
        if (error.code === 'auth/account-exists-with-different-credential') {
            setError('Esta cuenta ya esta registrada con otro provedor, ingresa de otra manera');
            return;
        }
    }
    db.collection('users').doc(user.uid).set({
      email: user.email,
      uid: user.uid
    });
    let docRef = db.collection("Perfil").doc(user.id);

    docRef.get().then((doc) => {
      if (doc.exists) {
        ruta = '/perfil';
        console.log(ruta)
      } else {
             
        ruta = '/signup'; 
        console.log(ruta)
        }
    })

  //Limpiar los txt
  setEmail('');
  setPass('');
  setError(null);
  //redireccionar a home
  props.history.push(ruta);

}, [props.history]);

  //Función de registro en firebase
  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(
        email,
        pass
      );
      console.log(res.user);
      //Guardar el registro en la BD
      db.collection('users/').doc(res.user.uid).set({
        email: res.user.email,
        uid: res.user.uid
      });
    } catch (error) {
      console.log(error);

      if (error.code === 'auth/invalid-email') {
        setError('Email no válido');
        return;
      }
      if (error.code === 'auth/email-already-in-use') {
        setError('Email ya registrado');
        return;
      }
    }
     //Limpiar los txt
     setEmail('');
     setPass('');
     setError(null);

     //redireccionar a home
     props.history.push('/signup');
  }, [email, pass, props.history]);

  //Función de registro en firebase
  const passwordResset = useCallback(async () => {
    if (!email.trim()) {
        setError('Ingrese un email');
        return;
      }
    try {
        const res = await auth.sendPasswordResetEmail(
            email
          ) .then((result) => {
            setError('Email enviado');
          });

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            setError('Email no existe');
            return;
        }
      console.log(error);

    }
  }, [email, pass, props.history]);

  const BackgroundImage = {
    backgroundImage: `url(${Fondo})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: '100px'
  };

  
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row" style={{ height: '100vh' }}>
            <div
              className="col-12 login-section-wrapper BackgroundImage "
              style={BackgroundImage}
            >
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <div className="text-center mb-5 mb-md-0">
                <img
                  src={imgLogin}
                  alt="El universo que piensa en tí y para tí."
                  className="mb-5 mt-2"
                  width="200"
                  height="250"
                />
              </div>
              <div className="mt-5">
                <form onSubmit={procesarDatos} className="mt-5">
                  <div className="row">
                    <div className="col-12 col-md-4 offset-0 offset-md-4">
                      <div className="">
                        <div className="card card-body Login-Card">
                          <div className="form-group">
                            <label
                              htmlFor="email"
                              className="text-white"
                            >
                              Usuario
                            </label>
                            <input
                              name="email"
                              className="form-control mb-2"
                              type="email"
                              placeholder="Ingrese su correo"
                              value={email}
                              onChange={(e) =>
                                setEmail(e.target.value)
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="pass"
                              className="text-white"
                            >
                              Contraseña
                            </label>
                            <input
                              name="pass"
                              className="form-control mb-2"
                              type="password"
                              placeholder="Ingrese su password"
                              value={pass}
                              onChange={(e) =>
                                setPass(e.target.value)
                              }
                            />
                          </div>
                          <div className="form-group pt-1">
                                {hasAcount ? (
                                    <>
                                    <button 
                                    className="btn btn-block Login-btn"
                                    type="submit"
                                    onClick={() =>
                                        setAccountState(true)}>
                                        Sign in
                                    </button>

                                    <div className ="linksForm">
                                        <span className= "forgot-password-link"
                                        onClick={() => passwordResset()}>
                                            Recordar contraseña
                                        </span>
                                        
                                        <p className ="changeState">No tienes una cuenta? 
                                            <span className ="signUp"
                                            onClick={() => setHasAcount(false)}>
                                                Sign up
                                            </span>
                                        </p>         
                                    </div>                                 
                                   </>  
                                ) : (
                                    <>
                                    <button 
                                    className="btn btn-block Login-btn"
                                    type="submit"
                                    onClick={() =>
                                        setAccountState(false)}>
                                        Sign up
                                    </button>
                                    <div>
                                        <p  className ="changeState">Tienes una cuenta? 
                                            <span className ="signUp"
                                            onClick={() => setHasAcount(true)}>
                                                Sign in
                                            </span>
                                        </p>  
                                    </div>                                      
                                   </> 
                                )}
                          </div>
                          <div >
                          {hasAcount ? ( <p className="text-white"> Inicia sesion con: </p> ) : ( <p className="text-white"> Registrate con: </p>)}
                            <div className="otherSignin">
                                <span
                                onClick={() => LoginGoogle()}>
                                    <i class="fab fa-google"></i>
                                </span>
                                <br/>
                                <span
                                onClick={() => LoginFacebook()}>
                                    <i class="fab fa-facebook-f"></i>
                                </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withRouter(LoginTest);
