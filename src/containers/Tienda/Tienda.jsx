import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tienda/Tienda.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda.svg';
import MedioPago from '../../assets/images/components/Iconos/icono_medio_de_pago.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import DropZone from "../../components/Dropzone/DropZone.js";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

const mapStyles = {
    width: '100%',
    height: '100%'
};


export class Tienda extends Component {

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
            markers: [
                {
                    name: "Current position",
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
        };

    }




    onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            return { markers };
        });
        this.setState({
            lat: this.state.markers[0].position.lat,
            lon: this.state.markers[0].position.lng,
        });


        if (this.state.lat != this.state.latOld) {
            console.log("cambio lat");
            this.setState({
                latStatus: "Cambio",
                status: false
            })
        }

        if (this.state.lon != this.state.lonOld) {
            console.log("cambio lon");
            this.setState({
                lonStatus: "Cambio",
                status: false
            })
        }
    };


    componentDidMount = () => {

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
                    email: doc.data()["email"],
                    emailOld: doc.data()["email"],
                    emailStatus: doc.data()["emailStatus"],
                    cellPhone: doc.data()["celular"],
                    cellPhoneOld: doc.data()["celular"],
                    cellStatus: doc.data()["cellStatus"],
                    description: doc.data()["descripcion"],
                    descripcionOld: doc.data()["descripcion"],
                    descripcionStatus: doc.data()["descripcionStatus"],
                    uid: doc.data()["uid"],
                    foto: doc.data()["foto"],
                    status: doc.data()["aprobado"],
                    lat: doc.data()["lat"],
                    latOld: doc.data()["lat"],
                    latStatus: doc.data()["latStatus"],
                    lon: doc.data()["long"],
                    lonOld: doc.data()["long"],
                    lonStatus: doc.data()["lonStatus"],
                    fotosTienda: doc.data()["fotosTienda"],
                    fotosStatus: doc.data()["fotosStatus"]
                });
                const lat = doc.data()["lat"];
                const lng = doc.data()["long"];



                this.setState(prevState => {
                    const markers = [...this.state.markers];
                    markers[0] = { ...markers[0], position: { lat, lng } };
                    return { markers };
                });



            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

            if (this.state.nameStatus == undefined)
                this.setState({
                    nameStatus: false
                })

            if (this.state.cellStatus == undefined)
                this.setState({
                    cellStatus: false
                })

            if (this.state.latStatus == undefined)
                this.setState({
                    latStatus: false
                })

            if (this.state.lonStatus == undefined)
                this.setState({
                    lonStatus: false
                })

            if (this.state.emailStatus == undefined)
                this.setState({
                    emailStatus: false
                })

            if (this.state.descripcionStatus == undefined)
                this.setState({
                    descripcionStatus: false
                })

            if (this.state.fotosStatus == undefined)
                this.setState({
                    fotosStatus: []
                })

            if (this.state.fotosTienda == undefined)
                this.setState({
                    fotosTienda: []
                })
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });



    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if (this.state.name != this.state.nameold) {
            console.log("cambio nombre");
            this.setState({
                nameStatus: "Cambio",
                status: false
            })
        }

        if (this.state.email != this.state.emailOld) {
            console.log("cambio email");
            this.setState({
                emailStatus: "Cambio",
                status: false
            })
        }

        if (this.state.cellPhone != this.state.cellPhoneOld) {
            console.log("cambio celular");
            this.setState({
                cellStatus: "Cambio",
                status: false
            })
        }


        if (this.state.description != this.state.descripcionOld) {
            console.log("cambio Descripcion");
            this.setState({
                descripcionStatus: "Cambio",
                status: false
            })
        }




    }

    onSubmit = async (e) => {
        let urlFotosArray = this.state.fotosTienda;
        let fotosStatusArray = this.state.fotosStatus;

        var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        var esValido = expReg.test(this.state.email);


        const db = firebaseConfig.firestore();

        await db.collection("TiendasTest").doc(this.state.uid + "-" + this.state.nameold).set({
            "nombre": this.state.name,
            "nameStatus": this.state.nameStatus,
            "email": this.state.email,
            "emailStatus": this.state.emailStatus,
            "celular": this.state.cellPhone,
            "cellStatus": this.state.cellStatus,
            "descripcion": this.state.description,
            "descripcionStatus": this.state.descripcionStatus,
            "long": this.state.lon,
            "lonStatus": this.state.lonStatus,
            "lat": this.state.lat,
            "latStatus": this.state.latStatus,
            "uid": this.state.uid,
            "aprobado": this.state.status,
            "foto": this.state.foto,
            "fotosStatus": this.state.fotosStatus,
            "fotosTienda": this.state.fotosTienda
        });


        if (this.state.fotosDrop[0]) {
            for (var i = 0; i < this.state.fotosDrop.length; i++) {
                const nombreImagen = this.state.fotosDrop[i].name;

                const file = this.state.fotosDrop[i];
                const storageRef = firebaseConfig.storage().ref();
                const fileRef = storageRef.child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen);
                fileRef.put(file).then(() => {
                    console.log('Upload a file');
                    storageRef
                        .child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen)
                        .getDownloadURL()
                        .then(async (url) => {
                            urlFotosArray.push(url);
                            fotosStatusArray.push("Pendiente aprobación")
                            await db.collection("TiendasTest").doc(this.state.uid + "-" + this.state.nameold).update({
                                fotosStatus: fotosStatusArray,
                                fotosTienda: urlFotosArray
                            });
                        })
                        .catch((err) => console.error(err));
                });
            }



            this.setState({
                fotosDrop: []
            })
            

            this.setState({ arrTienda: urlFotosArray, fotosStatus: fotosStatusArray });
        }

       



        e.preventDefault();
    }

    delete = e => {

        const db = firebaseConfig.firestore();


        db.collection('TiendasTest').doc(this.state.uid + "-" + this.state.name).delete();

        this.setState({
            uid: undefined
        })

    }

    deleteFoto(i) {
        return () => {
            this.state.fotosTienda.splice(i, 1);
            this.state.fotosStatus.splice(i, 1);
            this.setState({
                fotosTienda: this.state.fotosTienda,
                fotosStatus: this.state.fotosStatus,
            })


        }



    }

    exit = e => {

        this.setState({
            uid: undefined
        })

    }

    drop = e => {
        this.setState({
            fotosDrop: e,
        })



    }





    render() {

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

        var cellPhoneEmpty = "";
        if (this.state.cellPhone == "") {
            cellPhoneEmpty = "El campo Celular esta vacio"
        } else if (parseInt(this.state.cellPhone, 10) < 1000000000 || parseInt(this.state.cellPhone, 10) > 10000000000) {
            cellPhoneEmpty = "El número celular no es valido"
        }

        var descriptionEmpty = "";
        if (this.state.description == "") {
            descriptionEmpty = "El campo Descripción de la tienda esta vacio"
        }

        if (nameEmpty == "" && emailEmpty == "" && descriptionEmpty == "" && cellPhoneEmpty == "") {

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
                        pathname: "/Tiendas",
                        customObject: this.state.uid,
                    }} />
                </>
            )
        } else {
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5'>

                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>
                            <div className="text-center columnFotoTienda">
                                <div className={this.state.foto == this.fotoDefault ? "divFotoTiendaNew" : "divFotoTienda"} style={this.state.foto == this.fotoDefault ? { backgroundColor: "#fff" } : { backgroundColor: "#1A1446" }}>

                                    <img src={this.state.foto} id="fotoTienda" className='text-center' />
                                </div>
                                <div className='row mb-2' ></div>
                                <h2 className='text-center Categoria-Titulo mt-1 h2Nombre'>{this.state.name}</h2>
                                <div className='row mb-5' ></div>

                                <div className='row'>
                                    <div className="btnPress ml-4 mb-3">
                                        <img src={InfoTienda} id="iconoBtn" />
                                        <h6 className='txtBtnPress'>Información de la tienda</h6>
                                    </div>

                                    <div className="btnNoPress ml-4">
                                        <img src={MedioPago} id="iconoBtn" />
                                        <h6 className='txtBtnNoPress'>Medio de pago</h6>
                                    </div>
                                </div>
                                <div className='row mb-3' ></div>
                                <div className='row'>
                                    <Link to={{
                                        pathname: "/Servicios",
                                        customObject: this.state.uid + "-" + this.state.name,
                                        hash: "#" + this.state.name,

                                    }} >
                                        <div className="btnNoPress ml-4 mb-3">
                                            <img src={Servicios} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Servicios</h6>
                                        </div>
                                    </Link>
                                    <Link to={{
                                        pathname: "/Productos",
                                        customObject: this.state.uid + "-" + this.state.name,
                                        hash: "#" + this.state.name,

                                    }} >
                                        <div className="btnNoPress ml-4">
                                            <img src={Productos} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Productos</h6>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className='row mb-5' ></div>

                            <h2 className={this.state.status == true ? "Categoria-Titulo" : " Categoria-Titulo columnPerfilDatos"}>Información de la tienda</h2>
                            <h2 className='Categoria-Titulo' style={{ color: "#FF3B7B" }}>{this.state.status ? "" : "Pendiente de aprobación"}</h2>

                            <div className='row'>



                                <div className="columnPerfilDatos">
                                    <div className='row mb-5' ></div>


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

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Celular                                     </h2>
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

                                <div className="columnPerfilDatos">

                                    <div className='row mb-5' ></div>
                                    <h2 className='Categoria-SubTitulo'>Correo
                                    </h2>
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


                                <div className="columnDescripcion">

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Descripción de la tienda<h2 className='Categoria-SubTitulo mx-4' style={this.state.descripcionStatus == "Cambio" ? { display: "initial", color: "#FF3B7B", fontSize: "12px" } : { display: "none" }}> Pendiente de aprobación</h2>
                                    </h2>
                                    <textarea
                                        type='text'
                                        rows="5"
                                        className='form-control text-muted '
                                        placeholder=''
                                        aria-label='Description'
                                        onChange={this.onChange}
                                        name='description'
                                        value={this.state.description}
                                    />
                                    <h2 className='Categoria-Alerta-Rojo'>{descriptionEmpty}</h2>

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Ubicación</h2>

                                    <div id="mapBox">
                                        <div id="searchBoxIcon">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </div>
                                        <div id="searchBox">
                                            <Autocomplete
                                                className={"form-control"}
                                                placeholder={"Buscar"}
                                                style={{ width: '100%', height: '40px', paddingLeft: '5%' }}
                                                onPlaceSelected={(place) => {
                                                    Geocode.setApiKey("AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ");
                                                    Geocode.setRegion("es");
                                                    Geocode.fromAddress(place.formatted_address).then(
                                                        response => {
                                                            const { lat, lng } = response.results[0].geometry.location;
                                                            this.setState(prevState => {
                                                                const markers = [...this.state.markers];
                                                                markers[0] = { ...markers[0], position: { lat, lng } };
                                                                return { markers };
                                                            });
                                                            this.setState({
                                                                lat: this.state.markers[0].position.lat,
                                                                lon: this.state.markers[0].position.lng,
                                                            });

                                                            if (this.state.lat != this.state.latOld) {
                                                                console.log("cambio lat");
                                                                this.setState({
                                                                    latStatus: "Cambio",
                                                                    status: false
                                                                })
                                                            }

                                                            if (this.state.lon != this.state.lonOld) {
                                                                console.log("cambio lon");
                                                                this.setState({
                                                                    lonStatus: "Cambio",
                                                                    status: false
                                                                })
                                                            }
                                                        },
                                                        error => {
                                                            console.error(error);
                                                        }
                                                    );
                                                    console.log(place.formatted_address);
                                                }}
                                                types={[]}
                                                componentRestrictions={{ country: "co" }}
                                            />
                                        </div>
                                        <Map
                                            disableDefaultUI={true}
                                            google={this.props.google}
                                            zoom={15}
                                            style={mapStyles}
                                            initialCenter={
                                                {
                                                    lat: this.state.lat,
                                                    lng: this.state.lon
                                                }
                                            }
                                            center={
                                                {
                                                    lat: this.state.lat,
                                                    lng: this.state.lon
                                                }
                                            }
                                        >
                                            {this.state.markers.map((marker, index) => (
                                                <Marker
                                                    position={marker.position}
                                                    draggable={true}
                                                    onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
                                                    name={marker.name}
                                                />
                                            ))}

                                        </Map>

                                    </div>

                                    <div className='row mb-4' ></div>

                                    <h2 className='Categoria-SubTitulo'>Fotos tienda</h2>

                                    <div>

                                        <DropZone funcDrop={this.drop} />



                                    </div>

                                    <div className="row  mb-4 " >


                                        {this.state.fotosTienda && this.state.fotosTienda.length > 0 && this.state.fotosTienda.map((item, i) => (
                                            <div className=" columnFotos mr-4">

                                                <img src={item} id={this.state.fotosStatus[i] != "Pendiente aprobación" ? "fotosTienda" : "fotosTiendaPendientes"} className='text-center' />
                                                <h5 className="textoPendiente"
                                                    style={this.state.fotosStatus[i] == "Pendiente aprobación" ? { display: "initial" } : { display: "none" }}>Pendiente <br /> aprobación</h5>
                                                <button className="top-right" onClick={this.deleteFoto(i)}>x</button>
                                            </div>
                                        ))}

                                        {this.state.fotosDrop && this.state.fotosDrop.length > 0 && this.state.fotosDrop.map((itemfotosDrop, i) => (
                                            <div className=" columnFotos mr-4">

                                                <img src={URL.createObjectURL(itemfotosDrop)} id={this.state.fotosStatus[i] != "Pendiente aprobación" ? "fotosTienda" : "fotosTiendaPendientes"} className='text-center' />
                                                <h5 className="textoPendiente"
                                                >Pendiente <br /> aprobación</h5>
                                                <button className="top-right" onClick={this.deleteFoto(i)}>x</button>
                                            </div>
                                        ))}


                                    </div>




                                    <button
                                        className='btn text-white Categoria-btnRosado'
                                        data-toggle='modal'
                                        data-target='#ConfirmarModal'

                                    >
                                        Eliminar Tienda
                                </button>
                                    <button className='btn text-white Categoria-btnMorado btnGuardarPerfil' onClick={this.onSubmit}
                                        data-toggle='modal'
                                        data-target='#GuardarModal'
                                    >
                                        Guardar
                                </button>

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
                                                // onClick={this.exit}
                                                >
                                                    Entendido
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
        ;
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAHCNxG_nmpInxXRUR96vggQNlY3QlW8lQ'
})(Tienda);