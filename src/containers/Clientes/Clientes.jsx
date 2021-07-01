import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Clientes/Clientes.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { AuthContext } from '../../firebase/context';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import ReactWhatsapp from 'react-whatsapp';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';
import NoHayEquipos from '../../assets/images/containers/Equipos/Equipos.png';
import Delete from '../../assets/images/delete.png';
import NoHayClientes from '../../assets/images/containers/Clientes/clientes.png';

export class Clientes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tiendas: [],
            clientes: [],
            tiendaSelected: '',
            uid: '',
            idInvitado: '',
            nombreInvitado: '',
            numeroInvitado: '',
            showBox: false,
            showId: null,
            clientesDefault: [],
            search: '',
            loading: true,
            isEmpty: true,
            sort: {
                column: null,
                direction: 'desc'
            }
        };
    }

    componentDidMount = () => {
        const tiendas = [];
        const clientes = [];

        const { user } = this.context;

        this.uidText = user['id'];

        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            });
        }, 1000);

        this.setState({
            uid: this.uidText
        });

        const db = firebaseConfig.firestore();
        //let docRef = db.collection("TiendasTest").doc(user["id"]);
        let docRef = db
            .collection('TiendasTest')
            .where('idDueño', '==', user['id'])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tiendas.push(doc.data());
                });
                this.setState({ tiendas: tiendas });
                this.setState({ tiendaSelected: this.state.tiendas[0]['nombre'] });
                db.collection('ClientesTest')
                    .where('tienda', '==', user['id'] + '-' + this.state.tiendas[0]['nombre'])
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            clientes.push(doc.data());
                        });
                        this.setState({ clientes: clientes, clientesDefault: clientes });
                        if (clientes.length > 0) {
                            this.setState({
                                isEmpty: false
                            });
                        } else {
                            this.setState({
                                isEmpty: true
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
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    invite = () => {
        const accountSid = 'ACe9ac170515dc4a7851dca58e5f893347';
        const authToken = '322a66fcbe9172eeba749fc0661aa085';
        //const client = require('twilio')(accountSid, authToken);

        client.messages.create({
            from: 'whatsapp:+14155238886', // shared WhatsApp number
            body: 'Ahoy world!',
            to: 'whatsapp:+573122594219' // change this to your personal WhatsApp number
        });
    };

    handleBoxToggle(i) {
        return () => {
            this.setState({ showBox: !this.state.showBox });
            this.setState({ showId: i });
        };
    }

    selectTienda = (e) => {
        this.setState({ tiendaSelected: e.target.value }, () => {
            this.fetchInfo();
        });
    };

    fetchInfo() {
        const clientes = [];
        const { user } = this.context;

        this.uidText = user['id'];

        const db = firebaseConfig.firestore();

        let docRefEquipo = db
            .collection('ClientesTest')
            .where('tienda', '==', user['id'] + '-' + this.state.tiendaSelected)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    clientes.push(doc.data());
                });
                this.setState({ clientes: clientes });

                if (clientes.length > 0) {
                    this.setState({
                        isEmpty: false
                    });
                } else {
                    this.setState({
                        isEmpty: true
                    });
                }
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });
    }

    sortTable = (column) => (e) => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.clientes.sort((a, b) => {
            const nameA = a.nombre.toUpperCase(); // ignore upper and lowercase
            const nameB = b.nombre.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }

        this.setState({
            clientes: sortedData,
            sort: {
                column,
                direction
            }
        });
    };

    search = (e) => {
        this.setState({
            search: e.target.value
        });

        var lista = this.state.clientes;

        function filterItems(query) {
            return lista.filter(function (el) {
                return el.nombre.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        }

        this.setState({
            clientes: filterItems(this.state.search)
        });

        if (e.target.value == '') {
            this.fetchInfo();
        }
    };

    render() {
        const { loading } = this.state;
        this.mensajeWhatsapp =
            'Hola,' +
            this.state.nombreInvitado +
            '! ' +
            this.state.tiendaSelected +
            ' te ha invitado a ser parte del Universo Meego. Descarga la App Meego y disfruta de grandes beneficios';

        return (
            <>
                <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>
                        <div className='col'>
                            <div className='row mb-5'></div>

                            <div className='row headerContainer'>
                                <div className='col-lg-3 col-sm-16 mb-sm-2 align-self-center p-0 text-left'>
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

                                        <div>
                                            <button
                                                className='btn text-white Categoria-btnMorado btnFull'
                                                data-toggle='modal'
                                                data-target='#FiltrarModal'
                                            >
                                                <i className='fa fa-filter mr-2'></i> Filtrar
                                            </button>
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

                            <div className='modal fade' id='FiltrarModal'>
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
                                                    data-dismiss='modal'
                                                    onClick={this.filter}
                                                >
                                                    Filtrar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row mb-5'></div>
                            <div className='DivHeader'>
                                <div className='Titulo-Equipo'>
                                    <h2 className='Categoria-Titulo'>Clientes</h2>
                                </div>

                                <div className='row mb-5'></div>
                            </div>

                            {this.state.isEmpty ? (
                                <div className='columnNoTiendas'>
                                    <img className='notTiendas' src={NoHayClientes} />
                                </div>
                            ) : (
                                <div>
                                    <div className='row mb-3'></div>
                                    <div className='col-12 table-responsive tableScrollVertical'>
                                        <table className='table' id='myTable' ref={this.title}>
                                            <thead className='text-left CategoriaTabla-Thead'>
                                                <tr>
                                                    <th className='tableClickeable' onClick={this.sortTable('nombre')}>
                                                        Nombre <i className='fas fa-sort'></i>
                                                    </th>
                                                    <th>Celular </th>
                                                    <th>Dirección </th>
                                                    <th>Foto de Perfil</th>
                                                </tr>
                                            </thead>
                                            {this.state.clientes &&
                                                this.state.clientes.length > 0 &&
                                                this.state.clientes.map((cliente) => (
                                                    <tbody className='text-left CategoriaTabla-Body'>
                                                        <tr>
                                                            <td>{cliente.nombre}</td>
                                                            <td>{cliente.celular}</td>
                                                            <td>{cliente.direccion}</td>
                                                            <td>
                                                                <img
                                                                    src={cliente.fotoPerfil}
                                                                    className='imagenProducto'
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                ))}
                                        </table>
                                    </div>
                                    {/*<div className='DivHeader'>
                                {this.state.clientes &&
                                    this.state.clientes.length > 0 &&
                                    this.state.clientes.map((item, i) => (
                                        <div className='columnFotoCliente'>
                                            <div
                                                className='divFotoCliente'
                                                style={{ backgroundColor: '#1A1446' }}
                                                onMouseOver={this.handleBoxToggle(i)}
                                                onMouseOut={this.handleBoxToggle(i)}
                                            >
                                                <img src={item.fotoPerfil} id='fotoCliente' className='text-center' />
                                                <div className={this.state.showBox && this.state.showId == i ? 'show' : ''}>
                                                    <div className='innerBox'>
                                                        <div className='row mb-3'></div>
                                                        <h5 className='Categoria-SubTitulo'>Nombre: {item.nombre}</h5>
                                                        <div className='row mb-3'></div>
                                                        <h5 className='Categoria-SubTitulo'>Celular: {item.celular}</h5>
                                                        <div className='row mb-3'></div>
                                                        <h5 className='Categoria-SubTitulo'>Dirección: {item.direccion}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>
                                        </div>
                                    ))}
                                    </div>*/}
                                </div>
                            )}
                        </div>
                        <div className='modal fade' id='InvitarModal'>
                            <div className='modal-dialog modal-dialog-centered' role='document'>
                                <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                    <div className='text-center modal-header border-bottom-0'>
                                        <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                            Enviar invitación
                                        </h4>
                                    </div>
                                    <div className='row mb-3'></div>
                                    <div className='mx-5'>
                                        <h2 className='Categoria-SubTitulo'>Nombre</h2>
                                        <form action=''>
                                            <input
                                                type='text'
                                                className='form-control text-muted '
                                                placeholder=''
                                                onChange={this.onChange}
                                                name='nombreInvitado'
                                                value={this.state.nombreInvitado}
                                            />
                                        </form>
                                    </div>
                                    <div className='row mb-3'></div>
                                    <div className='mx-5'>
                                        <h2 className='Categoria-SubTitulo'>Celular</h2>
                                        <form action=''>
                                            <input
                                                type='number'
                                                className='form-control text-muted '
                                                placeholder=''
                                                onChange={this.onChange}
                                                name='numeroInvitado'
                                                value={this.state.numeroInvitado}
                                            />
                                        </form>
                                    </div>
                                    <div className='row mb-3'></div>
                                    <div className='mx-5'>
                                        <h2 className='Categoria-SubTitulo'>Mensaje por defecto</h2>
                                        <div className='row mb-3'></div>
                                        <h5>
                                            <br />
                                            Hola, {this.state.nombreInvitado}! {this.state.tiendaSelected} te ha
                                            invitado a ser parte del Universo Meego.
                                            <br />
                                            <br />
                                            Descarga la App Meego y disfruta de grandes beneficios.
                                        </h5>
                                    </div>

                                    <div className='row text-center'>
                                        <div className='columnBtnGuardarPerfil'>
                                            <ReactWhatsapp
                                                className='btn text-white Categoria-btnMorado'
                                                number={'+57' + this.state.numeroInvitado}
                                                message={this.mensajeWhatsapp}
                                            >
                                                Invitar
                                            </ReactWhatsapp>
                                        </div>
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
Clientes.contextType = AuthContext;
export default Clientes;
