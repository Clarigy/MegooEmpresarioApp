import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Servicios/Servicios.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import MedioPago from '../../assets/images/components/Iconos/icono_medio_de_pago.svg';
import ServiciosImg from '../../assets/images/components/Iconos/icono_servicios.svg';
import ProductosImg from '../../assets/images/components/Iconos/icono_productos_press.svg';
import EliminarServicio from '../../assets/images/components/Iconos/icono_eliminar_servicio.svg';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import { Link } from "react-router-dom";

export class Productos extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",
            foto: "",
            productos: [],
            newDescripcion: "",
            newGanancia: 0,
            newImagen: "",
            newPrecio: 0,
            newProducto: "",
            newFotoProducto: "",
            tienda: this.props.location.customObject,
            newEstado: "Pendiente",
            productosDefault: [],
            search: ""
        };

    }



    componentDidMount = () => {


        const productos = [];
        const db = firebaseConfig.firestore();

        db.collection("TiendasTest").doc(this.state.tienda).get().then(doc => {
            if (doc.exists) {
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["foto"],
         
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });


        db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    productos.push(doc.data());

                });
                this.setState({ productos: productos, productosDefault: productos });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });


    }



    onChange = async e => {
       await this.setState({
            [e.target.name]: e.target.value
        })

        await this.setState({
            newGanancia: (this.state.newPrecio - (this.state.newPrecio/100)*15)
        })
    }

    onSubmit = async () => {
        

        const productos = [];


        const db = firebaseConfig.firestore();

        await db.collection("ProductosTest").add({
            descripcion: this.state.newDescripcion,
            estado: this.state.newEstado,
            ganancia: this.state.newGanancia,
            imagen: this.state.newImagen,
            precio: this.state.newPrecio,
            producto: this.state.newProducto,
            tienda: this.state.tienda,
            imagen: this.state.newFotoProducto

        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                db.collection("ProductosTest").doc(docRef.id).update({
                    uid: docRef.id

                })



            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

        await db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    productos.push(doc.data());

                });
                this.setState({ productos: productos });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    delete(uid) {
        return () => {
            const productos = [];

            const db = firebaseConfig.firestore();


            db.collection('ProductosTest').doc(uid).delete();



            db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        productos.push(doc.data());

                    });
                    this.setState({ productos: productos });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        }
    }



    exit = e => {

        this.setState({
            tienda: undefined
        })

    }

    onChangeFile = (e) => {

        const { user } = this.context;

        const file = e.target.files[0];

        const storageRef = firebaseConfig.storage().ref();
        const fileRef = storageRef.child('/foto/productos/' + this.state.tienda + '/' + file.name);
        fileRef.put(file).then(() => {
            console.log("Upload a file")
            storageRef.child('/foto/productos/' + this.state.tienda + '/' + file.name).getDownloadURL()
                .then((url) => {

                    this.setState({
                        newFotoProducto: url,
                    });


                });


        })



    }

    sort = e => {
        if (e.target.value == "Nombre") {
            var items = this.state.productos;
            items.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                    print()
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }

        if (e.target.value == "NombreZA") {
            var items = this.state.productos;
            items.sort(function (a, b) {
                if (a.nombre < b.nombre) {
                    return 1;
                    print()
                }
                if (a.nombre > b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }



        this.setState({
            productos: items
        })
  
    }

    search = e => {

        this.setState({
            search: e.target.value
        })

        var lista = this.state.productos 

        function filterItems(query) {
            return lista.filter(function(el) {
                return el.nombre.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
            })
          }
 

          this.setState({
            productos: filterItems(this.state.search)
        })

        if(e.target.value == ""){
            this.setState({
                productos: this.state.productosDefault
            })
        }
}




    render() {
        this.fotoDefault = "https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6"




        if (this.state.tienda == undefined) {
            return (
                <>
                    <Redirect to={{
                        pathname: "/Tiendas",
                        customObject: this.state.tienda,
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
                                    <Link to={{
                                        pathname: "/Tienda",
                                        customObject: this.state.tienda,
                                        hash: "#" + this.state.name,

                                    }} >
                                        <div className="btnNoPress ml-4 mb-3">
                                            <img src={InfoTienda} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Información de la tienda</h6>
                                        </div>
                                    </Link>
                                    <div className="btnNoPress ml-4">
                                        <img src={MedioPago} id="iconoBtn" />
                                        <h6 className='txtBtnNoPress'>Medio de pago</h6>
                                    </div>
                                </div>
                                <div className='row mb-3' ></div>
                                <div className='row'>
                                    <Link to={{
                                        pathname: "/servicios",
                                        customObject: this.state.tienda,
                                        hash: "#" + this.state.name,

                                    }} >
                                        <div className="btnNoPress ml-4 mb-3">
                                            <img src={ServiciosImg} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Servicios</h6>
                                        </div>
                                    </Link>
                                    <div className="btnPress ml-4">
                                        <img src={ProductosImg} id="iconoBtn" />
                                        <h6 className='txtBtnPress'>Productos</h6>
                                    </div>
                                </div>
                            </div>

                            <div className='row mb-5' ></div>


                            <div className='row'>
                                <div className='col-12 col-lg-3 mb-3'>
                                    <h2 className="Categoria-Titulo">Productos</h2>
                                </div>
                                <div className='row searchFilterBox'>


                                    <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text Categoria-Inputprepend' id='basic-addon1'>
                                                <i className='fa fa-search text-muted'></i>
                                            </span>
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control text-muted Categoria-Inputprepend-Input'
                                            placeholder='Buscar'
                                            aria-label='Username'
                                            aria-describedby='basic-addon1'
                                            onChange={this.search}
                                            value={this.state.search}
                                        />
                                    </div>

                                    <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text Categoria-Inputprepend' id='basic-addon1'>
                                                <img src={Icono_Senal} alt='' />
                                            </span>
                                        </div>

                                        <select
                                            name=''
                                            id=''
                                            className='form-control text-muted Categoria-Inputprepend-Input'
                                            placeholder='Buscar'
                                            aria-label='Buscar'
                                            aria-describedby='basic-addon1'
                                            onChange={this.sort}
                                        >
                                            <option value=''>Ordenar por</option>
                                            <option value='Nombre'>Nombre A-Z</option>
                                            <option value='NombreZA'>Nombre Z-A</option>
                                        </select>
                                    </div>


                                    <div >

                                        <button className='btn text-white Categoria-btnMorado mx-1'
                                            data-toggle='modal'
                                            data-target='#FiltrarModal'>
                                            <i className='fa fa-filter mr-2'></i> Filtrar
</button>

                                    </div>


                                    <div >

                                        <button className='btn text-white Categoria-btnMorado'
                                            data-toggle='modal'
                                            data-target='#InvitarModal'>
                                            <i className='fa fa-plus mr-2'></i> Agregar
                        </button>



                                    </div>
                                </div>

                            </div>

                            <div
                                className='modal fade'
                                id='FiltrarModal'

                            >
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                Filtrar
                                            </h4>
                                        </div>

                                        <div className='row text-center'>
                                            <div className='columnBtnGuardarPerfil'>

                                                <button
                                                    className='btn text-white Categoria-btnMorado'
                                                    data-dismiss="modal"
                                                    onClick={this.filter}
                                                >
                                                    Filtrar
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div
                                className='modal fade'
                                id='InvitarModal'

                            >
                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                    <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                        <div className='text-center modal-header border-bottom-0'>
                                            <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                                Agregar Productos
                                            </h4>
                                        </div>
                                        <div className='row mb-3' ></div>
                                        <input type="file" id="file" style={{ display: "none" }}
                                            onChange={(e) => this.onChangeFile(e)} />
                                        <label htmlFor="file" className="divFotoProducto" style={{ backgroundColor: "#6C3EFF" }}>

                                            <img src={this.state.newFotoProducto} id="fotoProducto" />

                                        </label>
                                        <div className='mx-5'>

                                            <h2 className='Categoria-SubTitulo'>Nombre del producto</h2>
                                            <form action="">
                                                <input
                                                    type='text'
                                                    className='form-control text-muted '
                                                    placeholder=''
                                                    onChange={this.onChange}
                                                    name='newProducto'
                                                    value={this.state.newProducto}
                                                />
                                            </form>
                                        </div>
                                        <div className='row mb-3' ></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Descripción del producto</h2>
                                            <form action="">
                                                <input
                                                    type='text'
                                                    className='form-control text-muted '
                                                    placeholder=''
                                                    onChange={this.onChange}
                                                    name='newDescripcion'
                                                    value={this.state.newDescripcion}
                                                />
                                            </form>
                                        </div>
                                        <div className='row mb-3' ></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Precio</h2>
                                            <form action="">
                                                <input
                                                    type='number'
                                                    className='form-control text-muted '
                                                    placeholder=''
                                                    onChange={this.onChange}
                                                    name='newPrecio'
                                                    value={this.state.newPrecio}
                                                />
                                            </form>
                                            <div className='row mb-1' ></div>
                                            <p className="textGanancias">Tu ganancia sería de<b className="ganancias">${this.state.newGanancia}</b></p>

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
                                                    onClick={this.onSubmit}

                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>




                                        <div className='row text-center'>
                                            <div className='columnBtnGuardarPerfil'>


                                            </div>


                                        </div>

                                    </div>
                                </div>
                            </div>


  
                            <div className='row mt-5'>
                                <div className='col-12 table-responsive'>
                                    <table className='table' id='Categoria'>
                                        <thead className='text-left CategoriaTabla-Thead'>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Descripción</th>
                                                <th>Precio</th>
                                                <th>Ganancia</th>
                                                <th>Imagen</th>
                                                <th>Estado</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        {this.state.productos && this.state.productos.length > 0 && this.state.productos.map((producto) => (


                                            <tbody className='text-left CategoriaTabla-Body'>
                                                <tr>
                                                    <td>{producto.producto}</td>
                                                    <td>{producto.descripcion}</td>
                                                    <td>{producto.precio}</td>
                                                    <td>{producto.ganancia}</td>
                                                    <td><img src={producto.imagen} className="imagenProducto" /></td>
                                                    <td className={producto.estado == "Pendiente" ? "servicioPendiente" : ""}>{producto.estado}</td>
                                                    <td ><button onClick={this.delete(producto.uid)}><img src={EliminarServicio} /></button></td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
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

export default (Productos);