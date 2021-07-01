import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Equipo/Equipo.scss';
import '../../assets/styles/containers/DescuentosPromociones/DescuentosPromociones.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { AuthContext } from '../../firebase/context';
import { Link } from 'react-router-dom';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';
import Delete from '../../assets/images/delete.png';
import NoHayDescuentos from '../../assets/images/containers/Descuentos/descuentos.png';
import NoHayPromociones from '../../assets/images/containers/Descuentos/promociones.png';
import CardDescuento from '../../components/cards/cardDescuentos';
import CardPromocion from '../../components/cards/CardsPromociones';

export class DescuentoPromociones extends Component {
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
            opcCategorias: [],
            opcServicios: [],
            newCategoria: '',
            newValor: 0,
            newGenero: '',
            newValido: '',
            newServicio: '',
            newPrecioActual: '',
            sort: {
                column: null,
                direction: 'desc'
            },
            isEmptyPromo: true,
            newTipoPromo: '',
            newGeneroPromo: '',
            newCategoriaPromo: '',
            newServicioPromo: '',
            newValidoPromo: '',
            newPrecioPromo: '',
            newPrecioActualPromo: '',
            newDiasPromo: [],
            NewHoraDesde: '',
            newHoraHasta: '',
            newGanancia: '',
            search: '',
            section: 'descuentos',
            descuentosMeego: [],
            combosMeego: [],
            tiendaUid: '',
            servicios: []
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({
                time: 0,
                loading: false
            });
        }, 1000);

        $('#nabvar').show();
        $('#accordionSidebar').show();
        IconActive.checkPath('Siderbar-Descuentos', '/descuentos', this.props.match.path);
        $('.react-bootstrap-table-pagination-list').removeClass('col-md-6 col-xs-6 col-sm-6 col-lg-6');
        $('.react-bootstrap-table-pagination-list').addClass('col-2 offset-5 mt-4');
        $('#InfoDescuentos').addClass('fade active show'); //por default se activa
        $('#InfoDescuentosDiv').addClass('active');

        /**
         * !Informacion
         */
        $('#InfoDescuentosDiv').click(() => {
            this.setState({ section: 'descuentos' });

            $('#InfoDescuentos').addClass('fade active show'); //por default se activa
            $('#InfoDescuentosDiv').addClass('active');

            //Inicio Tercer tab
            $('#InfoPromociones').removeClass('fade active show'); //div que se muestra
            $('#InfoPromocionesDiv').removeClass('active');
        });

        /**
         * !InfoPromociones
         */
        $('#InfoPromocionesDiv').click(() => {
            this.setState({ section: 'promociones' });

            $('#InfoPromociones').addClass('fade active show'); //div que se muestra
            $('#InfoPromocionesDiv').addClass('active');

            //primera tab
            $('#InfoDescuentos').removeClass('fade active show');
            $('#InfoDescuentosDiv').removeClass('active');
            //primera tab
        });

        const { user } = this.context;
        const tiendas = [];
        var idtienda = '';
        const datos = [];
        const descuentos = [];
        const Promociones = [];
        const descuentosMeego = [];
        const combosMeego = [];
        const servicios = [];

        this.uidText = user['id'];

        this.setState({
            uid: this.uidText
        });

        const db = firebaseConfig.firestore();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let docRef = db
            .collection('Tiendas')
            .where('uidProveedor', '==', user['id'])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tiendas.push(doc.data());
                });

                this.setState({ tiendas: tiendas, tiendaSelected: tiendas[0]['nombre'], tiendaUid: tiendas[0]['uid'] });
                const tienda = user['id'] + '-' + this.state.tiendaSelected;
                db.collection('Servicios')
                    .where('uidProveedor', '==', tienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            datos.push(doc.data());
                        });
                        this.setState({ clientes: datos, dataTable: datos }, () => {
                            this.getCategorias(this.state.newCategoria);
                        });
                    })
                    .catch(function (error) {
                        console.log('Error getting documents: ', error);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Descuentos/creados`;
                db.collection(collectionRef)
                    .where('Tienda', '==', tienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            descuentos.push(doc.data());
                        });
                        this.setState({ descuentos: descuentos });
                        if (this.state.descuentos.length > 0) {
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
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                let collection = `/Tiendas/${tienda}/opcionesPlan/Paquetes/creados`;
                db.collection(collection)
                    .where('tienda', '==', tienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            Promociones.push(doc.data());
                        });
                        this.setState({ Promociones: Promociones });
                        if (this.state.Promociones.length > 0) {
                            this.setState({
                                isEmptyPromo: false
                            });
                        } else {
                            this.setState({
                                isEmptyPromo: true
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log('Error getting documents: ', error);
                    });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                db.collection('Descuentos')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            descuentosMeego.push(doc.data());
                        });
                        this.setState({ descuentosMeego: descuentosMeego });
                    });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                db.collection('Paquetes')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            combosMeego.push(doc.data());
                        });
                        this.setState({ combosMeego: combosMeego });
                    })
                    .then(() => {
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        for (let i = 0; i < combosMeego.length; i++) {
                            const element = combosMeego[i];
                            let collectionReference = `Paquetes/${element.uid}/Servicios`;

                            db.collection(collectionReference)
                                .get()
                                .then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        // doc.data() is never undefined for query doc snapshots
                                        const obj = {
                                            uid: element.uid,
                                            servicios: doc.data()
                                        };
                                        servicios.push(obj);
                                    });
                                });
                        }
                        this.setState({ servicios: servicios });
                        console.log(this.state.servicios);
                    });
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });
    };

    fetchInfo() {
        const { user } = this.context;
        const tiendas = [];
        var idtienda = '';
        const datos = [];
        const descuentos = [];
        const promociones = [];

        this.uidText = user['id'];

        this.setState({
            uid: this.uidText
        });

        if (this.state.section == 'descuentos') {
            const db = firebaseConfig.firestore();
            //let docRef = db.collection("TiendasTest").doc(user["id"]);
            const tienda = user['id'] + '-' + this.state.tiendaSelected;
            let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Descuentos/creados`;
            db.collection(collectionRef)
                .where('Tienda', '==', tienda)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        descuentos.push(doc.data());
                    });
                    this.setState({ descuentos: descuentos });
                    if (this.state.descuentos.length > 0) {
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
        } else if (this.state.section == 'promociones') {
            const db = firebaseConfig.firestore();
            //let docRef = db.collection("TiendasTest").doc(usder["id"]);
            console.log('PROMOCIONES', promociones);
            const tienda = user['id'] + '-' + this.state.tiendaSelected;
            let collection = `/Tiendas/${tienda}/opcionesPlan/Paquetes/creados`;
            db.collection(collection)
                .where('tienda', '==', tienda)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        promociones.push(doc.data());
                    });
                    console.log('PROMOCIONES', promociones);
                    this.setState({ Promociones: promociones });
                    if (this.state.Promociones.length > 0) {
                        this.setState({
                            isEmptyPromo: false
                        });
                    } else {
                        this.setState({
                            isEmptyPromo: true
                        });
                    }
                })
                .catch(function (error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }

    sortTable = (column) => (e) => {
        if (this.state.section == 'descuentos') {
            const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
            const sortedData = this.state.descuentos.sort((a, b) => {
                if (column === 'categoria') {
                    const nameA = a.Categoria.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.Categoria.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                } else if (column === 'servicio') {
                    const nameA = a.Servicio.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.Servicio.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                } else if (column === 'Valor') {
                    return a.Valor - b.Valor;
                } else {
                    return a.contractValue - b.contractValue;
                }
            });

            if (direction === 'desc') {
                sortedData.reverse();
            }

            this.setState({
                descuentos: sortedData,
                sort: {
                    column,
                    direction
                }
            });
        } else if (this.state.section == 'promociones') {
            const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
            const sortedData = this.state.Promociones.sort((a, b) => {
                if (column === 'categoria') {
                    const nameA = a.categoria.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.categoria.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                } else if (column === 'servicio') {
                    const nameA = a.servicio.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.servicio.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                } else if (column === 'precioPromocion') {
                    return a.precioPromocion - b.precioPromocion;
                } else if (column === 'precioActual') {
                    return a.precioActual - b.precioActual;
                } else if (column === 'tipo') {
                    const nameA = a.tipo.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.tipo.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                }
            });

            if (direction === 'desc') {
                sortedData.reverse();
            }

            this.setState({
                descuentos: sortedData,
                sort: {
                    column,
                    direction
                }
            });
        }
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });

        if (e.target.name == 'newCategoria' || e.target.name == 'newCategoriaPromo') {
            this.getCategorias(e.target.value);
        }
        if (e.target.name == 'newValor' || e.target.name == 'newPrecioPromo') {
            var num = e.target.value.replace(/\./g, '');
            let ganancia = num - (num / 100) * 15;

            e.target.value = num;

            if (num) {
                num = num
                    .toString()
                    .split('')
                    .reverse()
                    .join('')
                    .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                num = num.toString().split('').reverse().join('').replace(/^[\.]/, '');
            }
            if (ganancia) {
                ganancia = ganancia
                    .toString()
                    .split('')
                    .reverse()
                    .join('')
                    .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
                ganancia = ganancia.toString().split('').reverse().join('').replace(/^[\.]/, '');
            }
            this.setState({
                [e.target.name]: num,
                newGanancia: ganancia
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    };

    onCheck = (e) => {
        const checkBoxDias = this.state.newDiasPromo;

        let old = true;

        for (var i = 0; i <= checkBoxDias.length; i++) {
            if (e.target.value == checkBoxDias[i]) {
                this.old = true;
                checkBoxDias.splice(i, 1);

                break;
            } else {
                old = false;
            }
        }

        if (!old) {
            checkBoxDias.push(e.target.value);
        }

        this.setState({
            newDiasPromo: checkBoxDias
        });
    };

    getCategorias = async (selectCategoria) => {
        const categoriasTemp = [];
        const serviciosTemp = [];
        const otroCategotiaTemp = [];
        const otroServicioTemp = [];

        const categorias = [];
        const servicios = [];
        const otroCategotia = [];
        const otroServicio = [];
        var i = 0;
        var j = 0;
        var k = 0;

        this.setState({
            newServicio: ''
        });

        for (i = 0; this.state.dataTable.length > i; i++) {
            var item = this.state.dataTable[i];
            if (item.categoria != 'OtroCategoria') {
                categoriasTemp[i] = item.categoria;
            } else {
                categoriasTemp[i] = item.otrasCategorias;
            }
        }

        if (selectCategoria != '') {
            for (let i = 0; this.state.dataTable.length > i; i++) {
                var item = this.state.dataTable[i];

                if (selectCategoria == item.categoria || selectCategoria == item.otrasCategorias) {
                    if (item.servicio != 'Otro') {
                        serviciosTemp[i] = item.servicio + '-' + item.genero;
                    } else {
                        serviciosTemp[i] = item.otrosServicios + '-' + item.genero;
                    }
                } else {
                }
            }
        } else {
            for (let i = 0; this.state.dataTable.length > i; i++) {
                var item = this.state.dataTable[i];

                if (item.servicio != 'Otro') {
                    serviciosTemp[i] = item.servicio + '-' + item.genero;
                } else {
                    serviciosTemp[i] = item.otrosServicios + '-' + item.genero;
                }
            }
        }

        categoriasTemp.sort();
        serviciosTemp.sort();

        for (let i = 0; i < categoriasTemp.length; i++) {
            if (categoriasTemp[i + 1] != categoriasTemp[i]) {
                categorias.push(categoriasTemp[i]);
            }
        }

        this.setState({
            opcServicios: serviciosTemp,
            opcCategorias: categorias
        });
    };

    selectTienda = (e) => {
        let tiendaSelect = this.state.tiendas.find((tienda) => tienda.nombre === e.target.value);
        let uid = tiendaSelect.uid;
        this.setState({ tiendaUid: uid }, () => {});
        this.setState({ tiendaSelected: e.target.value }, () => {
            this.fetchInfo();
        });
    };

    postDescuentos = async () => {
        const descuentos = [];
        const { user } = this.context;
        const tienda = user['id'] + '-' + this.state.tiendaSelected;
        if (
            this.state.newCategoria != '' &&
            this.state.newValor != '' &&
            this.state.newGenero != '' &&
            this.state.newValido != '' &&
            this.state.newServicio != ''
        ) {
            const db = firebaseConfig.firestore();
            const info = this.state.newServicio.split('-');
            const nombreServicio = info[0];
            let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Descuentos/creados`;
            await db
                .collection(collectionRef)
                .add({
                    Categoria: this.state.newCategoria,
                    Valor: this.state.newValor,
                    Genero: this.state.newGenero,
                    Valido: this.state.newValido,
                    Servicio: nombreServicio,
                    Tienda: tienda,
                    ganancia: this.state.newGanancia
                })
                .then(function (docRef) {
                    console.log('Document written with ID: ', docRef.id);
                    let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Descuentos/creados`;
                    db.collection(collectionRef).doc(docRef.id).update({
                        uid: docRef.id
                    });
                })
                .catch(function (error) {
                    console.error('Error adding document: ', error);
                });

            this.setState({
                newCategoria: '',
                newValor: '',
                newGenero: '',
                newValido: '',
                newServicio: '',
                newGanancia: ''
            });

            this.fetchInfo();
        }
    };

    postPromociones = async () => {
        if (this.state.newTipoPromo == '2x1') {
            if (
                this.state.newTipoPromo != '' &&
                this.state.newGeneroPromo != '' &&
                this.state.newCategoriaPromo != '' &&
                this.state.newServicioPromo != '' &&
                this.state.newValidoPromo != '' &&
                this.state.newPrecioActualPromo != ''
            ) {
                this.promocionesSubmit();
            }
        } else if (this.state.newTipoPromo == 'Dias') {
            if (
                this.state.newTipoPromo != '' &&
                this.state.newGeneroPromo != '' &&
                this.state.newCategoriaPromo != '' &&
                this.state.newServicioPromo != '' &&
                this.state.newValidoPromo != '' &&
                this.state.newPrecioActualPromo != '' &&
                this.state.newDiasPromo != []
            ) {
                this.promocionesSubmit();
            }
        } else if (this.state.newTipoPromo == 'Horas') {
            if (
                this.state.newTipoPromo != '' &&
                this.state.newGeneroPromo != '' &&
                this.state.newCategoriaPromo != '' &&
                this.state.newServicioPromo != '' &&
                this.state.newValidoPromo != '' &&
                this.state.newPrecioActualPromo != '' &&
                this.state.newDiasPromo != [] &&
                this.state.NewHoraDesde != '' &&
                this.state.newHoraHasta != ''
            ) {
                this.promocionesSubmit();
            }
        }
    };

    promocionesSubmit = async () => {
        const descuentos = [];
        const { user } = this.context;
        const tienda = user['id'] + '-' + this.state.tiendaSelected;
        const db = firebaseConfig.firestore();

        const info = this.state.newServicioPromo.split('-');
        const nombreServicio = info[0];
        let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Paquetes/creados`;
        await db
            .collection(collectionRef)
            .add({
                categoria: this.state.newCategoriaPromo,
                genero: this.state.newGeneroPromo,
                valido: this.state.newValidoPromo,
                servicio: nombreServicio,
                tienda: tienda,
                precioActual: this.state.newPrecioActualPromo,
                precioPromocion: this.state.newPrecioPromo,
                dias: this.state.newDiasPromo,
                horaDesde: this.state.NewHoraDesde,
                horaHasta: this.state.newHoraHasta,
                tipo: this.state.newTipoPromo,
                ganancia: this.state.newGanancia
            })
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);
                db.collection(collectionRef).doc(docRef.id).update({
                    uid: docRef.id
                });
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });

        this.setState({
            newCategoriaPromo: '',
            newGeneroPromo: '',
            newValidoPromo: '',
            newPrecioActualPromo: '',
            newDiasPromo: '',
            NewHoraDesde: '',
            newHoraHasta: '',
            newTipoPromo: '',
            newServicioPromo: '',
            newGanancia: ''
        });

        this.fetchInfo();
    };

    onSelectServicio = (e) => {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                if (this.state.section == 'descuentos') {
                    const dataTable = this.state.dataTable;
                    const info = this.state.newServicio.split('-');
                    const genero = info[1];

                    this.setState({
                        newGenero: genero
                    });
                } else {
                    const dataTable = this.state.dataTable;
                    const info = this.state.newServicioPromo.split('-');
                    const genero = info[1];

                    let servicioSelected = '';
                    let precio = '';

                    servicioSelected = dataTable.find(
                        (element) => element.servicio === info[0] || element.otrosServicios === info[0]
                    );
                    precio = servicioSelected.precio;
                    const ganancia = precio - (precio / 100) * 15;
                    this.setState({
                        newGeneroPromo: genero,
                        newPrecioActualPromo: precio,
                        newGanancia: ganancia
                    });
                }
            }
        );
    };

    delete(uid) {
        return () => {
            if (this.state.section == 'descuentos') {
                const { user } = this.context;
                const db = firebaseConfig.firestore();
                const tienda = user['id'] + '-' + this.state.tiendaSelected;

                let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Descuentos/creados`;
                db.collection(collectionRef).doc(uid).delete();
                this.fetchInfo();
            } else {
                const { user } = this.context;
                const db = firebaseConfig.firestore();
                const tienda = user['id'] + '-' + this.state.tiendaSelected;
                let collectionRef = `/Tiendas/${tienda}/opcionesPlan/Paquetes/creados`;
                db.collection(collectionRef).doc(uid).delete();
                this.fetchInfo();
            }
        };
    }

    search = (e) => {
        this.setState({
            search: e.target.value
        });

        let DescuentosTemp = [];

        var j = 0;

        if (this.state.section == 'descuentos') {
            if (e.target.value != '') {
                for (let i = 0; this.state.descuentos.length > i; i++) {
                    var item = this.state.descuentos[i];

                    if (
                        item.Categoria.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.Servicio.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.Genero.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.Valor.includes(e.target.value) ||
                        item.Valido.includes(e.target.value)
                    ) {
                        DescuentosTemp[j] = item;
                        j = j + 1;
                    }
                }

                this.setState({
                    descuentos: DescuentosTemp
                });
            } else {
                this.fetchInfo();
            }
        } else if (this.state.section == 'promociones') {
            if (e.target.value != '') {
                for (let i = 0; this.state.Promociones.length > i; i++) {
                    var item = this.state.Promociones[i];

                    if (
                        item.categoria.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.servicio.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.genero.toUpperCase().includes(e.target.value.toUpperCase()) ||
                        item.precioActual.includes(e.target.value) ||
                        item.precioPromocion.includes(e.target.value) ||
                        item.dias.includes(e.target.value) ||
                        item.valido.includes(e.target.value) ||
                        item.tipo.toUpperCase().includes(e.target.value.toUpperCase())
                    ) {
                        DescuentosTemp[j] = item;
                        j = j + 1;
                    }
                }

                this.setState({
                    Promociones: DescuentosTemp
                });
            } else {
                this.fetchInfo();
            }
        }
    };

    handleServicios(uid) {
        let servicios = this.state.servicios.filter((v) => v.uid === uid);
        console.log('servicios, ', uid);
        console.log('servicios, ', servicios);
        return servicios;
    }

    render() {
        var isEmpty = '';
        if (this.state.section == 'descuentos') {
            if (
                this.state.newCategoria != '' &&
                this.state.newValor != '' &&
                this.state.newGenero != '' &&
                this.state.newValido != '' &&
                this.state.newServicio != ''
            ) {
                isEmpty = '';
            } else {
                isEmpty = 'Por favor llena todos los campos';
            }
        } else {
            if (this.state.newTipoPromo == '2x1') {
                if (
                    this.state.newTipoPromo != '' &&
                    this.state.newGeneroPromo != '' &&
                    this.state.newCategoriaPromo != '' &&
                    this.state.newServicioPromo != '' &&
                    this.state.newValidoPromo != '' &&
                    this.state.newPrecioActualPromo != ''
                ) {
                    isEmpty = '';
                } else {
                    isEmpty = 'Por favor llena todos los campos';
                }
            } else if (this.state.newTipoPromo == 'Dias') {
                if (
                    this.state.newTipoPromo != '' &&
                    this.state.newGeneroPromo != '' &&
                    this.state.newCategoriaPromo != '' &&
                    this.state.newServicioPromo != '' &&
                    this.state.newValidoPromo != '' &&
                    this.state.newPrecioActualPromo != '' &&
                    this.state.newDiasPromo != []
                ) {
                    isEmpty = '';
                } else {
                    isEmpty = 'Por favor llena todos los campos';
                }
            } else if (this.state.newTipoPromo == 'Horas') {
                if (
                    this.state.newTipoPromo != '' &&
                    this.state.newGeneroPromo != '' &&
                    this.state.newCategoriaPromo != '' &&
                    this.state.newServicioPromo != '' &&
                    this.state.newValidoPromo != '' &&
                    this.state.newPrecioActualPromo != '' &&
                    this.state.newDiasPromo != [] &&
                    this.state.NewHoraDesde != '' &&
                    this.state.newHoraHasta != ''
                ) {
                    isEmpty = '';
                } else {
                    isEmpty = 'Por favor llena todos los campos';
                }
            }
        }

        const { loading } = this.state;

        return (
            <>
                <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />
                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>
                        <div className='col'>
                            <div className='row mb-5'></div>

                            <div className='row rowHeader'>
                                <div className='col-lg-3 col-sm-4 mb-sm-2 p-0 align-self-center text-left'>
                                    <select
                                        name=''
                                        id=''
                                        className=' text-white px-4 py-2  Categoria-btnMorado btnFull'
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
                                <div className='col-lg-9 col-sm-5 colFiltrosContainer'>
                                    <div className='row filtrosContainer'>
                                        <div className='row opcionContainer btnFull'>
                                            <a
                                                className='btn text-white Descuentos-btnMorado btnHalfFull'
                                                data-toggle='pill'
                                                href='#InfoDescuentos'
                                                id='InfoDescuentosDiv'
                                            >
                                                <p className='DescuentosDiv_Text'>Descuentos</p>
                                            </a>

                                            <a
                                                className='btn text-white Descuentos-btnMorado btnHalfFull'
                                                data-toggle='pill'
                                                href='#InfoPromociones'
                                                id='InfoPromocionesDiv'
                                            >
                                                <p className='DescuentosDiv_Text'>Promociones</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col sectionDiv'>
                                {/*/////////////////////////////////////////////////////////////*/}
                                <div className='container-fluid'>
                                    <div className='tab-content'>
                                        <div id='InfoDescuentos' className='tab-pane fade active'>
                                            {/*/////////////////////////////////////////////////////////////*/}
                                            <div className='row mb-5'></div>
                                            <div className='row headerContainer'>
                                                <div className='col-lg-3 col-sm-1 text-left'>
                                                    <h2 className='Categoria-Titulo'>Descuentos</h2>
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
                                                                className='btn text-white Descuentos-btnMorado btnFull'
                                                                data-toggle='modal'
                                                                data-target='#AgregarDescuento'
                                                            >
                                                                <i className='fa fa-plus mr-2'></i> Agregar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row mb-3'></div>
                                            {this.state.isEmpty ? (
                                                <div className='columnNoTiendas'>
                                                    <img className='notTiendas' src={NoHayDescuentos} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className='row mb-3'></div>
                                                    <div className='col-12 table-responsive tableScrollVertical table-descuentos'>
                                                        <table className='table' id='myTable' ref={this.title}>
                                                            <thead className='text-left CategoriaTabla-Thead'>
                                                                <tr>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('categoria')}
                                                                    >
                                                                        Categoria <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('servicio')}
                                                                    >
                                                                        Servicio <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('valor')}
                                                                    >
                                                                        Valor (%) <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th>Genero </th>
                                                                    <th>Valido </th>
                                                                    <th>Acción</th>
                                                                </tr>
                                                            </thead>
                                                            {this.state.descuentos &&
                                                                this.state.descuentos.length > 0 &&
                                                                this.state.descuentos.map((descuento) => (
                                                                    <tbody className='text-left CategoriaTabla-Body'>
                                                                        <tr>
                                                                            <td>{descuento.Categoria}</td>
                                                                            <td>{descuento.Servicio}</td>
                                                                            <td>{descuento.Valor}</td>
                                                                            <td>{descuento.Genero}</td>
                                                                            <td>{descuento.Valido}</td>
                                                                            <td>
                                                                                <button
                                                                                    className='tableButton'
                                                                                    onClick={this.delete(descuento.uid)}
                                                                                >
                                                                                    <img src={Delete} />
                                                                                </button>
                                                                                {/*<button className="tableButton" onClick={this.delete(servicio.uid)}><img src={Update} /></button>*/}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))}
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            {/*/////////////////////////////////////////////////////////////*/}
                                            <div className='row mb-5'></div>
                                            <div className='col-12 mb-3'>
                                                <h2 className='Categoria-Titulo'>Descuentos Meego</h2>
                                            </div>
                                            <div className='row mb-5'></div>
                                            <div className='cards-descuento'>
                                                {this.state.descuentosMeego &&
                                                    this.state.descuentosMeego.length > 0 &&
                                                    this.state.descuentosMeego.map((descuento) => (
                                                        <CardDescuento
                                                            descuento={descuento}
                                                            tiendaUid={this.state.tiendaUid}
                                                        ></CardDescuento>
                                                    ))}
                                            </div>
                                        </div>

                                        <div id='InfoPromociones' className='tab-pane fade'>
                                            <div className='row mb-5'></div>
                                            <div className='row headerContainer'>
                                                <div className='col-lg-3 col-sm-1 text-left'>
                                                    <h2 className='Categoria-Titulo'>Promociones</h2>
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
                                                                className='btn text-white Descuentos-btnMorado btnFull btnDescuentos'
                                                                data-toggle='modal'
                                                                data-target='#AgregarPromocion'
                                                            >
                                                                <i className='fa fa-plus mr-2'></i> Agregar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row mb-3'></div>
                                            {this.state.isEmptyPromo ? (
                                                <div className='columnNoTiendas'>
                                                    <img className='notTiendas' src={NoHayPromociones} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className='row mb-3'></div>
                                                    <div className='col-12 table-responsive tableScrollVertical table-descuentos'>
                                                        <table className='table' id='myTable' ref={this.title}>
                                                            <thead className='text-left CategoriaTabla-Thead'>
                                                                <tr>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('tipo')}
                                                                    >
                                                                        Tipo de <br></br> promoción{' '}
                                                                        <i className='fas fa-sort'></i>
                                                                    </th>

                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('categoria')}
                                                                    >
                                                                        Categoria <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('servicio')}
                                                                    >
                                                                        Servicio <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('precioActual')}
                                                                    >
                                                                        Precio<br></br> Actual{' '}
                                                                        <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th
                                                                        className='tableClickeable'
                                                                        onClick={this.sortTable('precioPromocion')}
                                                                    >
                                                                        Precio con <br></br> promoción{' '}
                                                                        <i className='fas fa-sort'></i>
                                                                    </th>
                                                                    <th>Genero </th>
                                                                    <th>Dias</th>
                                                                    <th>Horas</th>
                                                                    <th>Valido </th>
                                                                    <th>Acción</th>
                                                                </tr>
                                                            </thead>
                                                            {this.state.Promociones &&
                                                                this.state.Promociones.length > 0 &&
                                                                this.state.Promociones.map((promocion) => (
                                                                    <tbody className='text-left CategoriaTabla-Body'>
                                                                        <tr>
                                                                            <td>{promocion.tipo}</td>

                                                                            <td>{promocion.categoria}</td>
                                                                            <td>{promocion.servicio}</td>
                                                                            <td>{promocion.precioActual}</td>
                                                                            <td>{promocion.precioPromocion}</td>
                                                                            <td>{promocion.genero}</td>
                                                                            <td>{promocion.dias}</td>
                                                                            <td>
                                                                                {promocion.horaDesde +
                                                                                    '-' +
                                                                                    promocion.horaHasta}
                                                                            </td>
                                                                            <td>{promocion.valido}</td>
                                                                            <td>
                                                                                <button
                                                                                    className='tableButton'
                                                                                    onClick={this.delete(promocion.uid)}
                                                                                >
                                                                                    <img src={Delete} />
                                                                                </button>
                                                                                {/*<button className="tableButton" onClick={this.delete(servicio.uid)}><img src={Update} /></button>*/}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))}
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            <div className='row mb-5'></div>
                                            <div className='col-12 mb-3'>
                                                <h2 className='Categoria-Titulo'>Combos Meego</h2>
                                            </div>
                                            <div className='row mb-5'></div>
                                            <div className='cards-descuento'>
                                                {console.log(this.state.servicios)}
                                                {console.log(
                                                    this.state.servicios.filter(
                                                        (v) => v.uid === 'F2vBUkLdvk8dEpppxxdp',
                                                        ''
                                                    )
                                                )}
                                                {this.state.combosMeego &&
                                                    this.state.servicios.length > 0 &&
                                                    this.state.combosMeego.length > 0 &&
                                                    this.state.combosMeego.map((combo) => (
                                                        <CardPromocion
                                                            combo={combo}
                                                            key={combo.uid}
                                                            tiendaUid={this.state.tiendaUid}
                                                            servicios={this.state.servicios.filter(
                                                                (v) => v.uid === combo.uid
                                                            )}
                                                        ></CardPromocion>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal fade' id='AgregarDescuento'>
                        <div className='modal-dialog modal-dialog-centered' role='document'>
                            <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                <div className='text-center modal-header border-bottom-0'>
                                    <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                        Agregar Descuento
                                    </h4>
                                </div>
                                <div className='row mb-3'></div>

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
                                        {this.state.opcCategorias.map((categoria) => (
                                            <option value={categoria}>{categoria}</option>
                                        ))}
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
                                        onChange={this.onSelectServicio}
                                        value={this.state.newServicio}
                                    >
                                        <option value=''></option>
                                        {this.state.opcServicios.map((servicio) => (
                                            <option value={servicio}>{servicio}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Valor</h2>
                                    <form action=''>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            onChange={this.onChange}
                                            name='newValor'
                                            value={this.state.newValor}
                                        />
                                        <p className='textGanancias'>
                                            Tu ganancia sería de<b className='ganancias'>${this.state.newGanancia}</b>
                                        </p>
                                    </form>
                                    <div className='row mb-1'></div>
                                </div>

                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Género</h2>
                                    <input
                                        name='newGenero'
                                        id=''
                                        className='form-control text-muted'
                                        aria-label='Buscar'
                                        value={this.state.newGenero}
                                        disabled
                                    ></input>
                                </div>

                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Valido hasta</h2>
                                    <input
                                        type='date'
                                        className='form-control text-muted '
                                        aria-label='fechaEventoFinal'
                                        name='newValido'
                                        onChange={this.onChange}
                                        value={this.state.newValido}
                                    />
                                </div>
                                <div className='row mb-3'></div>
                                <h2 className='text-center Categoria-Alerta-Rojo'>{isEmpty}</h2>

                                <div className='row text-center'>
                                    <div className='columnBtnEliminarPerfil'>
                                        <button className='btn text-white Categoria-btnRosado' data-dismiss='modal'>
                                            Cancelar
                                        </button>
                                    </div>

                                    <div className='columnBtnEliminarPerfil'>
                                        <button
                                            className='btn text-white Categoria-btnMorado'
                                            data-dismiss={isEmpty == '' ? 'modal' : ''}
                                            onClick={this.postDescuentos}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='modal fade' id='AgregarPromocion'>
                        <div className='modal-dialog modal-dialog-centered' role='document'>
                            <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                <div className='text-center modal-header border-bottom-0'>
                                    <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                        Agregar Promoción
                                    </h4>
                                </div>
                                <div className='row mb-3'></div>

                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Tipo de Promoción</h2>
                                    <select
                                        name='newTipoPromo'
                                        id=''
                                        className='form-control text-muted'
                                        aria-label='Buscar'
                                        onChange={this.onChange}
                                        value={this.state.newTipoPromo}
                                    >
                                        <option value=''></option>
                                        <option value='2x1'>2x1</option>
                                        <option value='Dias'>Dias</option>
                                        <option value='Horas'>Horas</option>
                                    </select>
                                </div>

                                <div className='row mb-3'></div>

                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Categoria</h2>
                                    <select
                                        name='newCategoriaPromo'
                                        id=''
                                        className='form-control text-muted'
                                        aria-label='Buscar'
                                        onChange={this.onChange}
                                        value={this.state.newCategoriaPromo}
                                    >
                                        <option value=''></option>
                                        {this.state.opcCategorias.map((categoria) => (
                                            <option value={categoria}>{categoria}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Servicio</h2>
                                    <select
                                        name='newServicioPromo'
                                        id=''
                                        className='form-control text-muted'
                                        aria-label='Buscar'
                                        onChange={this.onSelectServicio}
                                        value={this.state.newServicioPromo}
                                    >
                                        <option value=''></option>
                                        {this.state.opcServicios.map((servicios) => (
                                            <option value={servicios}>{servicios}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Género</h2>
                                    <input
                                        name='newGeneroPromo'
                                        id=''
                                        className='form-control text-muted'
                                        aria-label='genero'
                                        value={this.state.newGeneroPromo}
                                        disabled
                                    />
                                </div>
                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Precio Actual</h2>
                                    <form action=''>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            name='newPrecioPromo'
                                            value={this.state.newPrecioActualPromo}
                                            disabled
                                        />
                                    </form>
                                    <div className='row mb-1'></div>
                                    <p
                                        className='textGanancias'
                                        style={
                                            this.state.newTipoPromo === '2x1'
                                                ? { display: 'initial' }
                                                : { display: 'none' }
                                        }
                                    >
                                        Tu ganancia sería de<b className='ganancias'>${this.state.newGanancia}</b>
                                    </p>
                                </div>

                                <div className='row mb-3'></div>
                                <div
                                    className='mx-5'
                                    style={
                                        this.state.newTipoPromo != '2x1' && this.state.newTipoPromo != ''
                                            ? { display: 'initial' }
                                            : { display: 'none' }
                                    }
                                >
                                    <h2 className='Categoria-SubTitulo'>Precio con promoción</h2>
                                    <form action=''>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            onChange={this.onChange}
                                            name='newPrecioPromo'
                                            value={this.state.newPrecioPromo}
                                        />
                                    </form>
                                    <div className='row mb-1'></div>
                                    <p
                                        className='textGanancias'
                                        style={
                                            this.state.newTipoPromo != '2x1' && this.state.newTipoPromo != ''
                                                ? { display: 'initial' }
                                                : { display: 'none' }
                                        }
                                    >
                                        Tu ganancia sería de<b className='ganancias'>${this.state.newGanancia}</b>
                                    </p>
                                </div>

                                <div className='row mb-3'></div>
                                <div className='mx-5'>
                                    <h2 className='Categoria-SubTitulo'>Valido Hasta</h2>
                                    <input
                                        type='date'
                                        className='form-control text-muted '
                                        aria-label='fechaEventoFinal'
                                        name='newValidoPromo'
                                        onChange={this.onChange}
                                        value={this.state.newValidoPromo}
                                    />
                                </div>
                                <div className='row mb-3'></div>
                                <div
                                    className='mx-5'
                                    style={
                                        this.state.newTipoPromo == 'Horas'
                                            ? { display: 'initial' }
                                            : { display: 'none' }
                                    }
                                >
                                    <h2 className='Categoria-SubTitulo'>Hora Desde</h2>
                                    <input
                                        type='time'
                                        className='form-control text-muted '
                                        aria-label='fechaEventoFinal'
                                        name='NewHoraDesde'
                                        onChange={this.onChange}
                                        value={this.state.NewHoraDesde}
                                    />
                                </div>
                                <div className='row mb-3'></div>
                                <div
                                    className='mx-5'
                                    style={
                                        this.state.newTipoPromo == 'Horas'
                                            ? { display: 'initial' }
                                            : { display: 'none' }
                                    }
                                >
                                    <h2 className='Categoria-SubTitulo'>Hora Hasta</h2>
                                    <input
                                        type='time'
                                        className='form-control text-muted '
                                        aria-label='fechaEventoFinal'
                                        name='newHoraHasta'
                                        onChange={this.onChange}
                                        value={this.state.newHoraHasta}
                                    />
                                </div>
                                <div
                                    className='mx-5 colDias'
                                    style={
                                        this.state.newTipoPromo == 'Horas' || this.state.newTipoPromo == 'Dias'
                                            ? { display: 'flex' }
                                            : { display: 'none' }
                                    }
                                >
                                    <div className='tableServicio'>
                                        <h2 className='Categoria-SubTitulo'>Dias</h2>
                                    </div>
                                    <div className='row mb-3'></div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Lunes</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Lunes '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Martes</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Martes '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Miercoles</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Miercoles '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Jueves</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Jueves '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Viernes</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Viernes '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Sabado</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Sabado '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                    <div className='tableServicio'>
                                        <div className='columnDatos'>
                                            <h2 className='productosList'>Domingo</h2>
                                        </div>
                                        <div className='columnDatos text-center '>
                                            <label className='containerCheck'>
                                                <input
                                                    name='checkBoxPromociones'
                                                    type='checkbox'
                                                    value='Domingo '
                                                    className=''
                                                    onChange={this.onCheck}
                                                />
                                                <span className='check-6c3eff'></span>
                                            </label>
                                        </div>
                                        <br />
                                        <div className='row mb-3'></div>
                                    </div>
                                </div>
                                <div className='row mb-3'></div>
                                <h2 className='text-center Categoria-Alerta-Rojo'>{isEmpty}</h2>

                                <div className='row text-center'>
                                    <div className='columnBtnEliminarPerfil'>
                                        <button className='btn text-white Categoria-btnRosado' data-dismiss='modal'>
                                            Cancelar
                                        </button>
                                    </div>

                                    <div className='columnBtnEliminarPerfil'>
                                        <button
                                            className='btn text-white Categoria-btnMorado'
                                            data-dismiss={isEmpty == '' ? 'modal' : ''}
                                            onClick={this.postPromociones}
                                        >
                                            Agregar
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
DescuentoPromociones.contextType = AuthContext;
export default DescuentoPromociones;
