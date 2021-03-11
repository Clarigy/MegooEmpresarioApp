import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import * as config from '../config'


const firebaseConfig = {
  apiKey: 'AIzaSyC5CT_e6IwJh1NZGKSKUYAvhv9IYdXTohA',
  authDomain: 'meegoapptest-98b27.firebaseapp.com',
  databaseURL: 'https://meegoapptest-98b27.firebaseio.com',
  projectId: 'meegoapptest-98b27',
  storageBucket: 'meegoapptest-98b27.appspot.com',
  messagingSenderId: '190933603277',
  appId: '1:190933603277:web:29472b89314050f086aa84',
  measurementId: 'G-EB95RXM6K4',
};

//firebase.auth.EmailAuthProvider.PROVIDER_ID
//firebase.auth.GoogleAuthProvider.PROVIDER_ID
const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/perfil',
};

firebase.initializeApp(firebaseConfig);

//Objetos de firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();


db.settings({
  timestampsInSnapshots: true,
});

//Funcion para iniciar la autenticación por correo
export const startUi = (elementId) => {
  const ui = new firebaseui.auth.AuthUI(auth);
  ui.start(elementId, uiConfig);

  
};

export default firebase;
