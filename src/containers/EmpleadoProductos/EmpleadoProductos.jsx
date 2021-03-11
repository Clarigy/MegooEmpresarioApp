import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/EmpleadoProductos/EmpleadoProductos.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos_press.svg';
import { Link } from "react-router-dom";




export class EmpleadoProductos extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",

            uid: this.props.location.customObject,
            foto: "",
            tienda: "",
            productos: [],
            checkbox: [],
        };

    }



    componentDidMount = async () => {
        const productos = [];

        const db = firebaseConfig.firestore();
        let docRef = await db.collection("EmpleadosTest").doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then(doc => {
            if (doc.exists) {
                if(doc.data()["checkBox"] != undefined){
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["fotoPerfil"],
                    tienda: doc.data()["tienda"],
                    checkbox: doc.data()["checkBox"]
                });

            }
            else{
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["fotoPerfil"],
                    tienda: doc.data()["tienda"],
                    checkbox: []
                });

            }


                db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
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
                        console.log("Error getting documents: ", error);
                    });



            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });






    }


    onChange = e => {
        const checkbox = this.state.checkbox

        var old = false

        for (var i = 0; i < checkbox.length; i++) {
            if (e.target.value == checkbox[i]) {
                this.old = true
                checkbox.splice(i, 1);
            } else {
                this.old = false
            }
        }
        if (!this.old) {
            checkbox.push(e.target.value)
        }


        this.setState({
            checkbox: checkbox
        })

        this.onSubmit();

    }

    onSubmit = async () => {


        const db = firebaseConfig.firestore();



        await db.collection("EmpleadosTest").doc(this.state.uid).update({
            "checkBox": this.state.checkbox,
        });




    }


    exit = e => {

        this.setState({
            uid: undefined
        })

    }






    render() {






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
                                        pathname: "/empleado",
                                        customObject: this.state.uid,
                                        hash: "#" + this.state.nombre,

                                    }} >
                                        <div className="btnNoPress ml-4 mb-3">
                                            <img src={InfoTienda} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Información de la tienda</h6>
                                        </div>
                                    </Link>
                                    <Link to={{
                                        pathname: "/empleadoServicios",
                                        customObject: this.state.uid,
                                        hash: "#" + this.state.nombre,

                                    }} >
                                        <div className="btnNoPress ml-4 mb-3">
                                            <img src={Servicios} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Servicios</h6>
                                        </div>
                                    </Link>

                                </div>
                                <div className='row mb-3' ></div>
                                <div className='row'>
                                    <Link to={{
                                        pathname: "/empleadoProductos",
                                        customObject: this.state.uid,
                                        hash: "#" + this.state.nombre,

                                    }} >
                                        <div className="btnPress ml-4">
                                            <img src={Productos} id="iconoBtn" />
                                            <h6 className='txtBtnPress'>Productos</h6>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className='row mb-5' ></div>

                            <h2 className="Categoria-Titulo">Productos</h2>
                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>

                            <div className='row'>
                                <div className='col-12 table-responsive'>


                                    {this.state.productos && this.state.productos.length > 0 && this.state.productos.map((producto) => (


                                        <div>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.producto}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.precio}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                                <div className="datos">
                                                <input
                                                    defaultChecked={this.state.checkbox.some(v => (v === producto.producto))}
                                                    name="checkbox"
                                                    type="checkbox"
                                                    value={producto.producto}
                                                    onChange={this.onChange} />
                                            </div>
                                            </div>
                                            <br />
                                            <div className='row mb-3' ></div>
                                        </div>

                                    ))}

                                </div>
                                <div className='row mb-5' ></div>










                            </div>




                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>




                        </div>
                    </div>
                </>
            )
        }
        ;
    }
}

export default EmpleadoProductos;