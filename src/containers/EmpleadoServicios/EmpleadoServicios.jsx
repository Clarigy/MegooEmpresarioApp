import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/EmpleadoProductos/EmpleadoProductos.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios_press.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import { Link } from "react-router-dom";




export class EmpleadoServicios extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",

            uid: this.props.location.customObject,
            foto: "",
            tienda: "",
            servicios: [],
            checkBoxServicios: [],
        };

    }



    componentDidMount = async () => {
        const servicios = [];

        const db = firebaseConfig.firestore();
        let docRef = await db.collection("EmpleadosTest").doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then(doc => {
            if (doc.exists) {
                if (doc.data()["checkBoxServicios"] != undefined) {
                    this.setState({
                        name: doc.data()["nombre"],
                        foto: doc.data()["fotoPerfil"],
                        tienda: doc.data()["tienda"],
                        checkBoxServicios: doc.data()["checkBoxServicios"]
                    });

                }
                else {
                    this.setState({
                        name: doc.data()["nombre"],
                        foto: doc.data()["fotoPerfil"],
                        tienda: doc.data()["tienda"],
                        checkBoxServicios: []
                    });

                }




                db.collection("ServiciosTest").where("tienda", "==", this.state.tienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            servicios.push(doc.data());
                        });
                        this.setState({
                            servicios: servicios
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
        const checkBoxServicios = this.state.checkBoxServicios

        var old = false

        for (var i = 0; i < checkBoxServicios.length; i++) {
            if (e.target.value == checkBoxServicios[i]) {
                this.old = true
                checkBoxServicios.splice(i, 1);
                console.log(checkBoxServicios)
            } else {
                this.old = false
                
            }
        }

        console.log(this.old)
        //if (!this.old) {
            checkBoxServicios.push(e.target.value)
       // }


        this.setState({
            checkBoxServicios: checkBoxServicios
        })

        this.onSubmit();

        console.log(this.state.checkBoxServicios.length)

    }

    onSubmit = async () => {


        const db = firebaseConfig.firestore();



        await db.collection("EmpleadosTest").doc(this.state.uid).update({
            "checkBoxServicios": this.state.checkBoxServicios,
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

                                <div className='row' style={this.state.checkBoxServicios.length != 0 ? { display: "" } : { display: "none" }}>
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
                                        pathname: "/empleadoServicio",
                                        customObject: this.state.uid,
                                        hash: "#" + this.state.nombre,

                                    }} >
                                        <div className="btnPress ml-4 mb-3">
                                            <img src={Servicios} id="iconoBtn" />
                                            <h6 className='txtBtnPress'>Servicios</h6>
                                        </div>
                                    </Link>
                                </div>
                                <div className='row mb-3' ></div>
                                <div className='row' style={this.state.checkBoxServicios.length != 0 ? { display: "" } : { display: "none" }}>
                                    <Link to={{
                                        pathname: "/empleadoProductos",
                                        customObject: this.state.uid,
                                        hash: "#" + this.state.nombre,

                                    }} >
                                        <div className="btnNoPress ml-4">
                                            <img src={Productos} id="iconoBtn" />
                                            <h6 className='txtBtnNoPress'>Productos</h6>
                                        </div>
                                    </Link>
                                </div>





                                <div className='row' style={this.state.checkBoxServicios.length == 0 ? { display: "" } : { display: "none" }}>

                                    <div className="btnNoPress ml-4 mb-3">
                                        <img src={InfoTienda} id="iconoBtn" />
                                        <h6 className='txtBtnNoPress'>Información de la tienda</h6>
                                    </div>

                                    <div className="btnPress ml-4 mb-3">
                                        <img src={Servicios} id="iconoBtn" />
                                        <h6 className='txtBtnPress'>Servicios</h6>
                                    </div>

                                </div>
                                <div className='row mb-3' ></div>
                                <div className='row' style={this.state.checkBoxServicios.length == 0 ? { display: "" } : { display: "none" }}>

                                    <div className="btnNoPress ml-4">
                                        <img src={Productos} id="iconoBtn" />
                                        <h6 className='txtBtnNoPress'>Productos</h6>
                                    </div>

                                </div>


                            </div>

                            <div className='row mb-5' ></div>

                            <h2 className="Categoria-Titulo">Servicios</h2>
                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>

                            <div className='row'>

                                {this.state.servicios && this.state.servicios.length > 0 && this.state.servicios.map((servicioTitle) => (

                                    <div className='col-12 table-responsive'>
                                        <h1 className="SubTitulo-List">{servicioTitle.categoria}</h1>
                                        <div className='row mb-2' ></div>

                                        {this.state.servicios && this.state.servicios.length > 0 && this.state.servicios.map((servicio) => (


                                            <div style={servicio.categoria == servicioTitle.categoria ? { display: "initial" } : { display: "none" }}>
                                                <div className="columnDatos">
                                                    <h2 className="productosList">{servicio.servicio}</h2>
                                                </div>
                                                <div className="columnDatos text-center">
                                                    <h2 className="productosList">{servicio.precio}</h2>
                                                </div>
                                                <div className="columnDatos text-center">

                                                    <input
                                                        defaultChecked={this.state.checkBoxServicios.some(v => (v === servicio.servicio))}
                                                        name="checkBoxServicios"
                                                        type="checkbox"
                                                        value={servicio.servicio}
                                                        onChange={this.onChange} />
                                                </div>
                                                <br />
                                                <div className='row mb-3' ></div>
                                            </div>

                                        ))}
                                        <div className='row mb-5' ></div>
                                    </div>

                                ))}
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

export default EmpleadoServicios;