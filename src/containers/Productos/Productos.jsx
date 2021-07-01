import React, { Component } from 'react';
import { db, storage } from '../../firebase';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import $ from 'jquery';
import BootstrapTable from 'react-bootstrap-table-next';
import OpcionPag from '../../hooks/optionPaginacion';
import '../../assets/styles/Tablas/Tablas.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Delete from '../../assets/images/delete.png';
import Update from '../../assets/images/update.png';
import firebaseConfig from '../../firebase/setup.jsx';
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { multiSelectFilter } from 'react-bootstrap-table2-filter';

const datatable = [];
export class Productos extends Component {
    constructor(props) {
        super(props);
        (this.title = React.createRef()),
            (this.state = {
                dataTabla: [],
                dataTable: [],
                idDataTabla: [],
                genero: '',
                categoria: '',
                servicio: '',
                tiposervicioOne: '',
                newDescripcion: '',
                newGanancia: 0,
                newImagen: '',
                newPrecio: '',
                newProducto: '',
                newFotoProducto: '',
                otro: '',
                newEstado: 'Pendiente',
                tienda: this.props.uid,
                precio: '',
                Categorias: [],
                sort: {
                    column: null,
                    direction: 'desc'
                },
                Servicios: [],
                generos: ['Ambos', 'F', 'M'],
                tipoServicio: ['A domicilio', 'En mi local', 'Ambos'],
                idDelete: '',
                idUpdate: '',
                buscar: '',
                newFiltroEstado: '',
                opcProductos: []
            });
    }
    componentDidMount() {
        $('#HomeBtnSearchServicios').css('display', 'none');
        $('.react-bootstrap-table-pagination-list').removeClass('col-md-6 col-xs-6 col-sm-6 col-lg-6');
        $('.react-bootstrap-table-pagination-list').addClass('col-2 offset-5 mt-4');

        setTimeout(() => {
            // this.setState({ loading: false });
            $('#HomeBtnSearchServicios').trigger('click');
        }, 1000);

        this.fetchInfo();
        this.getProductos();
    }

    sortTable = (column) => (e) => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.productos.sort((a, b) => {
            if (column === 'Producto') {
                const nameA = a.producto.toUpperCase(); // ignore upper and lowercase
                const nameB = b.producto.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            } else if (column === 'Precio') {
                return a.precio - b.precio;
            } else if (column === 'Ganancia') {
                return a.ganancia - b.ganancia;
            } else {
                return a.contractValue - b.contractValue;
            }
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }

        this.setState({
            productos: sortedData,
            sort: {
                column,
                direction
            }
        });
    };
    delete(uid) {
        return () => {
            const productos = [];

            const db = firebaseConfig.firestore();

            db.collection('Productos').doc(uid).delete();

            // db.collection('Productos')
            //     .where('uidProveedor', '==', this.state.tienda)
            //     .get()
            //     .then((querySnapshot) => {
            //         querySnapshot.forEach((doc) => {
            //             // doc.data() is never undefined for query doc snapshots
            //             productos.push(doc.data());
            //         });
            //         this.setState({ productos: productos });
            //     })
            //     .catch(function (error) {

            //     });
            this.fetchInfo();
        };
    }

