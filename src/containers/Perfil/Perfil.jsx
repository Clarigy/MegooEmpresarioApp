import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Perfil/Perfil.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { AuthContext } from '../../firebase/context';


export class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            bornDate: "",
            document: "",
            cellPhone: "",
            rol: "",
            foto: "",
            status: "",
            time: 1,
            erro: ""
            
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

        setTimeout(() => {
           this.setState({
               time: 0
           })
          }, 1000);


        
       

        const { user } = this.context;
          console.log("USER",user);
          console.log("ID",user.id);
        

        const db = firebaseConfig.firestore();
        let docRef = db.collection("Perfil").doc(user.id);
        //let docRef = db.collection("Perfil").doc(user["id"]);
        console.log("esto",docRef);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("aquello",doc);
                console.log("correoo",doc.data()["foto"])
                if (doc.data()["foto"] == "" || doc.data()["foto"] == undefined) {
                    this.setState({
                        name: doc.data()["nombre"],
                        email: doc.data()["email"],
                        bornDate: doc.data()["fechaNacimiento"],
                        document: doc.data()["documento"],
                        cellPhone: doc.data()["telefono"],
                        rol: doc.data()["rol"],
                        status: doc.data()["status"],
                        foto: "https://firebasestorage.googleapis.com/v0/b/meegoapp.appspot.com/o/foto%2Fuser.png?alt=media&token=3765c611-9c4c-4c01-bce7-6767290fc2d1",
                        
                    });
                    console.log("correoo",this.state.status)
                    console.log("correoo",this.state.foto)
                } else {
                   this.setState({
                        name: doc.data()["nombre"],
                        email: doc.data()["email"],
                        bornDate: doc.data()["fechaNacimiento"],
                        document: doc.data()["documento"],
                        cellPhone: doc.data()["telefono"],
                        rol: doc.data()["rol"],
                        foto: doc.data()["foto"],
                        status: doc.data()["status"],
                    });
                    console.log("correoo",this.state.status)
                    console.log("documento",this.state.document)
                    console.log("correoo",this.state.foto)
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    addCommas = s => s.split('').reverse().join('')
    .replace(/(\d{3})/g, '$1,').replace(/\,$/, '')
    .split('').reverse().join('')

    onSubmit = e => {
       

            var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
            var esValido = expReg.test(this.state.email);

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
     


        if (this.state.name != "" && this.state.email != "" && this.state.bornDate != "" && this.state.document != "" &&
            this.state.cellPhone != "" && age >= 18 && esValido) {



            const { user } = this.context;

            const db = firebaseConfig.firestore();
            var batch = db.batch();

            let newUserRef = db.collection("Perfil/").doc(user.id);
            batch.update(newUserRef, {
                "nombre": this.state.name,
                "email": this.state.email,
                "fechaNacimiento": this.state.bornDate,
                "documento": this.state.document,
                "telefono": this.state.cellPhone,
                "foto": this.state.foto,
                "rol": this.state.rol,
                "status": true
            });
            batch.commit();

        } else {
          
        }
        e.preventDefault();
    }

    delete = e => {
        this.setState({
            name: this.state.name,
            email: this.state.email,
            bornDate: this.state.bornDate,
            document: this.state.document,
            cellPhone: this.state.cellPhone,
            foto: this.state.foto,
            role: this.state.rol,
            status: false,
        });

        const { user } = this.context;
        console.log("deleteee")

        const db = firebaseConfig.firestore();
        var batch = db.batch();

        let newUserRef = db.collection("Perfil").doc(user.id);
        batch.update(newUserRef, {
            
            "nombre": this.state.name,
            "email": this.state.email,
            "fechaNacimiento": this.state.bornDate,
            "docIdentidad": this.state.document,
            "telefono": this.state.cellPhone,
            "foto": this.state.foto,
            "status": false,
        });
        console.log("estadooo",this.status);
        batch.commit();
        document.getElementById('accordionSidebar').style.display = "none";

        e.preventDefault();

        firebaseConfig.auth().signOut().then(() => {
            console.log("Cerro sesion");
        }).catch(error => {
            console.log(error);
        })
        this.setState({
            isLogin: false
        })
    }

    cancelButton = e => {
        firebaseConfig.auth().signOut().then(() => {
            console.log("Cerro sesion");
        }).catch(error => {
            console.log(error);
        })
        this.setState({
            isLogin: false
        })
    }

    recover = e => {

        this.setState({
            name: this.state.name,
            email: this.state.email,
            bornDate: this.state.bornDate,
            document: this.state.document,
            cellPhone: this.state.cellPhone,
            foto: this.state.foto,
            role: this.state.rol,
            status: true,
        });


        const { user } = this.context;

        const db = firebaseConfig.firestore();
        var batch = db.batch();

        let newUserRef = db.collection("Perfil").doc(user.id);
        batch.update(newUserRef, {
            "nombre": this.state.name,
            "email": this.state.email,
            "fechaNacimiento": this.state.bornDate,
            "docIdentidad": this.state.document,
            "telefono": this.state.cellPhone,
            "foto": this.state.foto,
            "status": true,
        });
        batch.commit();
        document.getElementById('accordionSidebar').style.display = "initial";

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
                    console.log(url)
                    console.log("fotoooo", this.state.foto)
                });
        })
    }


    fotoSideBar () {
        this.test = this.state.foto;
    }



    render() {


        var textoGuardar;
        var tituloGuardar;

        console.log("dddd");

        var nameEmpty = "";
        if (this.state.name == "") {
            nameEmpty = "El campo Nombre esta vacio"
        }

        var emailEmpty = "";
        if (this.state.email == "") {
            emailEmpty = "El campo Correo esta vacio"
        } else {

            var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
            var esValido = expReg.test(this.state.email);
            if (!esValido) {
                emailEmpty = "El correo electronico no es válido"
            }
        }

        
        var bornDateEmpty = "";
        console.log("fechaaa",this.state.bornDate)
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

        if(nameEmpty == "" && emailEmpty == "" && bornDateEmpty == "" && documentEmpty == "" && cellPhoneEmpty == ""){

            this.textoGuardar = "La información se guardo exitosamente"
            this.tituloGuardar = "Perfil Guardado"
            
        }else{
            
            this.textoGuardar = "Hay campos vacios o con errores"
            this.tituloGuardar = "Por favor revisar los campos"
        }




        var isLoggedIn = this.state.status;
      
        

        if (isLoggedIn && this.state.time == 0) {

           
            document.getElementById('accordionSidebar').style.display = "initial";
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5 perfilContainer'>
                    

                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>

                            <div className="text-center columnFotoPerfil">


                                <input type="file" id="file" style={{ display: "none"}}
                                    onChange={(e) => this.onChangeFile(e)} />
                                <label htmlFor="file" className="divFotoPerfil" style={{backgroundColor: "#1A1446"}}>

                                    <img className="FotoPerfil" src={this.state.foto} id="fotoPerfil" />

                                </label>
                                <div className='row mb-2' ></div>
                                <h2 className='text-center Categoria-Titulo  mt-1'>{this.state.name}</h2>
                                <h2 className='text-center Categoria-SubTitulo mt-1'>{this.state.rol}</h2>

                            </div>

                        


                            <h2 className='Categoria-Titulo'>Perfil</h2>
                            
                            <form action="">
                                <div className='row formRow'>

                                    <div className="columnPerfilDatos">
                                        <div className='row mb-5' ></div>


                                        <h2 className='Categoria-SubTitulo'>Nombre</h2>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='Username'
                                            onChange={this.onChange}
                                            name='name'
                                            value={this.state.name}
                                        />
                                        <h2 className='Categoria-Alerta-Rojo'>{nameEmpty}</h2>

                                        <div className='row mb-4' ></div>

                                        <h2 className='Categoria-SubTitulo'>Correo</h2>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='Email'
                                            onChange={this.onChange}
                                            name='email'
                                            value={this.state.email}
                                        />
                                        <h2 className='Categoria-Alerta-Rojo'>{emailEmpty}</h2>

                                        <div className='row mb-4' ></div>

                                        <h2 className='Categoria-SubTitulo'>Fecha de nacimiento</h2>
                                        <input
                                            type='date'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='BornDate'
                                            onChange={this.onChange}
                                            name='bornDate'
                                            value={this.state.bornDate}
                                        />
                                        <h2 className='Categoria-Alerta-Rojo'>{bornDateEmpty}</h2>



                                    </div>

                                    <div className="columnPerfilDatos">
                                        <div className='row mb-5' ></div>

                                        <h2 className='Categoria-SubTitulo'>Documento</h2>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='Document'
                                            onChange={this.onChange}
                                            name='document'
                                            value={this.state.document}
                                        />
                                        <h2 className='Categoria-Alerta-Rojo'>{documentEmpty}</h2>

                                        <div className='row mb-4' ></div>

                                        <h2 className='Categoria-SubTitulo'>Telefono</h2>
                                        <input
                                            type='number'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='Cellphone'
                                            onChange={this.onChange}
                                            name='cellPhone'
                                            value={this.state.cellPhone}
                                        />
                                        <h2 className='Categoria-Alerta-Rojo'>{cellPhoneEmpty}</h2>

                                        <div className='row mb-4' ></div>

                                        <h2 className='Categoria-SubTitulo'>Rol</h2>
                                        <select
                                            id='RolSelect'
                                            className='form-control text-muted'
                                            aria-label='Buscar'
                                            name='rol'
                                            onChange={this.onChange}
                                            value={this.state.rol}
                                        >
                                                <option value='Empresario' rol='Empresario' >Empresario</option>
                                                <option value='Independiente' rol='Independiente'>Independiente</option>  
                                        </select>

                                    </div>


                                </div>
                            </form>



                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>
                            <div className='divButtons'>
                                <button
                                    className='btn text-white px-4 py-2 mt-1 Categoria-btnRosado'
                                    data-toggle='modal'
                                    data-target='#ConfirmarModal'

                                >
                                    Eliminar Cuenta Meego
                                </button>
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarPerfil'
                            data-toggle='modal'
                            data-target='#GuardarModal'
                            onClick={this.onSubmit}
                            >
                                Guardar
                                </button>
                            </div>

                            

                            
                            <div
                                className='modal fade'
                                id='GuardarModal'

                            >
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                {this.tituloGuardar}
                                        </h4>
                                        </div>

                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                            {this.textoGuardar}
                                        </h4>
                                        </div>



                                        <div className='row text-center'>
                                            <div className='columnBtnGuardarPerfil'>
                                                <button
                                                    className='btn text-white Categoria-btnMorado'
                                                    data-dismiss="modal"
                                                >
                                                    Ok
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div
                                className='modal fade'
                                id='ConfirmarModal'

                            >
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                Eiminar Cuenta Meego
                                        </h4>
                                        </div>

                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                                ¿Está seguro que desea eliminar su cuenta Meego?
                                        </h4>
                                        </div>



                                        <div className='row text-center'>
                                            <div className='columnBtnEliminarPerfil'>
                                                <button
                                                    className='btn text-white Categoria-btnMorado'
                                                    data-dismiss="modal"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>

                                            <div className='columnBtnEliminarPerfil'>
                                                <button
                                                    className='btn text-white Categoria-btnRosado'
                                                    data-dismiss="modal"
                                                    onClick={this.delete}

                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>







                        </div>
                    </div>
                </>
            )
        }
        else  if (isLoggedIn == false && this.state.time == 0) {
            
            document.getElementById('accordionSidebar').style.display = "none";
            
            return (
                
                <div

                >
                    <div className='modal-dialog modal-dialog-centered' role='document'>
                        <div className='modal-content Categoria-inputShadow Categoria-modal'>
                            <div className='text-center modal-header border-bottom-0'>
                                <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                    Cuenta Eliminada
                        </h4>
                            </div>

                            <div className='text-center modal-header border-bottom-0'>
                                <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                    ¿Desea recuperar su cuenta Meego?
                        </h4>
                            </div>


                            <div className=''>
                                <div className='row text-center'>
                                    <div className='columnBtnEliminarPerfil'>
                                        <button
                                            className='btn text-white Categoria-btnMorado'
                                            data-toggle='modal'
                                            data-target='#exampleModal'
                                            onClick={this.cancelButton}
                                        >
                                            Cancelar
                                </button>
                                    </div>

                                    <div className='columnBtnEliminarPerfil'>
                                        <button
                                            className='btn text-white Categoria-btnMorado'
                                            data-toggle='modal'
                                            data-target='#exampleModal'
                                            onClick={this.recover}

                                        >
                                            Recuperar
                                </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.state.time == 1){
            document.getElementById('accordionSidebar').style.display = "none";
            return (
                
                <div className="SplashScreen text-center">
                    <img src="https://media.giphy.com/media/sSgvbe1m3n93G/source.gif" alt=""/>
                </div>
            )

        };


    }
}
Perfil.contextType = AuthContext;
export default Perfil;
