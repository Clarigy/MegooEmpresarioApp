import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/EmpleadoProductos/EmpleadoProductos.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos_press.svg';
import { Link } from 'react-router-dom';

export class EmpleadoProductos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            idtienda: this.props.Tienda,
            uid: this.props.uid,
            foto: '',
            tienda: '',
            productos: [],
            checkbox: [],
            newGanancia: [],
            uidEmpleado: this.props.uidEmpleado
        };
    }

    componentDidMount = async () => {
        const productos = [];

        const collection = `/Tiendas/${this.state.idtienda}/empleados/`;

     
        const db = firebaseConfig.firestore();
        let docRef = db.collection(collection).doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then((doc) => {
            docRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        this.setState({
                            name: doc.data()['nombre'],
                            foto: doc.data()['fotoPerfil'],
                            tienda: doc.data()['tienda'],
                            checkbox: doc.data()['checkBox']
                        });

                        if(doc.data()['checkBox'] == undefined){
                            this.setState({
                                checkbox: []
                            });
                        }
                    }
            
                    db.collection('Productos')
                        .where('uidProveedor', '==', this.props.Tienda)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                productos.push(doc.data());
                            });
                            this.setState({
                                productos: productos
                            });
                        })
                        .catch(function (error) {
                            console.log('Error getting documents: ', error);
                        });
                })
                .catch(function (error) {
                    console.log('Error getting document:', error);
                });
        });
    };

    fetchinfo = () => {
        const collection = `/Tiendas/${this.state.idtienda}/empleados/`;

     
        const db = firebaseConfig.firestore();
        let docRef = db.collection(collection).doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data()['checkBox'] != undefined) {
                    if (doc.data()['checkBox'].length !== 0) {
                    
                        this.setState({
                            name: doc.data()['nombre'],
                            foto: doc.data()['fotoPerfil'],
                            tienda: doc.data()['tienda'],
                            checkbox: doc.data()['checkBox']
                        });
                    } else {
                        this.setState({
                            name: doc.data()['nombre'],
                            foto: doc.data()['fotoPerfil'],
                            tienda: doc.data()['tienda'],
                            checkbox: []
                        });
                    }
                } else {
                    this.setState({
                        name: doc.data()['nombre'],
                        foto: doc.data()['fotoPerfil'],
                        tienda: doc.data()['tienda'],
                        checkbox: []
                    });
                }
            }

           
        });
    };

    onChangeGanancia = (e) => {
        const checkbox = this.state.checkbox;
        const ganancias = this.state.newGanancia;

        var checkboxLenght = '';
        var newGanancias = e.target.value.replace(/\./g, '');
        e.target.value = newGanancias;

        if (newGanancias) {
            newGanancias = newGanancias
                .toString()
                .split('')
                .reverse()
                .join('')
                .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            newGanancias = newGanancias.toString().split('').reverse().join('').replace(/^[\.]/, '');
     
        }

        if (checkbox.length == 0) {
            var temp = ganancias.some((v) => v.producto === e.target.name);
   
            if (temp) {
                for (var j = 0; j < ganancias.length; j++) {
                    if (ganancias[j].producto == e.target.name) {
                        ganancias.splice(j, 1);
                        var obj = {
                            producto: e.target.name,
                            ganancia: newGanancias
                        };
                        ganancias.push(obj);
                     
                    }
                }
            } else {
                var obj = {
                    producto: e.target.name,
                    ganancia: newGanancias
                };
                ganancias.push(obj);
             
            }

       
            this.setState({
                checkbox: checkbox,
                newGanancia: ganancias
            });
            this.fetchinfo();
        } else {
            checkboxLenght = checkbox.length;
 
            for (var i = 0; i < checkboxLenght; i++) {
        
                if (e.target.name == checkbox[i].producto) {
                    checkbox[i].ganancia = newGanancias;
                    var obj = {
                        producto: e.target.name,
                        ganancia: newGanancias
                    };
                    ganancias.push(obj);
                  

                    this.setState({
                        checkbox: checkbox,
                        newGanancia: ganancias
                    });
                    this.onSubmit();
                    this.fetchinfo();
                } else {
                  
                    var temp = ganancias.some((v) => v.producto === e.target.name);

                    if (temp) {
                        for (var j = 0; j < ganancias.length; j++) {
                       
                            if (ganancias[j].producto == e.target.name) {
                                ganancias.splice(j, 1);
                                var obj = {
                                    producto: e.target.name,
                                    ganancia: newGanancias
                                };
                                ganancias.push(obj);
                            }
                        }
                        this.setState({
                            checkbox: checkbox,
                            newGanancia: ganancias
                        });
                        this.onSubmit();
                        this.fetchinfo();
                    } else {
                        var obj = {
                            producto: e.target.name,
                            ganancia: newGanancias
                        };
                        this.setState({
                            checkbox: checkbox,
                            newGanancia: ganancias
                        });
                        ganancias.push(obj);
                        this.onSubmit();
                        this.fetchinfo();
                    }
                }

            }
        }
    };

    onChange = (e) => {
        const checkbox = this.state.checkbox;
        let old = false;

        for (var i = 0; i < checkbox.length; i++) {
            if (e.target.value == checkbox[i].producto) {
                old = true;
                checkbox.splice(i, 1);
                break;
            } else {
                old = false;
            }
        }
        if (!old) {
            var obj = this.state.newGanancia.find((v) => v.producto === e.target.value);
            checkbox.push(obj);
        }

        this.setState({
            checkbox: checkbox
        });

        this.onSubmit();
    };

    onSubmit = async () => {
        const db = firebaseConfig.firestore();

        const collection = `/Tiendas/${this.state.idtienda}/empleados/`;
 
        await db.collection(collection).doc(this.state.uid).update({
            checkBox: this.state.checkbox
        });
    };

    exit = (e) => {
        this.setState({
            uid: undefined
        });
    };

    getGanancia(v) {
        let ganancia = 0;
        for (let i = 0; i < this.state.checkbox.length; i++) {

            if (v === item.producto) {
                ganancia = item.ganancia;
                break;
            } else {
                ganancia = 0;
            }
        }

        return ganancia;
    }

    showGanancia(producto) {
        let gananciaFinal = ""
        if(this.state.checkbox){
            gananciaFinal = this.state.checkbox.find((v) => v.producto === producto);
        }
        

        if (gananciaFinal) {
            return gananciaFinal.ganancia;
        } else {
            return;
        }
    }

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

                            <h2 className='Categoria-Titulo columnInfoTiendas'>Productos</h2>
                            <div className='row mb-5'></div>
                            <div className='row mb-5'></div>

                            <div className='row'>
                                <div className='col-12 table-responsive'>
                                    <table className='table'>
                                        <thead className='text-left '>
                                            <tr>
                                                <th className='tableContent'>Producto</th>
                                                <th>Precio</th>
                                                <th>Ganancia</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>

                                        {this.state.productos &&
                                            this.state.productos.length > 0 &&
                                            this.state.productos.map((producto, i) => (
                                                <tbody className='text-left CategoriaTabla-Body'>
                                                    <tr>
                                                        <td>{producto.producto}</td>
                                                        <td>{producto.ganancia}</td>
                                                        <td>
                                                            <input
                                                                type='text'
                                                                className='form-control text-muted '
                                                                placeholder=''
                                                                aria-label='Username'
                                                                onChange={this.onChangeGanancia}
                                                                name={producto.producto}
                                                                value={this.showGanancia(producto.producto)}
                                                                defaultValue={
                                                                    this.state.checkBox
                                                                        ? this.getGanancia(producto.producto)
                                                                        : ''
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className='containerCheck'>
                                                                <input
                                                                    defaultChecked={this.state.checkbox && this.state.checkbox.some(
                                                                        (v) => v.producto === producto.producto
                                                                    )}
                                                                    name='checkbox'
                                                                    type='checkbox'
                                                                    value={producto.producto}
                                                                    className=''
                                                                    onChange={this.onChange}
                                                                />
                                                                <span className='check-6c3eff'></span>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    {/*<div className='col-12 table-responsive'>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.producto}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.precio}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                            <h2 className="productosList">{producto.ganancia}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                            <label className="containerCheck">
                                                    <input
                                                        defaultChecked={this.state.checkbox.some(v => (v === producto.producto))}
                                                        name="checkbox"
                                                        type="checkbox"
                                                        value={producto.producto}
                                                        className=""
                                                        onChange={this.onChange} />
                                                    <span className="checkBoxProxima"></span>
                                                    </label>
                                            </div>
                                            <br />
                                            <div className='row mb-3' ></div>
                                    </div>*/}
                                                </tbody>
                                            ))}
                                    </table>
                                </div>
                            </div>
                            <div className='row mb-5'></div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default EmpleadoProductos;
