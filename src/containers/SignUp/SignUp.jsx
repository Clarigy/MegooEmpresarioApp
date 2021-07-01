import React, { Component } from 'react';
import { db} from '../../firebase';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import imgLogin from '../../assets/login/Login.png';
import Fondo from '../../assets/login/Fondo.png';
import firebaseConfig from "../../firebase/setup.jsx";
import '../../assets/styles/containers/SignUp/SignUp.scss';
import { AuthContext } from '../../firebase/context';

export class SignUp extends Component {
  constructor(props) {
      super(props);
      this.state = {
          name: "",
          email: "",
          bornDate: "",
          document: "",
          cellPhone: "",
          rol: "Empresario",
          foto: "",
          status: "",
      };
  }

  useEffect =(() => {
      let isMounted = true; // note this flag denote mount status
      someAsyncOperation().then(data => {
        if (isMounted) setState(data);
      })
      return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
    });
    

  componentDidMount = () => {
    document.getElementById('accordionSidebar').style.display = 'none';


  
        
  const { user } = this.context;
  

          this.state = {
            name: "",
            email: user.email,
            bornDate: "",
            document: "",
            cellPhone: "",
            rol: "Empresario",
            foto: "",
            status: true,
            error: ""
        }

    
 

  }

    

  onSubmit = e => {
    //const { user } = this.context;
    var bornDateEmpty = "";
    const { user } = this.context;
    status = true;
   
        var dob = this.state.bornDate;
        var year = Number(dob.substr(0, 4));
        var month = Number(dob.substr(5, 2) - 1);
        var day = Number(dob.substr(8, 2));
        var today = new Date();
        var age = today.getFullYear() - year;
        if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
            age--;
        }
        if(age < 18){
            bornDateEmpty = "Debes ser mayor de edad"
        }

;

    if (this.state.name != "" && user.email != "" && this.state.bornDate != "" && this.state.document != "" &&
        this.state.cellPhone != "" && age >= 18 && this.state.rol != "") {


          db.collection('Perfil/').doc(user.id).set({
            "nombre": this.state.name,
            "email": user.email,
            "fechaNacimiento": this.state.bornDate,
            "documento": this.state.document,
            "telefono": this.state.cellPhone,
            "foto": this.state.foto,
            "rol": this.state.rol,
            "status": status,
            "uid": user.id
        });

        this.props.history.push('/perfil');
       
       

    } else {

    }
    e.preventDefault();

}


