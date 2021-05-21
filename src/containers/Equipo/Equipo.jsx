import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Equipo/Equipo.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { AuthContext } from '../../firebase/context';
import { Link } from "react-router-dom";
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';
import NoHayEquipos from "../../assets/images/containers/Equipos/Equipos.png"



export class Equipo extends Component {



    constructor(props) {


        super(props);

        this.state = {
            tiendas: [],
            equipo: [],
            equipoDefault: [],
            equipoActivo: [],
            equipoNoActivo: [],
            equipoPendiente: [],
            idEmpleado: "",
            tiendaSelected: "",
            uid: "",
            search: "",
            loading: true,
            isEmpty: "",
            pendienteIsEmpty: "",
            activoIsEmpty:"",
            noActivosIsEmpty:"",
            nombreInvitado:"",
            FotoInvitado:"",
            
            idInvitado: "",
            tiendaInvitado:"",
            idTienda:""
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
                loading: false
            })
           }, 1000);
        const equipo = [];
        const tiendas = [];
        const equipoActivos = [];
        const equipoNoActivos = [];
        const equipoPendientes = [];


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

                            if(doc.data().estado == "Activo"){
                                equipoActivos.push(doc.data());
                            }
                            if(doc.data().estado == "No Activo"){
                                equipoNoActivos.push(doc.data());
                            }
                            if(doc.data().estado == "Pendiente"){
                                equipoPendientes.push(doc.data());
                            }
                            // doc.data() is never undefined for query doc snapshots
                            equipo.push(doc.data());

                        });
                        const { user } = this.context;
                        const tienda =  user["id"] + "-" + this.state.tiendaSelected
                        console.log("TIENDAAAAA",tienda)
                        this.setState({ equipo: equipo,
                            equipoDefault: equipo,
                            equipoActivo: equipoActivos,
                            equipoNoActivo: equipoNoActivos,
                            equipoPendiente: equipoPendientes,
                            idTienda:tienda
                       });
                       if (this.state.equipo.length > 0){
                        this.setState({
                            isEmpty: false
                        });
                        console.log("aquiiiiiiiiiiiii")
                    } else {
                        this.setState({
                            isEmpty: true
                        });
                        console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                    }
                    if (this.state.equipoNoActivo.length > 0){
                        this.setState({   
                            activoIsEmpty: false
                        });
                        console.log("aquiiiiiiiiiiiii")
                    } else {
                        this.setState({
                            activoIsEmpty: true
                        });
                        console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                    }
                    if (this.state.equipoNoActivo.length > 0){
                        this.setState({
                            noActivosIsEmpty:false,
                        });
                        console.log("aquiiiiiiiiiiiii")
                    } else {
                        this.setState({
                            noActivosIsEmpty: true
                        });
                        console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                    }
                    if (this.state.equipoPendiente.length > 0){
                        this.setState({
                            pendienteIsEmpty:false
                        });
                        console.log("aquiiiiiiiiiiiii")
                    } else {
                        this.setState({
                            pendienteIsEmpty: true
                        });
                        console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                    }
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });


            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });


            if(this.state.activoIsEmpty){
                $('#Activos').removeClass('fade active show');
                console.log("TRUE", this.state.activoIsEmpty)
            } else{
                $('#Activos').addClass('fade active show'); //por default se activa
                console.log("FALSE", this.state.activoIsEmpty)
            }

            



    }

    

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    invite = () => {
        let invitacionArray = [];
        

        const db = firebaseConfig.firestore();
        /*let newUserRef = db.collection("EmpleadosTest").where("id", "==", this.state.idInvitado);
        newUserRef.collection("invitaciones").add({
            "tienda": this.state.uid,
            "estado": "Pendiente"
        });*/
        console.log(this.state.idInvitado)
        let docRef = db.collection("TiendasTest2").where("cedula", "==", this.state.idInvitado)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    this.setState({
                        nombreInvitado:doc.data()["nombre"],
                        FotoInvitado:doc.data()["fotoProveedor"],
                        idInvitado: doc.data()["cedula"],
                        idEmpleado: doc.data()["uid"]
                    });

                    let uid = doc.data().uid;
                    let collectionRef = db.collection("TiendasTest2").doc(uid);
                    console.log(collectionRef)
                    console.log(uid)
                    collectionRef.collection("invitaciones").add({
                        tienda: this.state.idTienda,
                        estado: "Pendiente"
                    })/*.then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        db.collection("EmpleadosTest").doc(uid).collection("invitaciones").doc(docRef.id).update({
                            uid: docRef.id
            
                        })
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });*/


                });
                db.collection("EmpleadosTest").doc(this.state.idEmpleado).set({
                    estado: "Pendiente",
                    nombre: this.state.nombreInvitado,
                    fotoPerfil: this.state.FotoInvitado,
                    id: this.state.idInvitado,
                    tienda: this.state.idTienda,
                    uid: this.state.idEmpleado
                })/*.then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    db.collection("EmpleadosTest").doc(docRef.id).update({
                        uid: docRef.id
        
                    })
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });*/
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

         
            


            /*let docRef = db.collection("EmpleadosTest").where("id", "==", this.state.idInvitado)
            .set({
                "Tienda": this.state.Tienda,
            "estado":"Pendiente",

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });*/



    }

    selectTienda = e => {

        const equipo = [];
        const equipoActivos = [];
        const equipoNoActivos = [];
        const equipoPendientes = [];

        const { user } = this.context;

        this.uidText = user["id"];

        const db = firebaseConfig.firestore();

        let docRefEquipo = db.collection("EmpleadosTest").where("tienda", "==", user["id"] + "-" + e.target.value)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().estado == "Activo"){
                        equipoActivos.push(doc.data());
                    }
                    if(doc.data().estado == "No Activo"){
                        equipoNoActivos.push(doc.data());
                    }
                    if(doc.data().estado == "Pendiente"){
                        equipoPendientes.push(doc.data());
                    }
                    // doc.data() is never undefined for query doc snapshots
                    equipo.push(doc.data());

                });
                this.setState({ equipo: equipo,
                     equipoActivo: equipoActivos,
                    equipoNoActivo: equipoNoActivos,
                    equipoPendiente: equipoPendientes});
                if (this.state.equipo.length > 0){
                    this.setState({
                        isEmpty: false
                    });
                    console.log("aquiiiiiiiiiiiii")
                } else {
                    this.setState({
                        isEmpty: true
                    });
                    console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                }
                if (this.state.equipoNoActivo.length > 0){
                    this.setState({   
                        activoIsEmpty: false
                    });
                    console.log("aquiiiiiiiiiiiii")
                } else {
                    this.setState({
                        activoIsEmpty: true
                    });
                    console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                }
                if (this.state.equipoNoActivo.length > 0){
                    this.setState({
                        noActivosIsEmpty:false,
                    });
                    console.log("aquiiiiiiiiiiiii")
                } else {
                    this.setState({
                        noActivosIsEmpty: true
                    });
                    console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                }
                if (this.state.equipoPendiente.length > 0){
                    this.setState({
                        pendienteIsEmpty:false
                    });
                    console.log("aquiiiiiiiiiiiii")
                } else {
                    this.setState({
                        pendienteIsEmpty: true
                    });
                    console.log("aquiiiiiiiiiiiii NOOOOOOOOOOO")
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

            if (equipo){
                this.setState({  
                    isEmpty: false
               });
            } else {
                this.setState({  
                    isEmpty: true
               });
            }

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



    const { loading } = this.state;


    return (
        <>
            <GifLoader
                    loading={loading}
                    imageSrc={loadingImage}
                    overlayBackground="rgba(219,219,219, .8)"
            />
            <div className='container-fluid'>
                <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>

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
                        <div className="col colFiltrosContainer">
                            <div className="row filtrosContainer">
                                <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text Search-Inputprepend' id='basic-addon1'>
                                            <i className='fa fa-search text-muted'></i>
                                        </span>
                                    </div>
                                    <input
                                        type='text'
                                        className='form-control text-muted Search-Inputprepend-Input'
                                        placeholder='Buscar'
                                        aria-label='Username'
                                        aria-describedby='basic-addon1'
                                        onChange={this.search}
                                        value={this.state.search}
                                    />
                                </div>

                                <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text Search-Inputprepend' id='basic-addon1'>
                                            <img src={Icono_Senal} alt='' />
                                        </span>
                                    </div>

                                    <select
                                        name=''
                                        id=''
                                        className='form-control text-muted Search-Inputprepend-Input'
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
                    
                    <div className='DivHeader'>
                        <div className='Titulo-Equipo'>
                            <h2 className='Categoria-Titulo'>Equipo de trabajo</h2>
                        </div>

                        <div className='row mb-5' ></div>
                        <div className='row mb-5' ></div>
                    </div>

                    <div>
                        {this.state.isEmpty ? (
                            <div className="columnNoTiendas">
                                <img className="notTiendas" src={NoHayEquipos} />

                            </div>
                        ):(
    
                            <div>
                                {this.state.activoIsEmpty ? (<div></div>):(
                                    <div>
                                        <div className='Titulo-Equipo' >
                                            <h2 className='Categoria-Titulo'>Activos</h2>
                                        </div>
                                        <div className='DivHeader '>
                                            {this.state.equipoActivo && this.state.equipoActivo.length > 0 && this.state.equipoActivo.map(item => (
                                                <div className="columnFotoEquipo text-center">
                                                    <Link to={{
                                                        pathname: "/NewEmpleado",
                                                        customObjectTienda: this.state.idTienda,
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
                                </div>
                                )}

                                {this.state.noActivosIsEmpty ? (<div></div>):(
                                    <div>
                                        <div className='Titulo-Equipo'>
                                            <h2 className='Categoria-Titulo'>No activos</h2>
                                        </div>


                                        <div className='DivHeader '>
                                            {this.state.equipoNoActivo && this.state.equipoNoActivo.length > 0 && this.state.equipoNoActivo.map(item => (
                                                <div className="columnFotoEquipo text-center">
                                                    <Link to={{
                                                        pathname: "/NewEmpleado",
                                                        customObjectTienda: this.state.idTienda,
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
                                    </div>
                                )}

            
                                {this.state.pendienteIsEmpty ? (<div></div>):(
                                    <div>
                                         <div className='Titulo-Equipo'>
                                            <h2 className='Categoria-Titulo'>Pendientes</h2>
                                        </div>
                                        <div className='DivHeader '>
                                            {this.state.equipoPendiente && this.state.equipoPendiente.length > 0 && this.state.equipoPendiente.map(item => (
                                                <div className="columnFotoEquipo text-center" >

                                                    <div className="divFotoEquipo" style={{ backgroundColor: "#1A1446" }}>
                                                        <img src={item.fotoPerfil} id="fotoEquipoPendiente" className='text-center'/>
                                                    </div>
                                                    <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>


                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}  

                            </div>
                       )}
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
