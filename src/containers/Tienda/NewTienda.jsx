import React, { Component } from 'react';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import { db } from '../../firebase';
import '../../assets/styles/Tablas/Tablas.scss';
import firebaseConfig from '../../firebase/setup.jsx';
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
            name: '',
            nameold: '',
            nameStatus: '',
            email: '',
            emailOld: '',
            emailStatus: '',
            cellPhone: '',
            cellPhoneOld: '',
            cellStatus: '',
            description: '',
            descripcionOld: '',
            descripcionStatus: '',
            uid: this.props.location.customObject,
            foto: '',
            status: false,
            lat: 3.43722,
            latOld: null,
            latStatus: '',
            lon: -76.5225,
            lonOld: null,
            lonStatus: '',
            loading: true,
            fotosDrop: [],
            fotosDropPreview: [],
            fotosTienda: [],
            fotosStatus: [],
            arrTienda: []
        };
    }

    componentDidMount() {
        IconActive.checkPath('Siderbar-Tienda', '/aprobacion', this.props.match.path);
        $('#InfoTienda').addClass('fade active show'); //por default se activa
        // $('#tab-info').addClass('active');
        $('#informacionDIV').addClass('active');

        /**
         * !Informacion
         */
        $('#informacionDIV').click(() => {
            $('#InfoTienda').addClass('fade active show'); //por default se activa
            $('#informacionDIV').addClass('active');

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
        });

        /**
         * !MedioPago
         */
        $('#pagoDIV').click(() => {
            $('#MedioPago').addClass('fade active show'); //div que se muestra
            $('#pagoDIV').addClass('active');

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
        });

        /**
         * !Servicios
         */
        $('#serviciosDIV').click(() => {
            $('#Servicios').addClass('fade active show'); //div que se muestra
            $('#serviciosDIV').addClass('active');

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
        });

        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            });
        }, 1000);

        
        const db = firebaseConfig.firestore();
        let docRef = db.collection('Tiendas').doc(this.props.location.customObject);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({
                        name: doc.data()['nombre'],
                        nameold: doc.data()['nombre'],
                        nameStatus: doc.data()['nameStatus'],
                        uid: doc.data()['uid'],
                        foto: doc.data()['fotoProveedor']
                    });
                    const lat = doc.data()['latitud'];
                    const lng = doc.data()['longitud'];

                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                }
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
            });
    }

    render() {
        const { loading } = this.state;
        if (this.state.uid == undefined) {
            return (
                <>
                    <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                    <Redirect
                        to={{
                            pathname: '/Tiendas',
                            customObject: this.state.uid
                        }}
                    />
                </>
            );
        } else {
            return (
                <>
                    <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                    <div className='container-fluid'>
                        <div className='mx-0 mx-md-2 mt-5 perfilContainer'>
                            <div className='text-center  columnTiendaBtn'>
                                <div className='row'>
                                    <div className='colFoto'>
                                        <div
                                            className={
                                                this.state.foto == this.state.fotoDefault
                                                    ? 'divFotoTiendaNew'
                                                    : 'divFotoTienda'
                                            }
                                        >
                                            <img src={this.state.foto} id='fotoTienda' className='text-center' />
                                        </div>
                                        <div className='row mb-2'></div>
                                        <h2 className=' text-center Categoria-Titulo mt-1'>{this.state.name}</h2>
                                        <div className='row mb-5'></div>
                                    </div>
                                </div>
                                <div className='row rowButtonsTienda'>
                                    <a className='d-none d-lg-block'></a>
                                    <a
                                        className='btnNoPress ml-4 mb-3 active'
                                        data-toggle='pill'
                                        href='#InfoTienda'
                                        id='informacionDIV'
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className='fa-2x mt-4 mb-3 mb-lg-2 TiendaAprobacion_icon'
                                        />
                                        <h6 className='mx-1 TiendaAprobacion_iconText'>Información</h6>
                                    </a>
                                    <a
                                        className='btnNoPress ml-4 mb-3'
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

                                    <a className='d-none d-lg-block'></a>
                                    <a
                                        className='btnNoPress ml-4 mb-3'
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
                                        className='btnNoPress ml-4 mb-3'
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
                            <div className='columnInfoTienda sectionDiv'>
                                <div className='text-center'>
                                    <div className='tab-content'>
                                        <div id='InfoTienda' className='tab-pane fade active'>
                                            <Tienda uid={this.state.uid} name={this.state.name} />
                                        </div>
                                        <div id='MedioPago' className='tab-pane fade'>
                                            <MedioPago uid={this.state.uid} name={this.state.name} />
                                        </div>
                                        <div id='Servicios' className='tab-pane fade'>
                                            <Servicios uid={this.state.uid} name={this.state.name} />
                                        </div>
                                        <div id='Productos' className='tab-pane fade'>
                                            <Productos uid={this.state.uid} name={this.state.name} />
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
