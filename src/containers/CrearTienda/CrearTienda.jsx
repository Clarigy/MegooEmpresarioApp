import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import firebaseConfig from '../../firebase/setup.jsx';
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
import { Redirect } from 'react-router-dom';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';
import { Link } from 'react-router-dom';

const mapStyles = {
    width: '100%',
    height: '100%'
};

export class CrearTienda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            cellPhone: '',
            description: '',
            uid: this.props.location.customObject,
            aprobado: false,
            foto: 'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6',
            status: false,
            lat: 3.43722,
            lon: -76.5225,
            create: false,
            loading: true,
            isActive: false,
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
            fotosPreview: null,
            arrTienda: [],
            fotosStatus: [],
            file: ''
        };
    }
    componentDidMount = () => {
        $('#nabvar').show();
        $('#accordionSidebar').show();
        IconActive.checkPath('Siderbar-Perfil', '/perfil', this.props.match.path);
        $('.react-bootstrap-table-pagination-list').removeClass('col-md-6 col-xs-6 col-sm-6 col-lg-6');
        $('.react-bootstrap-table-pagination-list').addClass('col-2 offset-5 mt-4');

        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false,
                isActive: false
            });
        }, 1000);
    };

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
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = async (e) => {
        let urlFotosArray = [];
        let fotosStatusArray = [];
        let date = new Date();

        var expReg =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        var esValido = expReg.test(this.state.email);

        if (
            this.state.name != '' &&
            this.state.email != '' &&
            this.state.description != '' &&
            this.state.cellPhone != '' &&
            this.state.fotosDrop.length > 0 &&
            this.state.lat != 3.43722 &&
            this.state.lon != -76.5225
        ) {
            const db = firebaseConfig.firestore();
            var batch = db.batch();

            let newTienda = db.collection('Tiendas').doc(this.state.uid + '-' + this.state.name);
            batch.set(newTienda, {
                aprobado: 'No',
                biografia: this.state.description,
                calificacion: '',
                cedula: '',
                celular: this.state.cellPhone,
                descripcionLugar: '',
                direccion: '',
                edad: '',
                email: this.state.email,
                fechaRegistro: date,
                fotoLugar: '',
                fotoProveedor: this.state.foto,
                hastaPremium: '',
                latitud: this.state.lat,
                longitud: this.state.lon,
                nombre: this.state.name,
                plan: '',
                profesion: '',
                uid: this.state.uid + '-' + this.state.name,
                uidProveedor: this.state.uid,
                tipoMeego: ''
            });
            await batch.commit();

            if (this.state.fotosDrop[0]) {
                for (var i = 0; i < this.state.fotosDrop.length; i++) {
                    const nombreImagen = this.state.fotosDrop[i].name;
                    const file = this.state.fotosDrop[i];
                    const storageRef = firebaseConfig.storage().ref();
                    const fileRef = storageRef.child(
                        '/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen
                    );
                    fileRef.put(file).then(() => {
                     
                        storageRef
                            .child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen)
                            .getDownloadURL()
                            .then(async (url) => {
                                urlFotosArray.push(url);
                        
                                fotosStatusArray.push('Pendiente aprobación');

                                db.collection(`/Tiendas/${this.state.uid}-${this.state.name}/misTrabajos`).add({
                                    foto: url,
                                    uid: this.state.uid + '-' + this.state.name,
                                    estado: 'Pendiente'
                                });
                            })
                            .catch((err) => console.error(err));
                    });
                }

                this.setState({ arrTienda: urlFotosArray, fotosStatus: fotosStatusArray });
                this.setState({
                    isActive: true
                });
            }
        }

        /*e.preventDefault();*/
    };

    onChangeFile = (e) => {
        const { user } = this.context;

        //if (this.state.foto == "https://firebasestorage.googleapis.com/v0/b/meegoapp.appspot.com/o/foto%2Fuser.png?alt=media&token=3765c611-9c4c-4c01-bce7-6767290fc2d1") {
        const file = e.target.files[0];
        const storageRef = firebaseConfig.storage().ref();
        const nombreImagen = file.name;
        storageRef
            .child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen)
            .put(file)
            .then(() => {
         
                storageRef
                    .child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen)
                    .getDownloadURL()
                    .then((url) => {
                        this.setState({
                            foto: url
                        });
        
                    });
            });

   
    };

    exit = (e) => {
        this.setState({
            create: true
        });
    };

    drop = (e) => {
        this.setState({
            fotosDrop: e
        });
    };

    deleteFoto(i) {
        return () => {
            this.state.fotosTienda.splice(i, 1);
            this.state.fotosStatus.splice(i, 1);
      
            this.setState({
                fotosTienda: this.state.fotosTienda,
                fotosStatus: this.state.fotosStatus
            });
        };
    }

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

        this.fotoDefault =
            'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6';

        if (
            nameEmpty == '' &&
            emailEmpty == '' &&
            descriptionEmpty == '' &&
            cellPhoneEmpty == '' &&
            this.state.fotosDrop.length > 0 &&
            this.state.lat != 3.43722 &&
            this.state.lon != -76.5225
        ) {
            this.textoGuardar = 'La información se guardo exitosamente';
            this.tituloGuardar = 'Tienda creada';
        } else {
            this.textoGuardar = 'Hay campos vacios o con errores';
            this.tituloGuardar = 'Por favor revisar los campos';
        }

        if (this.state.uid == undefined) {
            return (
                <>
                    <Redirect
                        to={{
                            pathname: '/Tiendas',
                            customObject: this.state.uid
                        }}
                    />
                </>
            );
        } else if (this.state.create == true) {
            const uid = undefined;

            return (
                <>
                    <Redirect
                        to={{
                            pathname: '/Tiendas',
                            customObject: uid
                        }}
                    />
                </>
            );
        } else {
            return (
                <>
                    <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5 perfilContainer'>
                            <div className='row mb-5'></div>

                            <div className='text-center  columnTiendaBtn'>
                                <div className='row'>
                                    <div className='colFoto'>
                                        <div>
                                            <input
                                                type='file'
                                                id='file'
                                                style={{ display: 'none' }}
                                                onChange={(e) => this.onChangeFile(e)}
                                            />
                                            <label
                                                htmlFor='file'
                                                className='divFotoPerfil'
                                                className={
                                                    this.state.foto == this.fotoDefault
                                                        ? 'divFotoTiendaNew'
                                                        : 'divFotoTienda'
                                                }
                                                style={
                                                    this.state.foto == this.fotoDefault
                                                        ? { backgroundColor: '#fff' }
                                                        : { backgroundColor: '#1A1446' }
                                                }
                                            >
                                                <img className='text-center' src={this.state.foto} id='fotoTienda' />
                                            </label>
                                            {/* <img src={this.state.foto} id='fotoTienda' className='text-center' /> */}
                                        </div>

                                        <div className='row mb-2'></div>
                                        <h2 className='text-center Categoria-Titulo mt-1'>{this.state.name}</h2>
                                        <div className='row mb-5'></div>
                                    </div>
                                </div>

                                <div className='row rowButtonsTienda'>
                                    <Link
                                        to={
                                            this.state.isActive
                                                ? {
                                                      pathname: '/Tienda',
                                                      customObject: this.state.uid + '-' + this.state.name,
                                                      hash: '#' + this.state.name
                                                  }
                                                : '#'
                                        }
                                    >
                                        <div className='btnPress ml-4 mb-3'>
                                            <img src={InfoTienda} id='iconoBtn' />
                                            <h6 className='txtBtnPress'>Información de la tienda</h6>
                                        </div>
                                    </Link>
                                    <Link
                                        to={
                                            this.state.isActive
                                                ? {
                                                      pathname: '/Tienda',
                                                      customObject: this.state.uid + '-' + this.state.name,
                                                      hash: '#' + this.state.name
                                                  }
                                                : '#'
                                        }
                                    >
                                        <div
                                            className={
                                                this.state.isActive ? 'btnNoPress ml-4 mb-3' : 'btnDisable ml-4 mb-3'
                                            }
                                        >
                                            <img src={MedioPago} id='iconoBtn' />
                                            <h6 className='txtBtnNoPress'>Medio de pago</h6>
                                        </div>
                                    </Link>

                                    <div className='row mb-3'></div>

                                    <Link
                                        to={
                                            this.state.isActive
                                                ? {
                                                      pathname: '/Servicios',
                                                      customObject: this.state.uid + '-' + this.state.name,
                                                      hash: '#' + this.state.name
                                                  }
                                                : '#'
                                        }
                                    >
                                        <div
                                            className={
                                                this.state.isActive ? 'btnNoPress ml-4 mb-3' : 'btnDisable ml-4 mb-3'
                                            }
                                        >
                                            <img src={Servicios} id='iconoBtn' />
                                            <h6 className='txtBtnNoPress'>Servicios</h6>
                                        </div>
                                    </Link>
                                    <Link
                                        to={
                                            this.state.isActive
                                                ? {
                                                      pathname: '/Servicios',
                                                      customObject: this.state.uid + '-' + this.state.name,
                                                      hash: '#' + this.state.name
                                                  }
                                                : '#'
                                        }
                                    >
                                        <div
                                            className={
                                                this.state.isActive ? 'btnNoPress ml-4 mb-3' : 'btnDisable ml-4 mb-3'
                                            }
                                        >
                                            <img src={Productos} id='iconoBtn' />
                                            <h6 className='txtBtnNoPress'>Productos</h6>
                                        </div>
                                    </Link>
                                </div>

                                <div className='row mb-5'></div>
                            </div>

                            <div className='columnInfoTienda'>
                                <h2 className='Categoria-Titulo'>Crear una tienda</h2>

                                <div className='row rowDatos'>
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

                                        <h2 className='Categoria-SubTitulo'>Celular</h2>
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

                                        <h2 className='Categoria-SubTitulo'>Descripción de la tienda</h2>
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
                                                {
                                                    <Autocomplete
                                                        className={'form-control'}
                                                        placeholder={'Buscar'}
                                                        style={{ width: '100%', height: '40px', paddingLeft: '5%' }}
                                                        onPlaceSelected={(place) => {
                                                            Geocode.setApiKey(
                                                                'AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ'
                                                            );
                                                            Geocode.setRegion('es');
                                                            Geocode.fromAddress(place.formatted_address).then(
                                                                (response) => {
                                                                    const { lat, lng } =
                                                                        response.results[0].geometry.location;
                                                                    this.setState((prevState) => {
                                                                        const markers = [...this.state.markers];
                                                                        markers[0] = {
                                                                            ...markers[0],
                                                                            position: { lat, lng }
                                                                        };
                                                                        return { markers };
                                                                    });
                                                                    this.setState({
                                                                        lat: this.state.markers[0].position.lat,
                                                                        lon: this.state.markers[0].position.lng
                                                                    });
                                                                },
                                                                (error) => {
                                                                    console.error(error);
                                                                }
                                                            );
                                                        
                                                        }}
                                                        types={[]}
                                                        componentRestrictions={{ country: 'co' }}
                                                    />
                                                }
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
                                                        position={marker.position}
                                                        draggable={true}
                                                        onDragend={(t, map, coord) =>
                                                            this.onMarkerDragEnd(coord, index)
                                                        }
                                                        name={marker.name}
                                                    />
                                                ))}
                                            </Map>
                                        </div>

                                        <div className='row mb-4'></div>

                                        <h2 className='Categoria-SubTitulo'>Fotos tienda</h2>

                                        <div className='dropContainer'>
                                            <DropZone funcDrop={this.drop} />
                                        </div>

                                        <div className='row  mb-4 '>
                                            {this.state.fotosDrop &&
                                                this.state.fotosDrop.length > 0 &&
                                                this.state.fotosDrop.map((itemfotosDrop, i) => (
                                                    <div className=' columnFotos mr-4'>
                                                        <img
                                                            src={URL.createObjectURL(itemfotosDrop)}
                                                            id={
                                                                this.state.fotosStatus[i] != 'Pendiente aprobación'
                                                                    ? 'fotosTienda'
                                                                    : 'fotosTiendaPendientes'
                                                            }
                                                            className='text-center'
                                                        />
                                                        <h5 className='textoPendiente'>
                                                            Pendiente <br /> aprobación
                                                        </h5>
                                                        <button className='top-right' onClick={this.deleteFoto(i)}>
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>

                                        <div className='row mb-5'></div>
                                        <div className='buttonContainer'>
                                            <button
                                                className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarTienda'
                                                onClick={this.onSubmit}
                                                data-toggle='modal'
                                                data-target='#GuardarModal'
                                            >
                                                Crear tienda
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='modal fade' id='GuardarModal'>
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                {this.tituloGuardar}
                                            </h4>
                                        </div>

                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4
                                                className='w-100 Categoria-SubTitulo modal-title'
                                                id='exampleModalLabel'
                                            >
                                                {this.textoGuardar}
                                            </h4>
                                        </div>

                                        <div className='row text-center'>
                                            <div className='columnBtnGuardarPerfil'>
                                                <button
                                                    className='btn text-white Categoria-btnMorado'
                                                    data-dismiss='modal'
                                                    onClick={
                                                        this.textoGuardar == 'Hay campos vacios o con errores'
                                                            ? null
                                                            : this.exit
                                                    }
                                                >
                                                    Ok
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
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ'
})(CrearTienda);
