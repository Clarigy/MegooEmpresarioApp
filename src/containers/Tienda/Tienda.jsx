import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda.svg';
import MedioPago from '../../assets/images/components/Iconos/icono_medio_de_pago.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import DropZone from '../../components/Dropzone/DropZone.js';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';

const mapStyles = {
    width: '100%',
    height: '100%'
};

export class Tienda extends Component {
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
            uid: this.props.uid,
            idDueño: '',
            foto: '',
            status: 'no',
            lat: 3.43722,
            latOld: null,
            latStatus: '',
            lon: -76.5225,
            lonOld: null,
            lonStatus: '',
            loading: true,
            markers: [
                {
                    name: 'Current position',
                    position: {
                        lat: 3.43722,
                        lng: -76.5225
                    }
                }
            ],

            fotosDrop: [],
            fotosDropPreview: [],
            fotosTienda: [],
            fotosStatus: [],
            arrTienda: [],
            uidProveedor: '',
            fotosTiendaDelete: [],
            fotosTiendaOld: []
        };
    }

    onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        this.setState((prevState) => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            return { markers };
        });
        this.setState({
            lat: this.state.markers[0].position.lat,
            lon: this.state.markers[0].position.lng
        });

        if (this.state.lat != this.state.latOld) {
            this.setState({
                latStatus: 'Cambio',
                status: false
            });
        }

        if (this.state.lon != this.state.lonOld) {
            this.setState({
                lonStatus: 'Cambio',
                status: false
            });
        }
    };

    componentDidMount = () => {
        let fotosTienda = [];

        const db = firebaseConfig.firestore();
        let docRef = db.collection('Tiendas').doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({
                        uidProveedor: doc.data()['uidProveedor'],
                        name: doc.data()['nombre'],
                        email: doc.data()['email'],
                        cellPhone: doc.data()['celular'],
                        description: doc.data()['biografia'],
                        uid: doc.data()['uid'],
                        foto: doc.data()['fotoProveedor'],
                        status: doc.data()['aprobado'],
                        lat: doc.data()['latitud'],
                        lon: doc.data()['longitud'],
                        lonOld: doc.data()['longitud'],
                        latOld: doc.data()['latitud']
                    });
                    const lat = doc.data()['latitud'];
                    const lng = doc.data()['longitud'];

                    this.setState((prevState) => {
                        const markers = [...this.state.markers];
                        markers[0] = { ...markers[0], position: { lat, lng } };
                        return { markers };
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                }

                db.collection(`/Tiendas/${this.state.uid}/misTrabajos`)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            fotosTienda.push(doc.data());

                            this.setState({
                                fotosTienda: fotosTienda,
                                fotosTiendaOld: fotosTienda
                            });
                        });
                    })
                    .catch(function (error) {
                        console.log('Error getting documents: ', error);
                    });
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
            });
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });

        if (this.state.name != this.state.nameold) {
            this.setState({
                nameStatus: 'Cambio',
                status: false
            });
        }

        if (this.state.email != this.state.emailOld) {
            this.setState({
                emailStatus: 'Cambio',
                status: false
            });
        }

        if (this.state.cellPhone != this.state.cellPhoneOld) {
            this.setState({
                cellStatus: 'Cambio',
                status: false
            });
        }

        if (this.state.description != this.state.descripcionOld) {
            this.setState({
                descripcionStatus: 'Cambio',
                status: false
            });
        }
    };

    onSubmit = async (e) => {
        let expReg =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        let esValido = expReg.test(this.state.email);

        let fotosTienda = [];

        const db = firebaseConfig.firestore();
        let docRef = db.collection('Tiendas').doc(this.state.uid).set({
            uidProveedor: this.state.uidProveedor,
            nombre: this.state.name,
            email: this.state.email,
            celular: this.state.cellPhone,
            biografia: this.state.description,
            uid: this.state.uid,
            fotoProveedor: this.state.foto,
            aprobado: this.state.status,
            latitud: this.state.lat,
            longitud: this.state.lon
        });

        if (this.state.fotosDrop[0]) {
            for (var i = 0; i < this.state.fotosDrop.length; i++) {
                const nombreImagen = this.state.fotosDrop[i].name;
                const file = this.state.fotosDrop[i];
                const storageRef = firebaseConfig.storage().ref();
                const fileRef = storageRef.child('/foto/tienda/' + this.state.uid + '/' + nombreImagen);
                fileRef.put(file).then(() => {
                    console.log('Upload a file');
                    storageRef
                        .child('/foto/tienda/' + this.state.uid + '/' + nombreImagen)
                        .getDownloadURL()
                        .then(async (url) => {
                            db.collection(`/Tiendas/${this.state.uid}/misTrabajos`).add({
                                foto: url,
                                uid: this.state.uid,
                                estado: 'Pendiente'
                            });
                        })
                        .catch((err) => console.error(err));
                });
            }
        }

        if (this.state.fotosTiendaDelete[0]) {
            for (var i = 0; i < this.state.fotosTiendaDelete.length; i++) {
                const file = this.state.fotosTiendaDelete[i].foto;

                db.collection(`/Tiendas/${this.state.uid}/misTrabajos`)
                    .where('foto', '==', file)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection(`/Tiendas/${this.state.uid}/misTrabajos`).doc(doc.id).delete();
                        });
                    });
            }
        }

        e.preventDefault();
    };

    delete = (e) => {
        const db = firebaseConfig.firestore();

        db.collection('Tiendas').doc(this.state.uid).delete();

        this.setState({
            uid: undefined
        });
    };

    deleteFoto(i) {
        return () => {
            console.log(this.state.fotosTienda);
            const deleteFoto = this.state.fotosTienda[i];
            this.state.fotosTienda.splice(i, 1);
            console.log('DELETED', this.state.fotosTienda);
            this.setState({
                fotosTienda: this.state.fotosTienda,
                fotosTiendaDelete: [...this.state.fotosTiendaDelete, deleteFoto]
            });
        };
    }

    deleteDropFoto(i) {
        return () => {
            this.state.fotosDrop.splice(i, 1);
            this.setState({
                fotosDrop: this.state.fotosDrop
            });
        };
    }

    exit = (e) => {
        this.setState({
            uid: undefined
        });
    };

    drop = (e) => {
        this.setState({
            fotosDrop: e
        });
    };

    render() {
        const { loading } = this.state;

        var nameEmpty = '';
        if (this.state.name == '') {
            nameEmpty = 'El campo Nombre esta vacio';
        }

        var emailEmpty = '';
        if (this.state.email == '') {
            emailEmpty = 'El campo Correo esta vacio';
        } else {
            var expReg =
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
            var esValido = expReg.test(this.state.email);
            if (!esValido) {
                emailEmpty = 'El correo electronico no es válido';
            }
        }

        var cellPhoneEmpty = '';
        if (this.state.cellPhone == '') {
            cellPhoneEmpty = 'El campo Celular esta vacio';
        } else if (
            parseInt(this.state.cellPhone, 10) < 1000000000 ||
            parseInt(this.state.cellPhone, 10) > 10000000000
        ) {
            cellPhoneEmpty = 'El número celular no es valido';
        }

        var descriptionEmpty = '';
        if (this.state.description == '') {
            descriptionEmpty = 'El campo Descripción de la tienda esta vacio';
        }

        if (nameEmpty == '' && emailEmpty == '' && descriptionEmpty == '' && cellPhoneEmpty == '') {
            this.textoGuardar = 'La información se guardo exitosamente';
            this.tituloGuardar = 'Perfil Guardado';
        } else {
            this.textoGuardar = 'Hay campos vacios o con errores';
            this.tituloGuardar = 'Por favor revisar los campos';
        }

        this.fotoDefault =
            'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6';
        if (this.state.uid == undefined) {
            console.log('hola redireccionando...');
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
        }

        return (
            <>
                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-5 containerDivInfoTienda'>
                        <div className='row mb-5'></div>
                        <h2 className=' Categoria-Titulo columnInfoTiendas'>Información de la tienda</h2>
                        <h2
                            className='Categoria-Titulo columnAprobadoTiendas'
                            style={this.state.status == 'si' ? { color: '#FF3B7B' } : { color: '#000' }}
                        >
                            {this.state.status == 'si' ? 'Aprobado' : 'Pendiente de aprobación'}
                        </h2>

                        <div className='row rowInfoTienda'>
                            <div className='columnPerfilDatos'>
                                <div className='row mb-5'></div>

                                <h2 className='Categoria-SubTitulo'>Nombre Tienda</h2>
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

                                <div className='row mb-4'></div>

                                <h2 className='Categoria-SubTitulo'>Celular </h2>
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
                            </div>

                            <div className='columnPerfilDatos'>
                                <div className='row mb-5'></div>
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
                            </div>
                        </div>

                        <div className='row'>
                            <div className='columnDescripcion'>
                                <div className='row mb-4'></div>
                                <div className='row w-100'>
                                    <h2 className='Categoria-SubTitulo columnInfoTiendas'>Descripción de la tienda</h2>

                                    <h2
                                        className='Categoria-SubTitulo-Alerta columnAprobadoTiendas'
                                        style={
                                            this.state.descripcionStatus == false
                                                ? { display: 'initial' }
                                                : { display: 'none' }
                                        }
                                    >
                                        {' '}
                                        Pendiente de aprobación
                                    </h2>
                                </div>

                                <textarea
                                    type='text'
                                    rows='5'
                                    className='form-control text-muted '
                                    placeholder=''
                                    aria-label='Description'
                                    onChange={this.onChange}
                                    name='description'
                                    value={this.state.description}
                                />
                                <h2 className='Categoria-Alerta-Rojo'>{descriptionEmpty}</h2>

                                <div className='row mb-4'></div>

                                <h2 className='Categoria-SubTitulo'>Ubicación</h2>

                                <div id='mapBox'>
                                    <div id='searchBoxIcon'>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div id='searchBox'>
                                        <Autocomplete
                                            className={'form-control'}
                                            placeholder={'Buscar'}
                                            style={{ width: '100%', height: '40px', paddingLeft: '5%' }}
                                            onPlaceSelected={(place) => {
                                                Geocode.setApiKey('AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ');
                                                Geocode.setRegion('es');
                                                Geocode.fromAddress(place.formatted_address).then(
                                                    (response) => {
                                                        const { lat, lng } = response.results[0].geometry.location;
                                                        this.setState((prevState) => {
                                                            const markers = [...this.state.markers];
                                                            markers[0] = { ...markers[0], position: { lat, lng } };
                                                            return { markers };
                                                        });
                                                        this.setState({
                                                            lat: this.state.markers[0].position.lat,
                                                            lon: this.state.markers[0].position.lng
                                                        });

                                                        if (this.state.lat != this.state.latOld) {
                                                            this.setState({
                                                                latStatus: 'Cambio',
                                                                status: false
                                                            });
                                                        }

                                                        if (this.state.lon != this.state.lonOld) {
                                                            this.setState({
                                                                lonStatus: 'Cambio',
                                                                status: false
                                                            });
                                                        }
                                                    },
                                                    (error) => {
                                                        console.error(error);
                                                    }
                                                );
                                            }}
                                            types={[]}
                                            componentRestrictions={{ country: 'co' }}
                                        />
                                    </div>
                                    <Map
                                        disableDefaultUI={true}
                                        google={this.props.google}
                                        zoom={15}
                                        style={mapStyles}
                                        initialCenter={{
                                            lat: this.state.lat,
                                            lng: this.state.lon
                                        }}
                                        center={{
                                            lat: this.state.lat,
                                            lng: this.state.lon
                                        }}
                                    >
                                        {this.state.markers.map((marker, index) => (
                                            <Marker
                                                key={index}
                                                position={marker.position}
                                                draggable={true}
                                                onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
                                                name={marker.name}
                                            />
                                        ))}
                                    </Map>
                                </div>

                                <div className='row mb-4 columnDescripcion'></div>

                                <h2 className='Categoria-SubTitulo'>Fotos tienda</h2>

                                <div className='columnDescripcion'>
                                    <DropZone
                                        id='myDropzoneElementID'
                                        funcDrop={this.drop}
                                        funcRemove={this.deleteDropFoto}
                                    />
                                </div>

                                <div className='row  mb-4 '>
                                    {this.state.fotosTienda &&
                                        this.state.fotosTienda.length > 0 &&
                                        this.state.fotosTienda.map((item, i) => (
                                            <div key={i} className=' columnFotos mr-4'>
                                                <img
                                                    src={item.foto}
                                                    id={
                                                        item.estado != 'Pendiente'
                                                            ? 'fotosTienda'
                                                            : 'fotosTiendaPendientes'
                                                    }
                                                    className='text-center'
                                                />
                                                <h5
                                                    className='textoPendiente'
                                                    style={
                                                        item.estado == 'Pendiente'
                                                            ? { display: 'initial' }
                                                            : { display: 'none' }
                                                    }
                                                >
                                                    Pendiente <br /> aprobación
                                                </h5>
                                                <button className='top-right' onClick={this.deleteFoto(i)}>
                                                    x
                                                </button>
                                            </div>
                                        ))}

                                    {this.state.fotosDrop &&
                                        this.state.fotosDrop.length > 0 &&
                                        this.state.fotosDrop.map((itemfotosDrop, i) => (
                                            <div key={i} className=' columnFotos mr-4'>
                                                <img
                                                    src={URL.createObjectURL(itemfotosDrop)}
                                                    id='fotosTiendaPendientes'
                                                    className='text-center'
                                                />
                                                <h5 className='textoPendiente'>
                                                    Pendiente <br /> aprobación
                                                </h5>
                                                <button className='top-right' onClick={this.deleteDropFoto(i)}>
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                </div>
                                <div className='footerButtons'>
                                    <button
                                        className='btn text-white Categoria-btnRosado btnFull'
                                        data-toggle='modal'
                                        data-target='#ConfirmarModal'
                                    >
                                        Eliminar Tienda
                                    </button>
                                    <button
                                        className='btn text-white Categoria-btnMorado btnGuardarPerfil btnFull'
                                        onClick={this.onSubmit}
                                        data-toggle='modal'
                                        data-target='#GuardarModal'
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='row mb-5'></div>
                        <div className='row mb-5'></div>

                        <div className='modal fade' id='GuardarModal'>
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
                                                data-dismiss='modal'
                                                // onClick={this.exit}
                                            >
                                                Entendido
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='modal fade' id='ConfirmarModal'>
                            <div className='modal-dialog modal-dialog-centered' role='document'>
                                <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                    <div className='text-center modal-header border-bottom-0'>
                                        <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                            Eiminar Tienda
                                        </h4>
                                    </div>

                                    <div className='text-center modal-header border-bottom-0'>
                                        <h4 className='w-100 Categoria-SubTitulo modal-title' id='exampleModalLabel'>
                                            ¿Está seguro que desea eliminar su cuenta Meego?
                                        </h4>
                                    </div>

                                    <div className='row text-center'>
                                        <div className='columnBtnEliminarPerfil'>
                                            <button className='btn text-white Categoria-btnMorado' data-dismiss='modal'>
                                                Cancelar
                                            </button>
                                        </div>

                                        <div className='columnBtnEliminarPerfil'>
                                            <button
                                                className='btn text-white Categoria-btnRosado'
                                                data-dismiss='modal'
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
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ'
})(Tienda);
