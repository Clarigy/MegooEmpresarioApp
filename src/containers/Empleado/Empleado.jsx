import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import { Link } from "react-router-dom";



export class Empleado extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",
            email: "",
            cellPhone: "",
            description: "",
            uid:  this.props.uid,
            Tienda: this.props.tienda,
            foto: "",
            status: "",
            lat: 3.43722,
            lon: -76.5225,
            markers: [
                {
                    name: "Current position",
                    position: {
                        lat: 3.43722,
                        lng: -76.5225
                    }
                }
            ],
            fotosTienda: [],
            fotosStatusResume: false,
            fotosStatus: [],
            descripcionStatus: false,
            oldDescripcion: ""
        };

    }



    componentDidMount = () => {

        console.log(this.state.uid)
        const db = firebaseConfig.firestore();
        let docRef = db.collection("TiendasTest2").doc(this.state.uid)
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then(doc => {
            if (doc.exists) {
                this.setState({
                    name: doc.data()["nombre"],
                    email: doc.data()["email"],
                    cellPhone: doc.data()["celular"],
                    description: doc.data()["biografia"],
                    uid: doc.data()["uid"],
                    foto: doc.data()["fotoProveedor"],
                    fotosTienda: doc.data()["fotosTienda"],
                    status: doc.data()["estadoTienda"]
                });
                

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    onSubmit = async (e) => {

        if (this.state.description != "") {


            const db = firebaseConfig.firestore();
            var batch = db.batch();

            if (this.state.descripcionStatus == false || this.state.fotosStatusResume == false) {
                let newTienda = db.collection("EmpleadosTest").doc(this.state.uid);
                await batch.update(newTienda, {
                    "descripcion": this.state.description,
                });
                batch.commit();
            } 
        }
        e.preventDefault();
    }

    delete = async (e) => {

        const db = firebaseConfig.firestore();
        var batch = db.batch();

            let newTienda = db.collection("EmpleadosTest").doc(this.state.uid)
            await batch.update(newTienda, {
                "estado": "No Activo",
            });
           

            
            let deleteTienda =  db.collection("TiendasTest2").doc(this.state.uid)
           await batch.update(deleteTienda, {
                "estadoTienda": "No Activo",
                "Tienda": ""
               });
               batch.commit()
               
               this.setState({
                uid: undefined
            })

        
            

    }

    Activar = async (e) => {

        const db = firebaseConfig.firestore();
        var batch = db.batch();
        

       
            let newTienda = db.collection("EmpleadosTest").doc(this.state.uid);
            await batch.update(newTienda, {
                "estado": "Activo",
            });

            let deleteTienda =  db.collection("TiendasTest2").doc(this.state.uid)
            await batch.update(deleteTienda, {
                 "estadoTienda": "Activo",
                 "Tienda": this.state.Tienda
                });
              
            batch.commit();

            this.setState({
                uid: undefined
            })
        
            

    }

    exit = e => {

        this.setState({
            uid: undefined
        })

    }





    render() {



        var descriptionEmpty = "";
        if (this.state.description == "") {
            descriptionEmpty = "El campo Descripción de la tienda esta vacio"
        }

        if (descriptionEmpty == "") {

            this.textoGuardar = "La información se guardo exitosamente"
            this.tituloGuardar = "Perfil Guardado"


        } else {

            this.textoGuardar = "Hay campos vacios o con errores"
            this.tituloGuardar = "Por favor revisar los campos"
        }

        this.fotoDefault = "https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6"



        if (this.state.uid == undefined) {
            return (
                <>
                    <Redirect to={{
                        pathname: "/Equipo",
                        customObject: this.state.uid,
                    }} />
                </>
            )
        } else {
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5 containerDivInfoTienda'>

                            <div className='row mb-5' ></div>
                            
                            <h2 className="Categoria-Titulo columnInfoTiendas">Información del empleado</h2>

                            <div className='row rowInfoTienda'>


                                <div className="columnPerfilDatos">
                                    <div className='row mb-5' ></div>


                                    <h2 className='Categoria-SubTitulo'>Nombre</h2>
                                    <input
                                        type='text'
                                        className='form-control text-muted '
                                        placeholder=''
                                        aria-label='Username'
                                        name='name'
                                        value={this.state.name}
                                        disabled
                                    />

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Celular</h2>
                                    <input
                                        type='number'
                                        className='form-control text-muted '
                                        placeholder=''
                                        aria-label='Cellphone'
                                        name='cellPhone'
                                        value={this.state.cellPhone}
                                        disabled
                                    />


                                </div>

                                <div className="columnPerfilDatos">

                                    <div className='row mb-5' ></div>
                                    <h2 className='Categoria-SubTitulo'>Correo</h2>
                                    <input
                                        type='text'
                                        className='form-control text-muted text-deactivated'
                                        placeholder=''
                                        aria-label='Email'
                                        name='email'
                                        value={this.state.email}
                                        disabled
                                    />

                                </div>




                            </div>

                            <div className='row'>


                                <div className="columnDescripcion">

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Descripción del empleado</h2>
                                    <textarea
                                        type='text'
                                        rows="5"
                                        className='form-control text-muted '
                                        placeholder=''
                                        aria-label='Description'
                                        name='description'
                                        value={this.state.description}
                                        disabled
                                    />


                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Fotos mis trabajos</h2>
                                    <div className='row mb-5'>
                                    {this.state.fotosTienda && this.state.fotosTienda.length > 0 && this.state.fotosTienda.map((item, i) => (
                                            <div className=" columnFotos mr-4">

                                                <img src={item} id="fotosTienda"  className='text-center' style={this.state.status != "Activo" ? {filter: "grayscale(100%)"} : {filter: "none"}} />
                                                
                                            </div>
                                    ))}
                                    </div>
                                   


                        
                                    
                                    <div className="footerButtons">
                                        {this.state.status == "Activo" ? (<button
                                            className='btn text-white px-4 py-2 mt-1 Categoria-btnRosado'
                                            data-toggle='modal'
                                            data-target='#ConfirmarModal'

                                        >
                                            Desactivar Empleado
                                        </button>):(
                                            <button
                                            className='btn text-white px-4 py-2 mt-1 Categoria-btnAzul'
                                            data-toggle='modal'
                                            data-target='#ReConfirmarModal'

                                        >
                                            Reactivar Empleado
                                        </button>
                                        )}
                                        
                                        <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarPerfil' onClick={this.onSubmit}
                                            data-toggle='modal'
                                            data-target='#GuardarModal'
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>



                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>


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
                                                    onClick={this.exit}
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
                                id='ReConfirmarModal'

                            >
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                Enviar mensaje de Reactivación de la tienda
                                        </h4>
                                        </div>

                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                                ¿Está seguro que desea enviar mensaje al
                                                empleado para confirmar la reactivación?
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
                                                    onClick={this.Activar}

                                                >
                                                    Enviar
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
                                                Enviar mensaje de desactivación de la tienda
                                        </h4>
                                        </div>

                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                                ¿Está seguro que desea enviar mensaje al
                                                empleado para confirmar desactivación?
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
                                                    Enviar
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
        ;
    }
}

export default Empleado;