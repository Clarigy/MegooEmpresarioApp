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
import Tienda from '../Tienda/Tienda';
import Servicios from '../Servicios/Servicios';
import MedioPago from '../MedioPago/MedioPago';
import Productos from '../Productos/Productos';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';



export class NewTienda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameold: "",
            nameStatus: "",
            email: "",
            emailOld: "",
            emailStatus: "",
            cellPhone: "",
            cellPhoneOld: "",
            cellStatus: "",
            description: "",
            descripcionOld: "",
            descripcionStatus: "",
            uid: this.props.location.customObject,
            foto: "",
            status: false,
            lat: 3.43722,
            latOld: null,
            latStatus: "",
            lon: -76.5225,
            lonOld: null,
            lonStatus: "",
            loading:true,
            fotosDrop: [],
            fotosDropPreview: [],
            fotosTienda: [],
            fotosStatus: [],
            arrTienda: [],
        };

    }

    componentDidMount() {
        IconActive.checkPath('Siderbar-Tienda', '/aprobacion', this.props.match.path);
        $('#InfoTienda').addClass('fade active show'); //por default se activa
        // $('#tab-info').addClass('active');
        $('#informacionDIV').addClass('active');
        $('#btnAprobar').show();
        $('#btnNoAprobar').show();

        /**
         * !Informacion
         */
        $('#informacionDIV').click(() => {
            $('#InfoTienda').addClass('fade active show'); //por default se activa
            $('#informacionDIV').addClass('active');
            $('#btnAprobar').show();
            $('#btnNoAprobar').show();

            //Inicio Segundo Tab
            $('#MedioPago').removeClass('fade active show');
            $('#pagoDIV').removeClass('active');
            //Fin Segundo Tab
            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab
            //Inicio cuarta tab
            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab
            //inicio quinta tab
            $('#Plan').removeClass('fade active show'); //div que se muestra
            $('#planDIV').removeClass('active');
            //Fin quinta tab
        });

        /**
         * !MedioPago
         */
        $('#pagoDIV').click(() => {
            $('#MedioPago').addClass('fade active show'); //div que se muestra
            $('#pagoDIV').addClass('active');
            $('#btnAprobar').hide();
            $('#btnNoAprobar').hide();

            //primera tab
            $('#InfoTienda').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab

            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab

            //Inicio cuarta tab
            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab
            //inicio quinta tab
            $('#Plan').removeClass('fade active show'); //div que se muestra
            $('#planDIV').removeClass('active');
            //Fin quinta tab
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
            $('#InfoTienda').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab

            //Inicio Segundo tab
            $('#MedioPago').removeClass('fade active show'); //div que se oculta
            $('#pagoDIV').removeClass('active');
            //Fin Segundo tab

            //Inicio cuarta tab

            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab
            //inicio quinta tab
            $('#Plan').removeClass('fade active show'); //div que se muestra
            $('#planDIV').removeClass('active');
            //Fin quinta tab
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
            $('#InfoTienda').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab
            //Inicio Segundo tab
            $('#MedioPago').removeClass('fade active show'); //div que se oculta
            $('#pagoDIV').removeClass('active');
            //Fin Segundo tab
            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab
            //inicio quinta tab
            $('#Plan').removeClass('fade active show'); //div que se muestra
            $('#planDIV').removeClass('active');
            //Fin quinta tab
        });

        /**
         * !plan y subscripcion
         */
        $('#planDIV').click(() => {
            $('#Plan').addClass('fade active show'); //div que se muestra
            $('#planDIV').addClass('active');
            $('#btnAprobar').hide();
            $('#btnNoAprobar').hide();

            //primera tab
            $('#InfoTienda').removeClass('fade active show');
            $('#informacionDIV').removeClass('active');
            //primera tab
            //Inicio Segundo tab
            $('#MedioPago').removeClass('fade active show'); //div que se oculta
            $('#pagoDIV').removeClass('active');
            //Fin Segundo tab
            //Inicio Tercer tab
            $('#Servicios').removeClass('fade active show'); //div que se muestra
            $('#serviciosDIV').removeClass('active');
            //Fin Tercer tab
            //Inicio cuarta tab
            $('#Productos').removeClass('fade active show'); //div que se muestra
            $('#productosDIV').removeClass('active');
            //Fin cuarta tab
        });

        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            })
           }, 1000);

           console.log(this.state.loading)



     console.log(this.state.uid)
     const db = firebaseConfig.firestore();
     let docRef = db.collection("TiendasTest").doc(this.state.uid);
     //let docRef = db.collection("Perfil").doc(user["id"]);

     docRef.get().then(doc => {
         if (doc.exists) {
             this.setState({
                 name: doc.data()["nombre"],
                 nameold: doc.data()["nombre"],
                 nameStatus: doc.data()["nameStatus"],
                 uid: doc.data()["uid"],
                 foto: doc.data()["foto"],
                 fotosTienda: doc.data()["fotosTienda"],
                 fotosStatus: doc.data()["fotosStatus"]
             });
             const lat = doc.data()["lat"];
             const lng = doc.data()["long"];
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
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
                    pathname: "/Tiendas",
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
                                        <div className={this.state.fotosTienda[0] == this.fotoDefault ? "divFotoTiendaNew" : "divFotoTienda"} >
                                            <img src={this.state.fotosTienda[0]} id="fotoTienda" className='text-center' />
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
                                                href='#InfoTienda'
                                                id='informacionDIV'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className='fa-2x mt-4 mb-3 mb-lg-2 TiendaAprobacion_icon'
                                                />
                                                <h6 className='mx-1 TiendaAprobacion_iconText'>Información de la tienda</h6>
                                            </a>
                                            <a
                                                className='btn-sq-lg TiendaAprobacion_CardBG TiendaAprobacion_Card mb-3'
                                                data-toggle='pill'
                                                href='#MedioPago'
                                                id='pagoDIV'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCreditCard}
                                                    className='fa-2x mt-4 mb-3 mb-lg-2 TiendaAprobacion_icon'
                                                />
                                                <h6 className='mx-1 TiendaAprobacion_iconText'>Medio de pago</h6>
                                            </a>
                                            <a className='d-none d-lg-block'></a>
                                        </div>
                                        <div className='row justify-content-around ml-5 nav nav-pills'>
                                            <a className='d-none d-lg-block'></a>
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
                                            <div id='InfoTienda' className='tab-pane fade active'>
                                             <Tienda uid={this.state.uid} />
                                            </div>
                                            <div id='MedioPago' className='tab-pane fade'>
                                                <MedioPago uid={this.state.uid} />
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

export default NewTienda;