import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Equipo/Equipo.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { AuthContext } from '../../firebase/context';
import { Link } from "react-router-dom";
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';



export class Equipo extends Component {



    constructor(props) {


        super(props);

        this.state = {
            tiendas: [],
            equipo: [],
            equipoDefault: [],
            tiendaSelected: "",
            uid: "",
            idInvitado: "",
            search: ""
        };

    }

    componentDidMount = () => {
        const tiendas = [];
        const equipo = [];


        const { user } = this.context;

        this.uidText = user["id"];

        this.setState({
            uid: this.uidText,
        });


        const db = firebaseConfig.firestore();
        //let docRef = db.collection("TiendasTest").doc(user["id"]);
        let docRef = db.collection("TiendasTest").where("uid", "==", user["id"])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tiendas.push(doc.data());

                });
                this.setState({ tiendas: tiendas });
                this.setState({ tiendaSelected: this.state.tiendas[0]["nombre"] })
                let docRefEquipo = db.collection("EmpleadosTest").where("tienda", "==", user["id"] + "-" + this.state.tiendas[0]["nombre"])
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            equipo.push(doc.data());

                        });
                        this.setState({ equipo: equipo,
                            equipoDefault: equipo });
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });


            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });







    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    invite = () => {
        let invitacionArray = [];

        const db = firebaseConfig.firestore();
        let docRef = db.collection("EmpleadosTest").where("id", "==", this.state.idInvitado)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    invitacionArray.push(this.state.tiendaSelected)

                    let uid = doc.data().uid;
                    console.log(invitacionArray)
                    let newUserRef = db.collection("EmpleadosTest").doc("8bQkC6xYuzjU4jUzsKNB");
                    newUserRef.update({
                        "invitaciones": invitacionArray
                    });


                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });



    }

    selectTienda = e => {

        const equipo = [];
        const { user } = this.context;

        this.uidText = user["id"];

        const db = firebaseConfig.firestore();

        let docRefEquipo = db.collection("EmpleadosTest").where("tienda", "==", user["id"] + "-" + e.target.value)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    equipo.push(doc.data());

                });
                this.setState({ equipo: equipo });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });


    }

    sort = e => {
        if (e.target.value == "Nombre") {
            var items = this.state.equipo;
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
            var items = this.state.equipo;
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
            equipo: items
        })
        console.log(this.state.equipo)
    }

    search = e => {

        this.setState({
            search: e.target.value
        })

        var lista = this.state.equipo 

        function filterItems(query) {
            return lista.filter(function(el) {
                return el.nombre.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
            })
          }
          console.log(e.target.value);
          console.log(filterItems(this.state.search));

          this.setState({
            equipo: filterItems(this.state.search)
        })

        if(e.target.value == ""){
            this.setState({
                equipo: this.state.equipoDefault
            })
        }
}




render() {






    return (
        <>

            <div className='container-fluid'>
                <div className='mx-0 mx-md- mx-lg-8'>

                    <div className='row mb-5' ></div>

                    <div className='row'>
                        <div className='col-12 col-lg-3 mb-3'>


                            <select
                                name=''
                                id=''
                                className=' text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'
                                placeholder='Buscar'
                                aria-label='Buscar'
                                aria-describedby='basic-addon1'
                                onChange={this.selectTienda}
                            >

                                {this.state.tiendas.map((tienda) => (
                                    <option value={tienda.nombre}>{tienda.nombre}</option>
                                ))}


                            </select>


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

                                <button className='btn text-white Categoria-btnMorado'
                                    data-toggle='modal'
                                    data-target='#InvitarModal'>
                                    <i className='fa fa-plus mr-2'></i> Invitar
                        </button>

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
                                        Agregar Empleado
                                            </h4>
                                </div>
                                <div className='row mb-3' ></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>ID</h2>
                                    <form action="">
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            onChange={this.onChange}
                                            name='idInvitado'
                                            value={this.state.idInvitado}
                                        />
                                    </form>
                                </div>






                                <div className='row text-center'>
                                    <div className='columnBtnGuardarPerfil'>

                                        <button
                                            className='btn text-white Categoria-btnMorado'
                                            data-dismiss="modal"
                                            onClick={this.invite}
                                        >
                                            Invitar
                                                </button>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='row mb-5' ></div>
                    <div className='row mb-5' ></div>
                    <div className='row mb-3' ></div>
                    <div className='DivHeader'>
                        <div className='Titulo-Equipo'>
                            <h2 className='Categoria-Titulo'>Equipo de trabajo</h2>
                        </div>

                        <div className='row mb-5' ></div>
                        <div className='row mb-5' ></div>



                    </div>


                    <div className='row mb-3' ></div>

                    <div className='Titulo-Equipo'>
                        <h2 className='Categoria-Titulo'>Activos</h2>
                    </div>


                    <div className='DivHeader '>
                        {this.state.equipo && this.state.equipo.length > 0 && this.state.equipo.map(item => (
                            <div className="columnFotoEquipo text-center" style={item.estado == "Activo" ? { display: "initial" } : { display: "none" }}>
                                <Link to={{
                                    pathname: "/empleado",
                                    customObject: item.uid,
                                    hash: "#" + item.nombre,

                                }} >
                                    <div className="divFotoEquipo" style={{ backgroundColor: "#1A1446" }}>
                                        <img src={item.fotoPerfil} id="fotoEquipo" className='text-center' />
                                    </div>
                                    <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>
                                </Link>

                            </div>
                        ))}

                    </div>

                    <div className='Titulo-Equipo'>
                        <h2 className='Categoria-Titulo'>No activos</h2>
                    </div>


                    <div className='DivHeader '>
                        {this.state.equipo && this.state.equipo.length > 0 && this.state.equipo.map(item => (
                            <div className="columnFotoEquipo text-center" style={item.estado == "No Activo" ? { display: "initial" } : { display: "none" }}>
                                <Link to={{
                                    pathname: "/empleado",
                                    customObject: item.uid,
                                    hash: "#" + item.nombre,

                                }} >
                                    <div className="divFotoEquipo" style={{ backgroundColor: "#1A1446" }}>
                                        <img src={item.fotoPerfil} id="fotoEquipoPendiente" className='text-center' />
                                    </div>
                                    <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>
                                </Link>

                            </div>
                        ))}

                    </div>


                    <div className='Titulo-Equipo'>
                        <h2 className='Categoria-Titulo'>Pendientes</h2>
                    </div>


                    <div className='DivHeader '>
                        {this.state.equipo && this.state.equipo.length > 0 && this.state.equipo.map(item => (
                            <div className="columnFotoEquipo text-center" style={item.estado == "Pendientes" ? { display: "initial" } : { display: "none" }}>

                                <div className="divFotoEquipo" style={{ backgroundColor: "#1A1446" }}>
                                    <img src={item.fotoPerfil} id="fotoEquipoPendiente" className='text-center' />
                                </div>
                                <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>


                            </div>
                        ))}

                    </div>


                </div>
            </div>
        </>
    )
        ;
}
}
Equipo.contextType = AuthContext;
export default Equipo;
