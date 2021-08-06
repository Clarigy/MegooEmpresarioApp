import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Equipo/Equipo.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { AuthContext } from '../../firebase/context';
import { Link } from 'react-router-dom';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';
import NoHayEquipos from '../../assets/images/containers/Equipos/Equipos.png';

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
            idEmpleado: '',
            tiendaSelected: '',
            uid: '',
            search: '',
            loading: true,
            isEmpty: '',
            pendienteIsEmpty: '',
            activoIsEmpty: '',
            noActivosIsEmpty: '',
            nombreInvitado: '',
            FotoInvitado: '',

            idInvitado: '',
            tiendaInvitado: '',
            idTienda: ''
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
            });
        }, 1000);
        const equipo = [];
        const tiendas = [];
        const equipoActivos = [];
        const equipoNoActivos = [];
        const equipoPendientes = [];

        const { user } = this.context;

        this.uidText = user['id'];

        this.setState({
            uid: this.uidText
        });

        const db = firebaseConfig.firestore();
        //let docRef = db.collection("TiendasTest").doc(user["id"]);
        let docRef = db
            .collection('Tiendas')
            .where('uidProveedor', '==', user['id'])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tiendas.push(doc.data());
                });
                this.setState({ tiendas: tiendas });
                this.setState({
                    tiendaSelected: this.state.tiendas[0]['nombre'],
                    idTienda: this.state.tiendas[0]['uid']
                });
                let collectionRef = db.collection('Tiendas').doc(this.state.idTienda);
                collectionRef
                    .collection('empleados')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.data().estado == 'Activo') {
                                equipoActivos.push(doc.data());
                            }
                            if (doc.data().estado == 'No Activo') {
                                equipoNoActivos.push(doc.data());
                            }
                            if (doc.data().estado == 'Pendiente') {
                                equipoPendientes.push(doc.data());
                            }
                            // doc.data() is never undefined for query doc snapshots
                            equipo.push(doc.data());
                        });
                        const { user } = this.context;
                        const tienda = user['id'] + '-' + this.state.tiendaSelected;

                        this.setState({
                            equipo: equipo,
                            equipoActivo: equipoActivos,
                            equipoNoActivo: equipoNoActivos,
                            equipoPendiente: equipoPendientes,
                            idTienda: tienda
                        });
                        if (this.state.equipo.length > 0) {
                            this.setState({
                                isEmpty: false
                            });
                        } else {
                            this.setState({
                                isEmpty: true
                            });
                        }
                        if (this.state.equipoActivo.length > 0) {
                            this.setState({
                                activoIsEmpty: false
                            });
                        } else {
                            this.setState({
                                activoIsEmpty: true
                            });
                        }
                        if (this.state.equipoNoActivo.length > 0) {
                            this.setState({
                                noActivosIsEmpty: false
                            });
                        } else {
                            this.setState({
                                noActivosIsEmpty: true
                            });
                        }
                        if (this.state.equipoPendiente.length > 0) {
                            this.setState({
                                pendienteIsEmpty: false
                            });
                        } else {
                            this.setState({
                                pendienteIsEmpty: true
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log('Error getting documents: ', error);
                    });
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });

        /*if(this.state.activoIsEmpty){
                $('#Activos').removeClass('fade active show');
         
            } else{
                $('#Activos').addClass('fade active show'); //por default se activa
            
            }*/
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    invite = () => {
        let invitacionArray = [];

        const db = firebaseConfig.firestore();
        /*let newUserRef = db.collection("EmpleadosTest").where("id", "==", this.state.idInvitado);
        newUserRef.collection("invitaciones").add({
            "tienda": this.state.uid,
            "estado": "Pendiente"
        });*/
        let color = ['6c3eff', 'FF3B7B', '00d4d8', '1a1446'];
        let randomNumber = Math.floor(Math.random() * color.length);

        let docRef = db
            .collection('Tiendas')
            .where('cedula', '==', this.state.idInvitado)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.setState({
                        nombreInvitado: doc.data()['nombre'],
                        FotoInvitado: doc.data()['fotoProveedor'],
                        idInvitado: doc.data()['cedula'],
                        idEmpleado: doc.data()['uid']
                    });

                    let uid = doc.data().uid;
                    let collectionRef = db.collection('Tiendas').doc(uid);

                    collectionRef.collection('invitaciones').add({
                        tienda: this.state.idTienda,
                        estado: 'Pendiente'
                    });

                    collectionRef.collection('notificaciones').add({
                        mensaje: 'Esta Tienda quiere que seas parte de su equipo',
                        tienda: this.state.idTienda,
                        estado: 'Activa'
                    }); /*.then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        db.collection("EmpleadosTest").doc(uid).collection("invitaciones").doc(docRef.id).update({
                            uid: docRef.id
            
                        })
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });*/
                });
                let collectionRef = db.collection('Tiendas').doc(this.state.idTienda);
                collectionRef
                    .collection('empleados')
                    .add({
                        estado: 'Pendiente',
                        nombre: this.state.nombreInvitado,
                        fotoPerfil: this.state.FotoInvitado,
                        id: this.state.idInvitado,
                        tienda: this.state.idTienda,
                        uidEmpleado: this.state.idEmpleado,
                        color: color[randomNumber]
                    })
                    .then(function (docRef) {
                        collectionRef.collection('empleados').doc(docRef.id).update({
                            uid: docRef.id
                        });
                        console.log('Document written with ID: ', docRef.id);
                    })
                    .catch(function (error) {
                        console.error('Error adding document: ', error);
                    });

            })

            
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });

        this.fetchInfo();
        /*let docRef = db.collection("EmpleadosTest").where("id", "==", this.state.idInvitado)
            .set({
                "Tienda": this.state.Tienda,
            "estado":"Pendiente",

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });*/
    };

    fetchInfo() {
        const equipo = [];
        const equipoActivos = [];
        const equipoNoActivos = [];
        const equipoPendientes = [];

        const { user } = this.context;

        this.uidText = user['id'];

        const db = firebaseConfig.firestore();

        let collectionRef = db.collection('Tiendas').doc(this.state.idTienda);
        collectionRef
            .collection('empleados')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().estado == 'Activo') {
                        equipoActivos.push(doc.data());
                    }
                    if (doc.data().estado == 'No Activo') {
                        equipoNoActivos.push(doc.data());
                    }
                    if (doc.data().estado == 'Pendiente') {
                        equipoPendientes.push(doc.data());
                    }
                    // doc.data() is never undefined for query doc snapshots
                    equipo.push(doc.data());
                });
                this.setState({
                    equipo: equipo,
                    equipoActivo: equipoActivos,
                    equipoNoActivo: equipoNoActivos,
                    equipoPendiente: equipoPendientes
                });
                if (this.state.equipo.length > 0) {
                    this.setState({
                        isEmpty: false
                    });
                } else {
                    this.setState({
                        isEmpty: true
                    });
                }
                if (this.state.equipoActivo.length > 0) {
                    this.setState({
                        activoIsEmpty: false
                    });
                } else {
                    this.setState({
                        activoIsEmpty: true
                    });
                }
                if (this.state.equipoNoActivo.length > 0) {
                    this.setState({
                        noActivosIsEmpty: false
                    });
                } else {
                    this.setState({
                        noActivosIsEmpty: true
                    });
                }
                if (this.state.equipoPendiente.length > 0) {
                    this.setState({
                        pendienteIsEmpty: false
                    });
                } else {
                    this.setState({
                        pendienteIsEmpty: true
                    });
                }
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });

        if (equipo) {
            this.setState({
                isEmpty: false
            });
        } else {
            this.setState({
                isEmpty: true
            });
        }
    }

    selectTienda = (e) => {
        let tiendaSelect = this.state.tiendas.find((tienda) => tienda.nombre === e.target.value);
        let uid = tiendaSelect.uid;
        this.setState({ idTienda: uid }, () => {});
        this.setState({ tiendaSelected: e.target.value }, () => {
            this.fetchInfo();
        });
    };

    sort = (e) => {
        if (e.target.value == 'Nombre') {
            var items = this.state.equipoActivo;
            items.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            var items2 = this.state.equipoNoActivo;
            items2.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            var items3 = this.state.equipoPendiente;
            items3.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }

        if (e.target.value == 'NombreZA') {
            var items = this.state.equipoActivo;
            items.sort(function (a, b) {
                if (a.nombre < b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre > b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            var items2 = this.state.equipoNoActivo;
            items2.sort(function (a, b) {
                if (a.nombre < b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre > b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            var items3 = this.state.equipoPendiente;
            items3.sort(function (a, b) {
                if (a.nombre < b.nombre) {
                    return 1;
                    print();
                }
                if (a.nombre > b.nombre) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }

        this.setState({
            equipoActivo: items,
            equipoNoActivo: items2,
            equipoPendiente: items3
        });
    };

    search = (e) => {
        this.setState({
            search: e.target.value
        });

        let equipoActivos = this.state.equipoActivo;
        let equipoNoActivos = this.state.equipoNoActivo;
        let equipoPendientes = this.state.equipoPendiente;

        var lista = this.state.equipo;

        /*function filterItems(query) {
            return lista.filter(function(el) {
                return el.nombre.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
            })
          }
  

          this.setState({
            equipo: filterItems(this.state.search)
        })*/

        equipoActivos = equipoActivos.filter((friend) => {
            return friend.nombre.toString().toUpperCase().includes(e.target.value.toString().toUpperCase());
        });

        equipoNoActivos = equipoNoActivos.filter((friend) => {
            return friend.nombre.toString().toUpperCase().includes(e.target.value.toString().toUpperCase());
        });

        equipoPendientes = equipoPendientes.filter((friend) => {
            return friend.nombre.toString().toUpperCase().includes(e.target.value.toString().toUpperCase());
        });

        this.setState({
            equipoActivo: equipoActivos,
            equipoNoActivo: equipoNoActivos,
            equipoPendiente: equipoPendientes
        });

        if (e.target.value == '') {
            this.fetchInfo();
        }
    };

    render() {
        const { loading } = this.state;

        return (
            <>
                <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>
                        <div className='col'>
                            <div className='row mb-5'></div>
                            <div className='row headerContainer'>
                                <div className='col-lg-3 col-sm-16 mb-sm-2 p-0 align-self-center '>
                                    <select
                                        name=''
                                        id=''
                                        className=' btn text-white mx-1 Categoria-btnMorado btnFull'
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
                                <div className='col-lg-9 col-xs-16 colFiltrosContainer'>
                                    <div className='row filtrosContainer'>
                                        <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                            <div className='input-group-prepend'>
                                                <span
                                                    className='input-group-text Search-Inputprepend'
                                                    id='basic-addon1'
                                                >
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
                                                <span
                                                    className='input-group-text Search-Inputprepend'
                                                    id='basic-addon1'
                                                >
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
                                                <option value=''>Ordenar</option>
                                                <option value='Nombre'>Nombre A-Z</option>
                                                <option value='NombreZA'>Nombre Z-A</option>
                                            </select>
                                        </div>

                                        <div>
                                            <button
                                                className='btn text-white Categoria-btnMorado btnFull'
                                                data-toggle='modal'
                                                data-target='#InvitarModal'
                                            >
                                                <i className='fa fa-plus mr-2'></i> Invitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row mb-5'></div>

                            <div className='DivHeader'>
                                <div className='Titulo-Equipo'>
                                    <h2 className='Categoria-Titulo'>Equipo de trabajo</h2>
                                </div>

                                <div className='row mb-5'></div>
                            </div>

                            <div>
                                {this.state.isEmpty ? (
                                    <div className='columnNoTiendas'>
                                        <img className='notTiendas' src={NoHayEquipos} />
                                    </div>
                                ) : (
                                    <div>
                                        {this.state.activoIsEmpty ? (
                                            <div></div>
                                        ) : (
                                            <div>
                                                <div className='Titulo-Equipo'>
                                                    <h2 className='Categoria-Titulo'>Activos</h2>
                                                </div>
                                                <div className='DivHeader '>
                                                    {this.state.equipoActivo &&
                                                        this.state.equipoActivo.length > 0 &&
                                                        this.state.equipoActivo.map((item) => (
                                                            <div className='text-center'>
                                                                <Link
                                                                    to={{
                                                                        pathname: '/NewEmpleado',
                                                                        customObjectTienda: this.state.idTienda,
                                                                        customObject: item.uidEmpleado,
                                                                        customObjectUid: item.uid,
                                                                        hash: '#' + item.nombre
                                                                    }}
                                                                    className='columnFotoEquipo'
                                                                >
                                                                    <div
                                                                        className='divFotoEquipo'
                                                                        style={{ backgroundColor: '#1A1446' }}
                                                                    >
                                                                        <img
                                                                            src={item.fotoPerfil}
                                                                            id='fotoEquipo'
                                                                            className='text-center'
                                                                        />
                                                                    </div>
                                                                    <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>
                                                                        {item.nombre}
                                                                    </h2>
                                                                </Link>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {this.state.noActivosIsEmpty ? (
                                            <div></div>
                                        ) : (
                                            <div>
                                                <div className='Titulo-Equipo'>
                                                    <h2 className='Categoria-Titulo'>No activos</h2>
                                                </div>

                                                <div className='DivHeader '>
                                                    {this.state.equipoNoActivo &&
                                                        this.state.equipoNoActivo.length > 0 &&
                                                        this.state.equipoNoActivo.map((item) => (
                                                            <div className='text-center'>
                                                                <Link
                                                                    to={{
                                                                        pathname: '/NewEmpleado',
                                                                        customObjectTienda: this.state.idTienda,
                                                                        customObject: item.uidEmpleado,
                                                                        hash: '#' + item.nombre
                                                                    }}
                                                                    className='columnFotoEquipo'
                                                                >
                                                                    <div
                                                                        className='divFotoEquipo'
                                                                        style={{ backgroundColor: '#1A1446' }}
                                                                    >
                                                                        <img
                                                                            src={item.fotoPerfil}
                                                                            id='fotoEquipoPendiente'
                                                                            className='text-center'
                                                                        />
                                                                    </div>
                                                                    <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>
                                                                        {item.nombre}
                                                                    </h2>
                                                                </Link>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {this.state.pendienteIsEmpty ? (
                                            <div></div>
                                        ) : (
                                            <div>
                                                <div className='Titulo-Equipo'>
                                                    <h2 className='Categoria-Titulo'>Pendientes</h2>
                                                </div>
                                                <div className='DivHeader '>
                                                    {this.state.equipoPendiente &&
                                                        this.state.equipoPendiente.length > 0 &&
                                                        this.state.equipoPendiente.map((item) => (
                                                            <div className='columnFotoEquipo text-center'>
                                                                <div
                                                                    className='divFotoEquipo '
                                                                    style={{ backgroundColor: '#1A1446' }}
                                                                >
                                                                    <img
                                                                        src={item.fotoPerfil}
                                                                        id='fotoEquipoPendiente'
                                                                        className='text-center'
                                                                    />
                                                                </div>
                                                                <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>
                                                                    {item.nombre}
                                                                </h2>
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
                    <div className='modal fade' id='InvitarModal'>
                        <div className='modal-dialog modal-dialog-centered' role='document'>
                            <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                <div className='text-center modal-header border-bottom-0'>
                                    <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                        Agregar Empleado
                                    </h4>
                                </div>
                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>ID</h2>
                                    <form action=''>
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
                                            data-dismiss='modal'
                                            onClick={this.invite}
                                        >
                                            Invitar
                                        </button>
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
Equipo.contextType = AuthContext;
export default Equipo;
