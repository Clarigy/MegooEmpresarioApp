import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/Tablas/Tablas.scss';
import '../../assets/styles/containers/Balances/balances.scss';
import IconActive from '../../hooks/iconActive';
import firebaseConfig from '../../firebase/setup.jsx';
import { AuthContext } from '../../firebase/context';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
// import ReactExport from 'react-export-excel';
export class BalancePagos extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);

        this.state = {
            tiendas: [],
            idEmpleado: '',
            tiendaSelected: '',
            uid: '',
            search: '',
            loading: true,
            isEmpty: true,
            idTienda: '',
            balances: [],
            detalles: [],
            sort: {
                column: '',
                direction: ''
            },
            search: ''
        };
    }
    componentDidMount = () => {
        $('#nabvar').show();
        $('#accordionSidebar').show();
        IconActive.checkPath('Siderbar-BalancePagos', '/balancepagos', this.props.match.path);
        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            });
        }, 1000);
        this.fetchInfo();
    };

    fetchInfo() {
        const { user } = this.context;

        const tiendas = [];
        var idtienda = '';
        const balances = [];

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

                this.setState({ tiendas: tiendas, tiendaSelected: tiendas[0]['nombre'] }, () => {
                    const tiendaUid = user['id'] + '-' + this.state.tiendaSelected;

                    let newTienda = db.collection('TiendasTest').doc(tiendaUid);
                    newTienda
                        .collection('balances')
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                balances.push(doc.data());
                            });

                            this.setState({ balances: balances });
                            if (this.state.balances.length > 0) {
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
                });
            })
            .catch(function (error) {
                //     console.log('Error getting documents: ', error);
            });
    }

    sortTable = (column) => (e) => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.balances.sort((a, b) => {
            if (column === 'Servicio') {
                const nameA = a.balance.toUpperCase(); // ignore upper and lowercase
                const nameB = b.balance.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            } else if (column === 'Precio') {
                const nameA = a.servicio.toUpperCase(); // ignore upper and lowercase
                const nameB = b.servicio.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            } else if (column === 'Ganancia') {
                return a.valor - b.valor;
            } else {
                return a.contractValue - b.contractValue;
            }
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }

        this.setState({
            Servicios: sortedData,
            sort: {
                column,
                direction
            }
        });
    };

    showDetails(uid) {
        const { user } = this.context;
        const detalles = [];
        const tiendaUid = user['id'] + '-' + this.state.tiendaSelected;
        const db = firebaseConfig.firestore();
        const colection = `TiendasTest/${tiendaUid}/balances/${uid}/detalles`;

        db.collection(colection)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    detalles.push(doc.data());
                });

                this.setState({ detalles: detalles });
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });

        // console.log("CLIK EN DETALLES", newDetalle)
        // const claseHeader = `#${uid.toString()}Header`
        // const claseBody = `#${uid.toString()}Body`
        // if($(claseHeader).is(":visible")){
        //     $(claseHeader).hide();
        //     this.setState({
        //         mostrarDetalles: false
        //     })
        // } else{
        //     $(claseHeader).show();
        //     this.setState({
        //         mostrarDetalles: true
        //     })
        // }
    }

    onSearch = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        let searchResult = [];

        var i = 0;
        var j = 0;
        var searchValue = e.target.value.toUpperCase();

        if (searchValue != '') {
            for (i = 0; this.state.balances.length > i; i++) {
                var item = this.state.balances[i];

                if (
                    item.balance.toUpperCase().includes(searchValue) ||
                    item.estado.toUpperCase().includes(searchValue) ||
                    item.servicio.toUpperCase().includes(searchValue) ||
                    item.semana.toUpperCase().includes(searchValue)
                ) {
                    searchResult[j] = item;
                    j = j + 1;
                }
            }
            this.setState({
                balances: searchResult
            });
        } else {
            this.fetchInfo();
        }
    };

    render() {
        const { loading } = this.state;
        return (
            <>
                <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                <div className='container-fluid'>
                    <div className='x-0 mx-md- mx-lg-8 perfilContainer'>
                        <div className='col'>
                            <div className='row mb-5'></div>

                            <div className='row headerContainer'>
                                <div className='col-lg-3 col-sm-16 mb-sm-2 p-0 align-self-center'>
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
                                                name='search'
                                                aria-label='Username'
                                                aria-describedby='basic-addon1'
                                                onChange={this.onSearch}
                                                value={this.state.search}
                                            />
                                        </div>

                                        <div>
                                            <button
                                                className='btn text-white Categoria-btnMorado mx-1 btnFull'
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
                                                <i class='fas fa-download mr-2'></i>
                                                Descargar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-5'>
                                <h2 className='Categoria-Titulo col-lg-3 col-sm-1 align-self-center text-left'>
                                    Balances
                                </h2>
                            </div>
                            <div className='row mt-5'>
                                <div className='col-12 table-responsive tableScrollVertical table-balances'>
                                    <table className='table' id='myTable' ref={this.title}>
                                        <thead className='text-left CategoriaTabla-Thead'>
                                            <tr>
                                                <th className='tableClickeable' onClick={this.sortTable('Servicio')}>
                                                    balance <i className='fas fa-sort'></i>
                                                </th>
                                                <th className='tableClickeable' onClick={this.sortTable('Precio')}>
                                                    servicio <i className='fas fa-sort'></i>
                                                </th>
                                                <th className='tableClickeable' onClick={this.sortTable('Ganancia')}>
                                                    valor <i className='fas fa-sort'></i>
                                                </th>
                                                <th>Semana</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        {this.state.balances &&
                                            this.state.balances.length > 0 &&
                                            this.state.balances.map((balance) => (
                                                <tbody className='text-left CategoriaTabla-Body'>
                                                    <tr
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => this.showDetails(balance.uid)}
                                                    >
                                                        <td>{balance.balance}</td>
                                                        <td>{balance.servicio}</td>
                                                        <td>{balance.valor}</td>
                                                        <td>{balance.semana}</td>
                                                        <td>{balance.estado}</td>
                                                    </tr>

                                                    {/* <tr className="more-info" id={balance.uid+"Header"}>
                                                <th>Servicio</th>
                                                <th>Fecha</th>
                                                <th>Valor</th>
                                                <th>Cliente</th>
                                                <th>Estado</th>
                                            </tr>
                                            {this.state.detalles && this.state.detalles.length > 0 && this.state.detalles.map((detalle) => (
                                                <tr className="more-info" id={balance.uid+"Body"}>
                                                    <td>{detalle.servicio}</td>
                                                    <td>{detalle.fecha}</td>
                                                    <td>{detalle.valor}</td>
                                                    <td>{detalle.cliente}</td>
                                                    <td>{detalle.estado}</td>
                                                </tr>
                                            ))} */}
                                                </tbody>
                                            ))}
                                    </table>
                                </div>
                            </div>
                            <div className='row mt-5'>
                                <h2 className='Categoria-Titulo'>Detalles</h2>
                            </div>
                            {this.state.detalles.length > 0 ? (
                                <div className='row mt-5'>
                                    <div className='col-12 table-responsive tableScrollVertical table-balances'>
                                        <table className='table' id='myTable' ref={this.title}>
                                            <thead className='text-left CategoriaTabla-Thead'>
                                                <tr>
                                                    <th>Servicio</th>
                                                    <th>Fecha</th>
                                                    <th>Valor</th>
                                                    <th>Cliente</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>

                                            {this.state.detalles &&
                                                this.state.detalles.length > 0 &&
                                                this.state.detalles.map((detalle) => (
                                                    <tbody className='text-left CategoriaTabla-Body'>
                                                        <tr>
                                                            <td>{detalle.servicio}</td>
                                                            <td>{detalle.fecha}</td>
                                                            <td>{detalle.valor}</td>
                                                            <td>{detalle.cliente}</td>
                                                            <td>{detalle.estado}</td>
                                                        </tr>
                                                    </tbody>
                                                ))}
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className='row mt-5'>
                                    <h4>Haz Click sobre un balance para ver sus detalles</h4>
                                </div>
                            )}
                        </div>
                    </div>

                    
                </div>
            </>
        );
    }
}

export default BalancePagos;
