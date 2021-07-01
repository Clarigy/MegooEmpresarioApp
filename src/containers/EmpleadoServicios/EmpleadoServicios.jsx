import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/EmpleadoProductos/EmpleadoProductos.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios_press.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import { Link } from 'react-router-dom';

export class EmpleadoServicios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            idtienda: this.props.Tienda,
            uid: this.props.uid,
            foto: '',
            tienda: '',
            servicios: [],
            checkBoxServicios: [],
            categorias: [],
            uidEmpleado: this.props.uidEmpleado
        };
    }

    componentDidMount = async () => {
        const servicios = [];
        const categoriasTemp = [];
        const categorias = [];
        const serviciosTemp = [];
        let object = {};

    
        const collection = `/Tiendas/${this.state.idtienda}/empleados/`;
        const db = firebaseConfig.firestore();

        let docRef = db.collection(collection).doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        await docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if (doc.data()['checkBoxServicios'] != undefined) {
                        this.setState({
                            name: doc.data()['nombre'],
                            foto: doc.data()['fotoPerfil'],
                            tienda: doc.data()['tienda'],
                            checkBoxServicios: doc.data()['checkBoxServicios']
                        });
                    } else {
                        this.setState({
                            name: doc.data()['nombre'],
                            foto: doc.data()['fotoPerfil'],
                            tienda: doc.data()['tienda'],
                            checkBoxServicios: []
                        });
                    }

                    const { user } = this.context;

                    db.collection('Servicios')
                        .where('uidProveedor', '==', this.state.idtienda)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                //servicios.push(doc.data());
                                if (doc.data().categoria != 'OtroCategoria') {
                                    categoriasTemp.push(doc.data().categoria);
                                } else {
                                    categoriasTemp.push(doc.data().otrasCategorias);
                                }
                                if (doc.data().servicio != 'Otro') {
                                    object = {
                                        servicio: doc.data().servicio,
                                        categoria: doc.data().categoria,
                                        otraCategoria: doc.data().otrasCategorias,
                                        precio: doc.data().precio
                                    };
                                } else {
                                    object = {
                                        servicio: doc.data().otrosServicios,
                                        categoria: doc.data().categoria,
                                        otraCategoria: doc.data().otrasCategorias,
                                        precio: doc.data().precio
                                    };
                                }
                                serviciosTemp.push(object);
                            });
                            categoriasTemp.sort();

                            serviciosTemp.sort((a, b) =>
                                a.servicio > b.servicio ? 1 : b.servicio > a.servicio ? -1 : 0
                            );

                            for (let i = 0; i < categoriasTemp.length; i++) {
                                if (categoriasTemp[i + 1] != categoriasTemp[i]) {
                                    categorias.push(categoriasTemp[i]);
                                }
                            }

                            for (let i = 0; i < serviciosTemp.length; i++) {
                                var item1 = serviciosTemp[i + 1];
                                var item = serviciosTemp[i];

                                if (item1 != null) {
                                    if (item1.servicio != item.servicio) {
                                        servicios.push(item);
                                    }
                                } else {
                                    servicios.push(item);
                                }
                            }

                            this.save_info();

                            this.setState({
                                servicios: servicios,
                                categorias: categorias
                            });
                        })
                        .catch(function (error) {
                            console.log('Error getting documents: ', error);
                        });
                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                }
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
            });


    };

    save_info() {
        if (this.state.checkBoxServicios.length == 0) {
            window.onbeforeunload = () => true;
        } else {
            window.onbeforeunload = undefined;
        }
    }

    onChange = (e) => {
        const checkBoxServicios = this.state.checkBoxServicios;

        var old = false;

        for (var i = 0; i < checkBoxServicios.length; i++) {
  
            if (e.target.value == checkBoxServicios[i]) {
                this.old = true;
                checkBoxServicios.splice(i, 1);
        
                break;
            } else {
                this.old = false;
            }
        }

        if (!this.old) {
            checkBoxServicios.push(e.target.value);
        }

        this.setState({
            checkBoxServicios: checkBoxServicios
        });

        this.onSubmit();



        this.save_info();
    };

    onSubmit = async () => {
        const db = firebaseConfig.firestore();
        const collection = `/Tiendas/${this.state.idtienda}/empleados/`;

        await db.collection(collection).doc(this.state.uid).update({
            checkBoxServicios: this.state.checkBoxServicios
        });
    };

    exit = (e) => {
        this.setState({
            uid: undefined
        });
    };

    render() {
        this.fotoDefault =
            'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6';

        if (this.state.uid == undefined) {
            return (
                <>
                    <Redirect
                        to={{
                            pathname: '/Equipo',
                            customObject: this.state.uid
                        }}
                    />
                </>
            );
        } else {
            return (
                <>
                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5 containerDivInfoTienda'>
                            <div className='row mb-5'></div>

                            <h2 className='Categoria-Titulo columnInfoTiendas'>Servicios</h2>
                            <div className='row mb-5'></div>
                            <div className='row mb-5'></div>

                            <div className='row'>
                                {this.state.categorias &&
                                    this.state.categorias.length > 0 &&
                                    this.state.categorias.map((categoria) => (
                                        <div className='col-12 table-responsive'>
                                            <h1 className='SubTitulo-List'>{categoria}</h1>
                                            <div className='row mb-2'></div>

                                            {this.state.servicios &&
                                                this.state.servicios.length > 0 &&
                                                this.state.servicios.map((servicio) => (
                                                    <div
                                                        className='tableServicio'
                                                        style={
                                                            servicio.categoria == categoria ||
                                                            servicio.otraCategoria == categoria
                                                                ? { display: 'initial' }
                                                                : { display: 'none' }
                                                        }
                                                    >
                                                        <div className='columnDatos'>
                                                            <h2 className='productosList'>
                                                                {servicio.servicio != 'Otro'
                                                                    ? servicio.servicio
                                                                    : servicio.otrosServicios}
                                                            </h2>
                                                        </div>
                                                        <div className='columnDatos text-center '>
                                                            <label className='containerCheck'>
                                                                <input
                                                                    defaultChecked={this.state.checkBoxServicios.some(
                                                                        (v) => v === servicio.servicio
                                                                    )}
                                                                    name='checkBoxServicios'
                                                                    type='checkbox'
                                                                    value={servicio.servicio}
                                                                    className=''
                                                                    onChange={this.onChange}
                                                                />
                                                                <span className='check-6c3eff'></span>
                                                            </label>
                                                        </div>
                                                        <br />
                                                        <div className='row mb-3'></div>
                                                    </div>
                                                ))}
                                            <div className='row mb-5'></div>
                                        </div>
                                    ))}
                                <div className='row mb-5'></div>
                            </div>

                            <div className='row mb-5'></div>
                            <div className='row mb-5'></div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default EmpleadoServicios;
