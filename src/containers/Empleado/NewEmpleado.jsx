import React, { Component } from 'react';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import { db } from '../../firebase';
import '../../assets/styles/Tablas/Tablas.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCreditCard, faConciergeBell, faGift, faFire } from '@fortawesome/free-solid-svg-icons';
import IconActive from '../../hooks/iconActive';
//import InformacionTienda from '../Tienda/InformacionTienda';
//import MedioPago from '../Tienda/MedioPago';
import Empleado from '../Empleado/Empleado';
import Servicios from '../EmpleadoServicios/EmpleadoServicios';
import Productos from '../EmpleadoProductos/EmpleadoProductos';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';



export class NewEmpleado extends Component {
    constructor(props) {
        super(props);
        this.state = {
                name: "",
                email: "",
                cellPhone: "",
                description: "",
                empleadoID:"",
                Tienda: this.props.location.customObjectTienda,
                foto: "",
                uid: this.props.location.customObject,
                foto: "",
                status: false,
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
                oldDescripcion: "",
                loading:true,
        };

    }

    componentDidMount() {
        IconActive.checkPath('Siderbar-Tienda', '/aprobacion', this.props.match.path);
        $('#InfoEmpleado').addClass('fade active show'); //por default se activa
        // $('#tab-info').addClass('active');
        $('#informacionDIV').addClass('active');
        $('#btnAprobar').show();
        $('#btnNoAprobar').show();

        /**
         * !Informacion
         */
        $('#informacionDIV').click(() => {
            $('#InfoEmpleado').addClass('fade active show'); //por default se activa
            $('#informacionDIV').addClass('active');
            $('#btnAprobar').show();
            $('#btnNoAprobar').show();

            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab
            //Inicio cuarta tab
            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab

        });

        

        /**
         * !Servicios
         */
        $('#serviciosDIV').click(() => {
            $('#Servicios').addClass('fade active show'); //div que se muestra
            $('#serviciosDIV').addClass('active');
            $('#btnAprobar').hide();
            $('#btnNoAprobar').hide();

            //primera tab
            $('#InfoEmpleado').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab

           

            //Inicio cuarta tab

            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab

        });

        /**
         * !Productos
         */
        $('#productosDIV').click(() => {
            $('#Productos').addClass('fade active show'); //div que se muestra
            $('#productosDIV').addClass('active');
            $('#btnAprobar').hide();
            $('#btnNoAprobar').hide();

            //primera tab
            $('#InfoEmpleado').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab
            
            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab
   
        });

    

           console.log(this.state.loading)



           console.log(this.state.uid)
           const db = firebaseConfig.firestore();
           db.collection("TiendasTest2").doc(this.state.uid).get().then(doc => {
               if (doc.exists) {
                   this.setState({
                       name: doc.data()["nombre"],
                       email: doc.data()["email"],
                       cellPhone: doc.data()["celular"],
                       description: doc.data()["biografia"],
                       empleadoID: doc.data()["uid"],
                       foto: doc.data()["fotoProveedor"],
                       status: doc.data()["estadoTienda"]
                   });
                    console.log(this.state.empleadoID)

               } else {
                   // doc.data() will be undefined in this case
                   console.log("No such document!");
               }
               


           });

           
           
           setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            })
           }, 1000);
    }

    render() {
        const { loading } = this.state;
        if (this.state.uid == undefined) {
        return (
            <>
            <GifLoader
                loading={loading}
                imageSrc={loadingImage}
                overlayBackground="rgba(219,219,219, .8)"
            />
                <Redirect to={{
                    pathname: "/equipo",
                    customObject: this.state.uid,
                }} />
            </>
        )
    } else {
        return (
            <>
                <GifLoader
                        loading={loading}
                        imageSrc={loadingImage}
                        overlayBackground="rgba(219,219,219, .8)"
                    />
                    <div className='container-fluid'>
                        <div className='mx-0 mx-md-2 mt-5 tiendaInfoContainer'>
                            <div className='row'>
                                <div className='columnFotoTienda col-4 col-md-3 px ml-0 ml-md-5 '>
                                    <div className='text-center mt-5 divInfo'>
                                        <div className={this.state.foto == this.fotoDefault ? "divFotoTiendaNew" : "divFotoTienda"} >
                                            <img src={this.state.foto} id="fotoTienda" className='text-center' style={this.state.status != "Activo" ? {filter: "grayscale(100%)"} : {filter: "none"}} />
                                        </div>
                                        <h4 className=' Categoria-Titulo mt-1 mt-3'>
                                            {this.state.name}
                                        </h4>
                                    </div>
                                    <div className='text-center mt-5'>
                                        <div className='row justify-content-around ml-5 nav nav-pills'>
                                            <a className='d-none d-lg-block'></a>
                                            <a
                                                className='btn-sq-lg TiendaAprobacion_CardBG TiendaAprobacion_Card mb-3'
                                                data-toggle='pill'
                                                href='#InfoEmpleado'
                                                id='informacionDIV'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className='fa-2x mt-4 mb-3 mb-lg-2 TiendaAprobacion_icon'
                                                />
                                                <h6 className='mx-1 TiendaAprobacion_iconText'>Información</h6>
                                            </a>
                                            <a
                                                className='btn-sq-lg TiendaAprobacion_CardBG TiendaAprobacion_Card mb-3'
                                                data-toggle='pill'
                                                href='#Servicios'
                                                id='serviciosDIV'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faConciergeBell}
                                                    className='fa-2x mt-4 mb-3 TiendaAprobacion_icon'
                                                />
                                                <h6 className='mx-1 TiendaAprobacion_iconText'>Servicios</h6>
                                            </a>
                                            
                                            <a className='d-none d-lg-block'></a>
                                        </div>
                                        <div className='row justify-content-around ml-5 nav nav-pills'>
                                            <a className='d-none d-lg-block'></a>
                                            <a
                                                className='btn-sq-lg TiendaAprobacion_CardBG mb-3 TiendaAprobacion_Card'
                                                data-toggle='pill'
                                                href='#Productos'
                                                id='productosDIV'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faGift}
                                                    className='fa-2x mt-4 mb-3 TiendaAprobacion_icon'
                                                />
                                                <h6 className='mx-1 TiendaAprobacion_iconText'>Productos</h6>
                                            </a>
                                            <a className='d-none d-lg-block'></a>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                <div className='col sectionDiv'>
                                    <div className='text-center'>
                                        <div className='tab-content'>
                                            <div id='InfoEmpleado' className='tab-pane fade active'>
                                             <Empleado uid={this.state.uid} tienda={this.state.Tienda}/>
                                            </div>
                                        
                                            <div id='Servicios' className='tab-pane fade'>
                                                
                                                <Servicios uid={this.state.uid} />
                                            </div>
                                            <div id='Productos' className='tab-pane fade'>
                                                <Productos uid={this.state.uid} />
                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default NewEmpleado;