    fetchInfo = async () => {
        const Productos = [];
        const db = firebaseConfig.firestore();

        db.collection('Tiendas')
            .doc(this.state.tienda)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({
                        name: doc.data()['nombre'],
                        foto: doc.data()['foto']
                    });
                } else {
                }
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
            });

        db.collection('Productos')
            .where('uidProveedor', '==', this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    Productos.push(doc.data());
                });
                this.setState({ productos: Productos, productosDefault: Productos, dataTable: Productos });

                this.getProductos();
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });
    };

    getProductos() {
        const productosTemp = [];

        var i = 0;

        for (i = 0; this.state.dataTable.length > i; i++) {
            var item = this.state.dataTable[i];
            productosTemp[i] = item.producto;
            console.log('producto: ', item.producto);
        }

        this.setState({
            opcProductos: productosTemp
        });
    }

    onSubmit = async () => {
        const productos = [];

        const db = firebaseConfig.firestore();

        if (
            this.state.newProducto != '' &&
            this.state.newEstado != '' &&
            this.state.newGanancia != '' &&
            this.state.newDescripcion != '' &&
            this.state.newPrecio != '' &&
            this.state.newFotoProducto != ''
        ) {
            await db
                .collection('Productos')
                .add({
                    descripcion: this.state.newDescripcion,
                    estado: this.state.newEstado,
                    ganancia: this.state.newGanancia,
                    precio: this.state.newPrecio,
                    producto: this.state.newProducto,
                    uidProveedor: this.state.tienda,
                    foto: this.state.newFotoProducto,
                    categoriaMeego: '',
                    latitud: '',
                    longitud: ''
                })
                .then(function (docRef) {
                    console.log('Document written with ID: ', docRef.id);
                    db.collection('Productos').doc(docRef.id).update({
                        uid: docRef.id
                    });
                })
                .catch(function (error) {
                    console.error('Error adding document: ', error);
                });

            // await db
            //     .collection('Productos')
            //     .where('uidProveedor', '==', this.state.tienda)
            //     .get()
            //     .then((querySnapshot) => {
            //         querySnapshot.forEach((doc) => {
            //             // doc.data() is never undefined for query doc snapshots
            //             productos.push(doc.data());
            //         });
            //         this.setState({ productos: productos });
            //     })
            //     .catch(function (error) {
            //         console.log('Error getting documents: ', error);
            //     });
            this.setState({
                newProducto: '',
                newGanancia: '',
                newDescripcion: '',
                newPrecio: '',
                newFotoProducto: ''
            });

            this.fetchInfo();
        } else {
        }
    };

    onChange = (e) => {
        if (e.target.name == 'newPrecio') {
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

    onChangeFile = (e) => {
        const { user } = this.context;

        const file = e.target.files[0];

        const storageRef = firebaseConfig.storage().ref();
        const fileRef = storageRef.child('/foto/productos/' + this.state.tienda + '/' + file.name);
        fileRef.put(file).then(() => {
            console.log('Upload a file');
            storageRef
                .child('/foto/productos/' + this.state.tienda + '/' + file.name)
                .getDownloadURL()
                .then((url) => {
                    this.setState({
                        newFotoProducto: url
                    });
                });
        });
    };

    onSearch = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        let searchResult = [];

        var i = 0;
        var j = 0;
        var searchValue = e.target.value.toUpperCase();

        if (searchValue != '') {
            for (i = 0; this.state.productos.length > i; i++) {
                var item = this.state.productos[i];

                if (
                    item.descripcion.toUpperCase().includes(searchValue) ||
                    item.estado.toUpperCase().includes(searchValue) ||
                    item.producto.toUpperCase().includes(searchValue)
                ) {
                    searchResult[j] = item;
                    j = j + 1;
                }
            }
            this.setState({
                productos: searchResult
            });
        } else {
            this.fetchInfo();
        }
    };

    onFilter = async () => {
        let filterResult = [];

        filterResult = this.state.dataTable.slice();

        var i = 0;
        var j = 0;

        if (this.state.newProducto != '') {
            filterResult = filterResult.filter((friend) => {
                return friend.producto == this.state.newProducto;
            });
        }

        if (this.state.newFiltroEstado != '') {
            filterResult = filterResult.filter((friend) => {
                return friend.estado == this.state.newFiltroEstado;
            });
        }

        if (this.state.newProducto == '' && this.state.newFiltroEstado == '') {
            this.fetchInfo();
        }

        this.setState({
            productos: filterResult
        });

        filterResult = [];
    };

    filterClear = () => {
        this.fetchInfo();
        this.setState({
            newProducto: '',
            newFiltroEstado: ''
        });
    };

    render() {
        const fotoDefault =
            'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6';

        var isEmpty = '';

        if (
            this.state.newProducto != '' &&
            this.state.newEstado != '' &&
            this.state.newGanancia != '' &&
            this.state.newDescripcion != '' &&
            this.state.newPrecio != '' &&
            this.state.newFotoProducto != ''
        ) {
            isEmpty = '';
        } else {
            isEmpty = 'Por favor llena todos los campos';
        }

        return (
            <>
                <div className='row headerContainer'>
                    <div className=' col-lg-3 col-sm-1 align-self-center text-left'>
                        <h2 className='Categoria-Titulo mb-0 mt-1'>Productos</h2>
                    </div>
                    <div className='col-lg-9 col-xs-16 colFiltrosContainer'>
                        <div className='row filtrosContainer'>
                            <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
                                <div className='input-group-prepend'>
                                    <span className='input-group-text Search-Inputprepend' id='basic-addon1'>
                                        <i className='fa fa-search text-muted'></i>
                                    </span>
                                </div>
                                <input
                                    type='text'
                                    className='form-control text-muted Search-Inputprepend-Input'
                                    name='buscar'
                                    onChange={this.onSearch}
                                    placeholder='Buscar'
                                    aria-label='Username'
                                    aria-describedby='basic-addon1'
                                />
                            </div>
                            <div className='mb-3'>
                                <button
                                    className='btn text-white Categoria-btnMorado btnFull'
                                    data-toggle='modal'
                                    data-target='#FiltrarModalProductos'
                                >
                                    <i className='fa fa-filter mr-2'></i> Filtrar
                                </button>
                            </div>
                            <div className='mb-3'>
                                <button
                                    className='btn text-white Categoria-btnMorado btnFull'
                                    data-toggle='modal'
                                    data-target='#agregarProducto'
                                >
                                    <i className='fa fa-plus mr-2'></i> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-5'>
                    <div className='col-12 table-responsive'>
                        <table className='table' id='myTable' ref={this.title}>
                            <thead className='text-left CategoriaTabla-Thead'>
                                <tr>
                                    <th className='tableClickeable' onClick={this.sortTable('Producto')}>
                                        Producto <i className='fas fa-sort'></i>
                                    </th>
                                    <th className='tableClickeable' onClick={this.sortTable('Precio')}>
                                        Precio <i className='fas fa-sort'></i>
                                    </th>
                                    <th className='tableClickeable' onClick={this.sortTable('Ganancia')}>
                                        Ganancia <i className='fas fa-sort'></i>
                                    </th>
                                    <th>Descripción</th>
                                    <th>Imagen</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            {this.state.productos &&
                                this.state.productos.length > 0 &&
                                this.state.productos.map((producto, index) => (
                                    <tbody className='text-left CategoriaTabla-Body' key={index}>
                                        <tr>
                                            <td>{producto.producto}</td>
                                            <td>{producto.precio}</td>
                                            <td>{producto.ganancia}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>
                                                <img src={producto.foto} className='imagenProducto' />
                                            </td>
                                            <td className={producto.estado == 'Pendiente' ? 'servicioPendiente' : ''}>
                                                {producto.estado}
                                            </td>
                                            <td>
                                                <button className='tableButton' onClick={this.delete(producto.uid)}>
                                                    <img src={Delete} />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                        </table>
                    </div>
                </div>

                <div className='modal fade' id='agregarProducto'>
                    <div className='modal-dialog modal-dialog-centered' role='document'>
                        <div className='modal-content Categoria-inputShadow Categoria-modal'>
                            <div className='text-center modal-header border-bottom-0'>
                                <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                    Agregar Productos
                                </h4>
                            </div>
                            <div className='row mb-3'></div>
                            <input
                                type='file'
                                id='file'
                                style={{ display: 'none' }}
                                onChange={(e) => this.onChangeFile(e)}
                            />
                            <label htmlFor='file' className='divFotoProducto' style={{ backgroundColor: '#6C3EFF' }}>
                                <img
                                    src={this.state.newFotoProducto ? this.state.newFotoProducto : fotoDefault}
                                    id='fotoProducto'
                                />
                            </label>
                            <div className='mx-5'>
                                <h2 className='Categoria-SubTitulo'>Nombre del producto</h2>
                                <form action=''>
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
                            <div className='row mb-3'></div>
                            <div className='mx-5'>
                                <h2 className='Categoria-SubTitulo'>Descripción del producto</h2>
                                <form action=''>
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
                            <div className='row mb-3'></div>
                            <div className='mx-5'>
                                <h2 className='Categoria-SubTitulo'>Precio</h2>
                                <form action=''>
                                    <input
                                        type='text'
                                        className='form-control text-muted '
                                        placeholder=''
                                        onChange={this.onChange}
                                        name='newPrecio'
                                        value={this.state.newPrecio}
                                    />
                                </form>
                                <div className='row mb-1'></div>
                                <p className='textGanancias'>
                                    Tu ganancia sería de<b className='ganancias'>${this.state.newGanancia}</b>
                                </p>
                            </div>
                            <h2 className='Categoria-Alerta-Rojo'>{isEmpty}</h2>

                            <div className='row text-center'>
                                <div className='columnBtnEliminarPerfil'>
                                    <button className='btn text-white Categoria-btnRosado' data-dismiss='modal'>
                                        Cancelar
                                    </button>
                                </div>

                                <div className='columnBtnEliminarPerfil'>
                                    <button
                                        className='btn text-white  Categoria-btnMorado'
                                        data-dismiss={isEmpty == '' ? 'modal' : ''}
                                        onClick={this.onSubmit}
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>

                            <div className='row text-center'>
                                <div className='columnBtnGuardarPerfil'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal fade' id='FiltrarModalProductos'>
                    <div className='modal-dialog modal-dialog-centered' role='document'>
                        <div className='modal-content Categoria-inputShadow Categoria-modal'>
                            <div className='text-center modal-header border-bottom-0'>
                                <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                    Filtrar producto
                                </h4>
                            </div>
                            <div className='row mb-3'></div>
                            <div className='mx-5'>
                                <h2 className='Categoria-SubTitulo'>Producto</h2>
                                <select
                                    name='newProducto'
                                    id=''
                                    className='form-control text-muted'
                                    aria-label='Buscar'
                                    onChange={this.onChange}
                                    value={this.state.newProducto}
                                >
                                    <option value=''></option>
                                    {this.state.opcProductos.map((producto) => (
                                        <option key={producto} value={producto}>
                                            {producto}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='row mb-3'></div>
                            <div className='mx-5'>
                                <h2 className='Categoria-SubTitulo'>Estado</h2>
                                <select
                                    name='newFiltroEstado'
                                    id=''
                                    className='form-control text-muted'
                                    aria-label='Buscar'
                                    onChange={this.onChange}
                                    value={this.state.newFiltroEstado}
                                >
                                    <option value=''></option>
                                    <option value='aprobado'>aprobado</option>
                                    <option value='Pendiente'>Pendiente</option>
                                </select>
                            </div>

                            <div className='row text-center'>
                                <div className='columnBtnEliminarPerfil'>
                                    <button
                                        className='btn text-white  Categoria-btnRosado'
                                        onClick={this.filterClear}
                                        data-dismiss='modal'
                                    >
                                        Limpiar
                                    </button>
                                </div>

                                <div className='columnBtnEliminarPerfil'>
                                    <button
                                        className='btn text-white Categoria-btnMorado'
                                        data-dismiss='modal'
                                        onClick={this.onFilter}
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
                    id='EliminarCategoria'
                    tabIndex='-1'
                    role='dialog'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                >
                    <div className='modal-dialog modal-dialog-centered' role='document'>
                        <div className='modal-content Categoria-inputShadow Categoria-modal'>
                            <div className='text-center modal-header border-bottom-0'>
                                <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                    Eliminar Categoría
                                </h4>
                            </div>
                            <form className='Categoria-form' onSubmit={this.onDelete}>
                                <div className='modal-footer'>
                                    <div className='row text-center'>
                                        <p>¿Está seguro que desea eliminar este servicio?</p>
                                        <div className='col-12'>
                                            <button
                                                type='submit'
                                                className='btn text-white px-5 py-2 mt-1 Categoria-btnMorado'
                                                data-toggle='modal'
                                                data-target='#exampleModal'
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/*} <div
          className="modal fade"
          id="ActualizarServicio"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >
            <div className="modal-content Categoria-inputShadow Categoria-modal">
              <div className="text-center modal-header border-bottom-0">
                <h4
                  className="w-100 Categoria-SubTitulo modal-title"
                  id="exampleModalLabel"
                >
                  Actualizar Servicio
                </h4>
              </div>
              <form
                className="Categoria-form"
                onSubmit={this.onUpdate}
              >
                <div className="modal-body px-5">
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Género:</label>
                    <select
                      name="genero"
                      id="genero"
                      required
                      defaultValue={this.state.genero}
                      onChange={this.onChangeLoadCategorias}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value={this.state.genero} selected disabled hidden>
                        {this.state.genero}
                      </option>
                      {generos.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Tipo de servicio:</label>
                    <select
                      name="tiposervicioOne"
                      id="tiposervicioOne"
                      required
                      defaultValue={tiposervicioOne}
                      onChange={this.onChange}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option
                        value={tiposervicioOne}
                        selected disabled hidden
                      >
                        {tiposervicioOne}
                      </option>
                      {tipoServicio.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Categorias:</label>
                    <select
                      name="categoria"
                      id="categoria"
                      required
                      defaultValue={categoria}
                      onChange={this.onChangeLoadproductos}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value={categoria} selected disabled>
                        {categoria}
                      </option>
                      {Categorias.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item.split(',')[0]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Servicio:</label>
                    <select
                      name="servicio"
                      id="servicio"
                      required
                      defaultValue={servicio}
                      onChange={this.onChange}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value={servicio} selected disabled>
                        {servicio}
                      </option>
                      {productos.map((item, index) => {
                        return (
                          <option key={index} value={item.nombre}>
                            {item.nombre}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Precio:</label>
                    <input
                      type="number"
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                      id="precio"
                      name="precio"
                      required
                      defaultValue={precio}
                      onChange={this.onChangeInt}
                      placeholder="Nombre"
                    />
                    <label className="small">
                      Tu ganancia seria de <span>$$$</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="row text-center">
                    <div className="col-6">
                      <button
                        className="btn text-white px-5 py-2 mt-1 Categoria-btnMorado"
                        data-dismiss="modal"
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
                        className="btn text-white px-5 py-2 mt-1 Categoria-btnMorado"
                        data-toggle="modal"
                        data-target="#exampleModal"
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          </div>*/}
            </>
        );
    }
}

export default Productos;
