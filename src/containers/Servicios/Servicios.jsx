import React, { Component } from 'react';
import { db, storage } from '../../firebase';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../../assets/styles/containers/Servicios/Servicios.scss';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import ToolkitProvider, {
  Search
} from 'react-bootstrap-table2-toolkit';
import paginationFactory, {
  PaginationProvider
} from 'react-bootstrap-table2-paginator';
import $ from 'jquery';
import BootstrapTable from 'react-bootstrap-table-next';
import OpcionPag from '../../hooks/optionPaginacion';
import '../../assets/styles/Tablas/Tablas.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Delete from '../../assets/images/delete.png';
import Update from '../../assets/images/update.png';

const datatable = [];
export class Servicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTabla: [],
      idDataTabla: [],
      genero: '',
      categoria: '',
      servicio: '',
      tiposervicioOne: '',
      tienda: this.props.uid,
      precio: '',
      Categorias: [],
      Servicios: [],
      generos: ['Ambos', 'F', 'M'],
      tipoServicio: ['A domicilio', 'En mi local', 'Ambos'],
      idDelete: '',
      idUpdate: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeInt = this.onChangeInt.bind(this);
    this.onChangeLoadCategorias = this.onChangeLoadCategorias.bind(
      this
    );
    this.onChangeLoadServicios = this.onChangeLoadServicios.bind(
      this
    );
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }
  componentDidMount() {
    $('#HomeBtnSearchServicios').css('display', 'none');
    $('.react-bootstrap-table-pagination-list').removeClass(
      'col-md-6 col-xs-6 col-sm-6 col-lg-6'
    );
    $('.react-bootstrap-table-pagination-list').addClass(
      'col-2 offset-5 mt-4'
    );
    const datos = [];
    const IDDatos = [];

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
              datos.push(doc.data());
              IDDatos.push(doc.id);

          });
          this.setState({ dataTabla: datos, idDataTabla: IDDatos });
      })
      .catch(function (error) {
          console.log("Error getting documents: ", error);
      });


    setTimeout(() => {
      // this.setState({ loading: false });
      $('#HomeBtnSearchServicios').trigger('click');
    }, 1000);
  }
  MySearch = (props) => {
    let input;

    const handleClick = () => {
      props.onSearch(input.value);
      $('.react-bootstrap-table-pagination-list').removeClass(
        'col-md-6 col-xs-6 col-sm-6 col-lg-6'
      );
      $('.react-bootstrap-table-pagination-list').addClass(
        'col-2 offset-5 mt-4'
      );
    };
    const onChange = () => {
      props.onSearch(input.value);
      $('.react-bootstrap-table-pagination-list').removeClass(
        'col-md-6 col-xs-6 col-sm-6 col-lg-6'
      );
      $('.react-bootstrap-table-pagination-list').addClass(
        'col-2 offset-5 mt-4'
      );
    };
    return (
      <div className="row mb-5 mt-3">
        <div className="col-12 col-lg-4 align-self-center text-left">
          <h2 className="Categoria-Titulo mb-0 mt-1">Servicios</h2>
        </div>
        <div className="col colFiltrosContainer">
          <div className="row filtrosContainer">
          <div className='input-group mb-3 Categoria-inputShadow searchFilterBoxInput'>
            <div className='input-group-prepend'>
                <span className='input-group-text Categoria-Inputprepend' id='basic-addon1'>
                    <i className='fa fa-search text-muted'></i>
                </span>
            </div>
            <input
              type="text"
              className='form-control text-muted Categoria-Inputprepend-Input'
              ref={(n) => (input = n)}
              onChange={onChange}
              placeholder="Buscar"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
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
        

        {/*<div className="col-12 col-sm-6 col-lg-2 text-center text-md-left px-0">
          <button
            type="button"
            className="btn text-white px-5 py-3 px-md-4 py-md-2 mt-1 TablaTitulo-btnMorado"
            data-toggle="modal"
            data-target="#AgregarServicio"
            disabled={sessionStorage.getItem('Rol') == 'Consulta' ? true : false}
          >
            <i className="fa fa-plus mr-2" />
            Agregar
          </button>
    </div>*/}
      </div>
    );
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onChangeInt(e) {
    this.setState({
      [e.target.name]: parseInt(e.target.value)
    });
  }
  onChangeLoadCategorias(e) {
    const Catagorias = [];
    this.setState({
      [e.target.name]: e.target.value
    });
    setTimeout(() => {
      db.collection(`Categorias`)
        .where('genero', '==', this.state.genero)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            Catagorias.push(doc.data().nombre + ',' + doc.id);
          });
          this.setState({
            Categorias: Catagorias
          });
        });
    }, 500);
  }
  onChangeLoadServicios(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    const Servicios = [];
    setTimeout(() => {
      // console.log("Categoriaxxxx", this.state.categoria);
      db.collection(
        `Categorias/${this.state.categoria.split(',')[1]}/Servicios`
      )
        .get()
        .then((response) => {
          response.forEach((doc) => {
            Servicios.push(doc.data());
          });
          this.setState({
            Servicios: Servicios
          });
        });
    }, 200);
  }
  async onCreate(e) {
    e.preventDefault();
    const {
      categoria,
      genero,
      servicio,
      tiposervicioOne,
      precio
    } = this.state;
    const body = {
      servicio: servicio,
      precio: precio,
      genero: genero,
      tipo: tiposervicioOne,
      uidProveedor: sessionStorage.getItem('idTiendaAprobacion'),
      categoria: categoria.split(',')[0],
      planProveedor: 1,
      nombreProveedor: sessionStorage.getItem(
        'NombreTiendaAprobacion'
      ),
      latitud: sessionStorage.getItem('LatitudTiendaAprobacion'),
      longitud: sessionStorage.getItem('LongitudTiendaAprobacion'),
      categoriaMeego: 'Belleza'
    };
    await db.collection('Servicios').doc().set(body);
    window.location.reload(true);
  }
  async onDelete(e) {
    e.preventDefault();
    const { idDelete } = this.state;
    await db.collection(`Servicios`).doc(idDelete).delete();
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }
  async onUpdate(e) {
    e.preventDefault();
    const {
      categoria,
      genero,
      servicio,
      tiposervicioOne,
      precio,
      idUpdate
    } = this.state;
    await db
      .collection('Servicios')
      .doc(idUpdate)
      .update({
        categoria: categoria.split(',')[0],
        genero: genero,
        servicio: servicio,
        tipo: tiposervicioOne,
        precio: precio
      });
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }

  async onGetDocumentByID(id) {
    const Data = [];
    this.setState({ idUpdate: id });
    await db
      .collection(`Servicios`)
      .doc(id)
      .get()
      .then((response) => {
        // response.forEach((doc) => {
        //   Data.push(doc.data());
        // });
        this.setState({
          genero: response.data().genero,
          tiposervicioOne: response.data().tipo,
          categoria: response.data().categoria,
          servicio: response.data().servicio,
          precio: response.data().precio
        });
      });
  }

  render() {
    const columns = [
      {
        dataField: 'ID',
        text: 'ID',
        hidden: true,
        sort: true
      },
      {
        dataField: 'Servicio',
        text: 'Servicio',
        sort: true
      },
      {
        dataField: 'Precio',
        text: 'Precio',
        sort: true
      },
      {
        dataField: 'Ganancia',
        text: 'Ganancia',
        sort: true
      },
      {
        dataField: 'Género',
        text: 'Género'
      },
      {
        dataField: 'TipoServicio',
        text: 'Tipo de servicio'
      },
      {
        dataField: 'Categoría',
        text: 'Categoría'
      },
      {
        dataField: 'Accion',
        text: 'Acción',
        classes: 'text-center',
        headerClasses: 'text-center'
      }
    ];
    const {
      dataTabla,
      generos,
      tipoServicio,
      Categorias,
      Servicios,
      idDataTabla,
      genero,
      tiposervicioOne,
      categoria,
      servicio,
      precio
    } = this.state;
    datatable.length = 0;
    dataTabla.map((item, index) => {
      datatable.push({
        ID: index,
        Servicio: item.servicio,
        Precio: item.precio,
        Ganancia: Math.ceil(
          item.precio - parseInt(item.precio) * 0.15
        ),
        Género: item.genero,
        TipoServicio: item.tipo,
        Categoría: item.categoria,
        Accion: (
          <div>
            {(sessionStorage.getItem('Rol') == 'Consulta') || (sessionStorage.getItem('Rol') == 'Comercial') ? (
              <button disabled style={{ border: 'none' }}>
                <img
                  src={Delete}
                  style={{ opacity: 0.7 }}
                  alt="Eliminar"
                />
              </button>
            ) : (
              <a
                href="#EliminarCategoria"
                className="ml-2"
                data-toggle="modal"
                data-target="#EliminarCategoria"
                onClick={() =>
                  this.setState({
                    idDelete: idDataTabla[index]
                  })
                }
              >
                <img src={Delete} alt="Eliminar" />
              </a>
            )}
            {sessionStorage.getItem('Rol') == 'Consulta' ? (
              <button disabled style={{ border: 'none' }}>
                <img
                  src={Update}
                  style={{ opacity: 0.7 }}
                  alt="Eliminar"
                />
              </button>
            ) : ( 
            <a
              href="#ActualizarServicio"
              className="ml-3"
              data-toggle="modal"
              data-target="#ActualizarServicio"
              onClick={() =>
                this.onGetDocumentByID(idDataTabla[index])
              }
            >
              <img src={Update} alt="Eliminar" />
            </a>
            )}
          </div>
        )
      });
    });

    return (
      <>
        <div className="container-fluid">
          <div className="mx-0 mt-5">
            <ToolkitProvider
              keyField="ID"
              data={datatable}
              columns={columns}
              search={{ defaultSearch: ' ' }}
            >
              {(props) => (
                <div className="col-12">
                  <this.MySearch {...props.searchProps} />
                  <div className="col-12 mt-5">
                    <BootstrapTable
                      {...props.baseProps}
                      bootstrap4
                      bordered={false}
                      wrapperClasses="table-responsive"
                      classes="TablaEstilo"
                      bodyClasses="text-left TiendaTabla-Body"
                      headerWrapperClasses="text-left TiendaTabla-Thead"
                      rowClasses=""
                      pagination={paginationFactory(OpcionPag)}
                    />
                  </div>
                </div>
              )}
            </ToolkitProvider>
          </div>
        </div>

        <div
          className="modal fade"
          id="AgregarServicio"
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
                  Agregar Servicio
                </h4>
              </div>
              <form
                className="Categoria-form"
                onSubmit={this.onCreate}
              >
                <div className="modal-body px-5">
                  <div className="form-group text-left">
                    <label htmlFor="Nombre">Género:</label>
                    <select
                      name="genero"
                      id="genero"
                      required
                      onChange={this.onChangeLoadCategorias}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value="">Selecciona una opción</option>
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
                      onChange={this.onChange}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value="">Selecciona una opción</option>
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
                      onChange={this.onChangeLoadServicios}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value="">Selecciona una opción</option>
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
                      onChange={this.onChange}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value="">Selecciona una opción</option>
                      {Servicios.map((item, index) => {
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
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="EliminarCategoria"
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
                  className="w-100 Categoria-Titulo modal-title"
                  id="exampleModalLabel"
                >
                  Eliminar Categoría
                </h4>
              </div>
              <form
                className="Categoria-form"
                onSubmit={this.onDelete}
              >
                <div className="modal-footer">
                  <div className="row text-center">
                    <p>
                      ¿Está seguro que desea eliminar este servicio?
                    </p>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn text-white px-5 py-2 mt-1 Categoria-btnMorado"
                        data-toggle="modal"
                        data-target="#exampleModal"
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

        <div
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
                      defaultValue={genero}
                      onChange={this.onChangeLoadCategorias}
                      className="form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder"
                    >
                      <option value={genero} selected disabled hidden>
                        {genero}
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
                      onChange={this.onChangeLoadServicios}
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
                      {Servicios.map((item, index) => {
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
        </div>
      </>
    );
  }
}

export default Servicios;