onChange = e => {
  this.setState({
      [e.target.name]: e.target.value
  })

}



   
onChangeFile = (e) => {

  const { user } = this.context;
  //if (this.state.foto == "https://firebasestorage.googleapis.com/v0/b/meegoapp.appspot.com/o/foto%2Fuser.png?alt=media&token=3765c611-9c4c-4c01-bce7-6767290fc2d1") {
  const file = e.target.files[0];
  const storageRef = firebaseConfig.storage().ref();
  const fileRef = storageRef.child('/foto/Perfil/' + user["id"] + '/' + user["id"]);
  fileRef.put(file).then(() => {
      console.log("Upload a file")
      storageRef.child('/foto/Perfil/' + user["id"] + '/' + user["id"]).getDownloadURL()
          .then((url) => {

              this.setState({
                  name: this.state.name,
                  email: this.state.email,
                  bornDate: this.state.bornDate,
                  document: this.state.document,
                  cellPhone: this.state.cellPhone,
                  foto: url,
                  role: this.state.rol,
                  status: true,
              });

             
          });
  })
}
  




  
  render() {
    const { user } = this.context;

    const BackgroundImage = {
      backgroundImage: `url(${Fondo})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: '10px'
    };
  


    var textoGuardar;
        var tituloGuardar;

  

        var nameEmpty = "";
        if (this.state.name == "") {
            nameEmpty = "El campo Nombre esta vacio"
        }

        var bornDateEmpty = "";
     
        if (this.state.bornDate == "") {
            bornDateEmpty = "El campo Fecha de nacimiento esta vacio"
        } else {
            var dob = this.state.bornDate;
            var year = Number(dob.substr(0, 4));
            var month = Number(dob.substr(5, 2) - 1);
            var day = Number(dob.substr(8, 2));
            var today = new Date();
            var age = today.getFullYear() - year;
            if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
                age--;
            }
            if(age < 18){
                bornDateEmpty = "Debes ser mayor de edad"
            }
        }

        var documentEmpty = "";
        if (this.state.document == "") {
            documentEmpty = "El campo Documento esta vacio"
        }

        var cellPhoneEmpty = "";
        if (this.state.cellPhone == "") {
            cellPhoneEmpty = "El campo Celular esta vacio"
        } else if( parseInt(this.state.cellPhone, 10) < 1000000000 || parseInt(this.state.cellPhone, 10) > 10000000000) {
            cellPhoneEmpty = "El número celular no es valido"
        }

        if(nameEmpty == ""  && bornDateEmpty == "" && documentEmpty == "" && cellPhoneEmpty == ""){

            this.textoGuardar = "La información se guardo exitosamente"
            this.tituloGuardar = "Perfil Guardado"
            
        }else{
            
            this.textoGuardar = "Hay campos vacios o con errores"
            this.tituloGuardar = "Por favor revisar los campos"
        }

        status = true;




  /*
   db.collection('Perfil/').doc(res.user.uid).set({
        email: res.user.email,
          uid: res.user.uid,
          telefono: '',
          documento: '',
          fechaNacimeinto: '',
          nombre: '',
          rol: '',
          status: false,
          foto: '',
      });*/ 
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row" style={{ height: '100vh' }}>
            <div
              className="col-12 login-section-wrapper BackgroundImage "
             style={BackgroundImage}>
            
            {/*this.state.error && (
                <div className="alert alert-danger">{this.state.error}</div>
            )*/}
              <div className="text-center mb-5 mb-md-0 logo">
                <input type="file" id="file" style={{ display: "none"}}
                  onChange={(e) => this.onChangeFile(e)} />
                  <label htmlFor="file" className="divFotoPerfil" style={{backgroundColor: "#1A1446"}}>
                    <img className="FotoPerfil" src={this.state.foto} id="fotoPerfil" />
                  </label>
                  <label className="text-purple">
                      Foto de perfil
                  </label>
              </div>
              <div className="mt-5 signupForm">
                <form  className="mt-5">
                  <div className="row">
                    <div className="col-12 col-md-4 offset-0 offset-md-4">
                      <div className="">
                        <div className="card card-body Login-Card">
                          <div className="form-group">
                            <label
                              className="text-white"
                            >
                              Nombre:
                            </label>
                            <input
                              type='text'
                              className='form-control text-muted '
                              placeholder=''
                              aria-label='Username'
                              onChange={this.onChange}
                              name='name'
                            />
                            <h2 className='Categoria-Alerta-Rojo'>{nameEmpty}</h2>
                          </div>
                          <div className="form-group">
                            <label
                              className="text-white"
                            >
                              Documento:
                            </label>
                            <input
                                type='text'
                                className='form-control text-muted '
                                placeholder=''
                                aria-label='Document'
                                onChange={this.onChange}
                                name='document'
                            />
                             <h2 className='Categoria-Alerta-Rojo'>{documentEmpty}</h2>
                          </div>
                          <div className="form-group">
                            <label
                              className="text-white"
                            >
                              Fecha de Nacimeinto
                            </label>
                            <input
                              type='date'
                              className='form-control text-muted '
                              placeholder=''
                              aria-label='BornDate'
                              onChange={this.onChange}
                              name='bornDate'
                            />
                            <h2 className='Categoria-Alerta-Rojo'>{bornDateEmpty}</h2>
                          </div>
                          <div className="form-group">
                            <label
                              className="text-white"
                            >
                              Telefono:
                            </label>
                            <input
                              type='number'
                              className='form-control text-muted '
                              placeholder=''
                              aria-label='Cellphone'
                              onChange={this.onChange}
                              name='cellPhone'
                            />
                            <h2 className='Categoria-Alerta-Rojo'>{cellPhoneEmpty}</h2>
                          </div>
                          <div className="form-group">
                            <label
                              className="text-white"
                            >
                              Rol
                            </label>
                            <select
                                id='RolSelect'
                                className='form-control text-muted'
                                aria-label='Buscar'
                                name='rol'
                                onChange={this.onChange}
                            >
                                <option value='Empresario' rol='Empresario'  >Empresario</option>
                                <option value='Independiente' rol='Independiente'>Independiente</option>  
                            </select>
                          </div>
                          <div className="form-group pt-1">
                            <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado'
                             onClick={this.onSubmit}
                       
                                className="btn btn-block Login-btn"
                                type="submit"
                            >
                                Sign up
                            </button>
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
}
}

SignUp.contextType = AuthContext;
export default SignUp;