import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Servicios/Servicios.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import MedioPago from '../../assets/images/components/Iconos/icono_medio_de_pago.svg';
import ServiciosImg from '../../assets/images/components/Iconos/icono_servicios_press.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos.svg';
import EliminarServicio from '../../assets/images/components/Iconos/icono_eliminar_servicio.svg';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import { Link } from "react-router-dom";

export class Servicios extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",
            foto: "",
            servicios: [],
            newCategoria: "",
            newGanancia: 0,
            newGenero: "",
            newPrecio: 0,
            newServicio: "",
            otro: "",
            newTipoServicio: "",
            tienda: this.props.uid,
            newEstado: "Pendiente",
            search: "",
            serviciosDefault: []
        };

    }



    componentDidMount = () => {


        const servicios = [];
        const db = firebaseConfig.firestore();

        db.collection("TiendasTest").doc(this.state.tienda).get().then(doc => {
            if (doc.exists) {
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["foto"],
                });
                console.log(doc.data()["foto"])
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });


        db.collection("ServiciosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    servicios.push(doc.data());

                });
                this.setState({ servicios: servicios, serviciosDefault: servicios });
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

        const servicios = [];


        const db = firebaseConfig.firestore();

        await db.collection("ServiciosTest").add({
            categoria: this.state.newCategoria,
            estado: this.state.newEstado,
            ganancia: this.state.newGanancia,
            genero: this.state.newGenero,
            precio: this.state.newPrecio,
            servicio: this.state.newServicio,
            tienda: this.state.tienda,
            tipoServicio: this.state.newTipoServicio,
            otro: this.state.otro,

        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                db.collection("ServiciosTest").doc(docRef.id).update({
                    uid: docRef.id

                })



            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

        await db.collection("ServiciosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    servicios.push(doc.data());

                });
                this.setState({ servicios: servicios });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    delete(uid) {
        return () => {
            const servicios = [];

            const db = firebaseConfig.firestore();


            db.collection('ServiciosTest').doc(uid).delete();



            db.collection("ServiciosTest").where("tienda", "==", this.state.tienda)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        servicios.push(doc.data());

                    });
                    this.setState({ servicios: servicios });
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

    sort = e => {
        if (e.target.value == "Nombre") {
            var items = this.state.servicios;
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
            var items = this.state.servicios;
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
            servicios: items
        })
        console.log(this.state.servicios)
    }

    search = e => {

        this.setState({
            search: e.target.value
        })

        var lista = this.state.servicios 

        function filterItems(query) {
            return lista.filter(function(el) {
                return el.servicio.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
            })
          }
          console.log(e.target.value);
          console.log(filterItems(this.state.search));

          this.setState({
            servicios: filterItems(this.state.search)
        })

        if(e.target.value == ""){
            this.setState({
                servicios: this.state.serviciosDefault
            })
        }
}




    render() {
        this.fotoDefault = "https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6"

        console.log(this.state.servicios)

            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5'>
                          

                            <div className='row mb-5' ></div>


                            <div className='row'>
                                <div className='col-12 col-lg-3 mb-3'>
                                    <h2 className="Categoria-Titulo">Servicios</h2>
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
                                                Agregar Servicio
                                            </h4>
                                        </div>
                                        <div className='row mb-3' ></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Categoria</h2>
                                            <select
                                                name='newCategoria'
                                                id=''
                                                className='form-control text-muted'
                                                aria-label='Buscar'
                                                onChange={this.onChange}
                                                value={this.state.newCategoria}
                                            >
                                                <option value=''></option>
                                                <option value='Cabello'>Cabello</option>
                                                <option value='Manos'>Manos</option>
                                                <option value='Maquillaje'>Maquillaje</option>

                                            </select>
                                        </div>
                                        <div className='row mb-3'></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Servicio</h2>
                                            <select
                                                name='newServicio'
                                                id=''
                                                className='form-control text-muted'
                                                aria-label='Buscar'
                                                onChange={this.onChange}
                                                value={this.state.newServicio}
                                            >
                                                <option value=''></option>
                                                <option value='Corte de Cabello'>Corte de Cabello</option>
                                                <option value='Uñas Acrílicas'>Uñas Acrílicas</option>
                                                <option value='Tinte de Cabello'>Tinte de Cabello</option>
                                                <option value='Maquillaje Social'>Maquillaje Social</option>
                                                <option value='Otro'>Otro</option>

                                            </select>
                                        </div>
                                        <div className='row mb-3' ></div>
                                        <div className='mx-5' style={this.state.newServicio == "Otro" ? { display: "initial" } : { display: "none" }}>
                                            <h2 className='Categoria-SubTitulo'>Otro</h2>
                                            <form action="">
                                                <input
                                                    type='text'
                                                    className='form-control text-muted '
                                                    placeholder=''
                                                    onChange={this.onChange}
                                                    name='otro'
                                                    value={this.state.otro}
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

                                        <div className='row mb-3' ></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Género</h2>
                                            <select
                                                name='newGenero'
                                                id=''
                                                className='form-control text-muted'
                                                aria-label='Buscar'
                                                onChange={this.onChange}
                                                value={this.state.newGenero}
                                            >
                                                <option value=''></option>
                                                <option value='Ambos'>Ambos</option>
                                                <option value='M'>M</option>
                                                <option value='F'>F</option>

                                            </select>
                                        </div>

                                        <div className='row mb-3' ></div>
                                        <div className='mx-5'>
                                            <h2 className='Categoria-SubTitulo'>Tipo de servicio</h2>
                                            <select
                                                name='newTipoServicio'
                                                id=''
                                                className='form-control text-muted'
                                                aria-label='Buscar'
                                                onChange={this.onChange}
                                                value={this.state.newTipoServicio}
                                            >
                                                <option value=''></option>
                                                <option value='A domicilio'>A domicilio</option>
                                                <option value='En local'>En local</option>
                                                <option value='Ambos'>Ambos</option>

                                            </select>
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


                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>

                            <div className='row mt-5'>
                                <div className='col-12 table-responsive'>
                                    <table className='table' id='Categoria'>
                                        <thead className='text-left CategoriaTabla-Thead'>
                                            <tr>
                                                <th>Categoria</th>
                                                <th>Servicio</th>
                                                <th>Precio</th>
                                                <th>Ganancia</th>
                                                <th>Género</th>
                                                <th>Tipo de servicio</th>
                                                <th>Estado</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        {this.state.servicios && this.state.servicios.length > 0 && this.state.servicios.map((servicio) => (


                                            <tbody className='text-left CategoriaTabla-Body'>
                                                <tr>
                                                    <td>{servicio.categoria}</td>
                                                    <td style={servicio.servicio == "Otro" ? { display: "" } : { display: "none" }}>{servicio.otro}</td>
                                                    <td style={servicio.servicio != "Otro" ? { display: "" } : { display: "none" }}>{servicio.servicio}</td>
                                                    <td>{servicio.precio}</td>
                                                    <td>{servicio.ganancia}</td>
                                                    <td>{servicio.genero}</td>
                                                    <td>{servicio.tipoServicio}</td>
                                                    <td className={servicio.estado == "Pendiente" ? "servicioPendiente" : ""}>{servicio.estado}</td>
                                                    <td ><button onClick={this.delete(servicio.uid)}><img src={EliminarServicio} /></button></td>
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


export default (Servicios);