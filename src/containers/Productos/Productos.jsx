import React, { Component } from 'react';
import { db, storage } from '../../firebase';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

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
import firebaseConfig from "../../firebase/setup.jsx";
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { multiSelectFilter } from 'react-bootstrap-table2-filter';

const datatable = [];
export class Productos extends Component {
  constructor(props) {
    super(props);
    this.title= React.createRef(),
    this.state = {
      dataTabla: [],
      dataTable: [],
      idDataTabla: [],
      genero: '',
      categoria: '',
      servicio: '',
      tiposervicioOne: '',
      newDescripcion: "",
      newGanancia: 0,
      newImagen: "",
      newPrecio: 0,
      newProducto: "",
      newFotoProducto: "",
      otro: "",
      newEstado: "Pendiente",
      tienda: this.props.uid,
      precio: '',
      Categorias: [],
      sort: {
        column: null,
        direction: 'desc',
      },
      Servicios: [],
      generos: ['Ambos', 'F', 'M'],
      tipoServicio: ['A domicilio', 'En mi local', 'Ambos'],
      idDelete: '',
      idUpdate: '',
      buscar: "",
      newFiltroEstado: "",

    };
   
  }
  componentDidMount() {
    $('#HomeBtnSearchServicios').css('display', 'none');
    $('.react-bootstrap-table-pagination-list').removeClass(
      'col-md-6 col-xs-6 col-sm-6 col-lg-6'
    );
    $('.react-bootstrap-table-pagination-list').addClass(
      'col-2 offset-5 mt-4'
    );
      

    this.fetchInfo();





    setTimeout(() => {
      // this.setState({ loading: false });
      $('#HomeBtnSearchServicios').trigger('click');
    }, 1000);

  }

  sortTable = (column) => (e) =>  {

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
      } else if (column === 'Precio')  {

        return a.precio - b.precio;
        
      }else if(column === 'Ganancia'){

        return a.ganancia - b.ganancia;

      }else {
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
        direction,
      }
    });


    
   

  }
  delete(uid) {
    return () => {
        const productos = [];

        const db = firebaseConfig.firestore();


        db.collection('ProductosTest').doc(uid).delete();



        db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    productos.push(doc.data());

                });
                this.setState({ productos: productos });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
            this.fetchInfo();
    }
    
}

  fetchInfo(){
    const productos = [];
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


    db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                productos.push(doc.data());

            });
            this.setState({ productos: productos, productosDefault: productos, dataTable: productos});
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

  }
  onSubmit = async () => {

    const productos = [];


        const db = firebaseConfig.firestore();

        await db.collection("ProductosTest").add({
            descripcion: this.state.newDescripcion,
            estado: this.state.newEstado,
            ganancia: this.state.newGanancia,
            imagen: this.state.newImagen,
            precio: this.state.newPrecio,
            producto: this.state.newProducto,
            tienda: this.state.tienda,
            imagen: this.state.newFotoProducto

        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                db.collection("ProductosTest").doc(docRef.id).update({
                    uid: docRef.id

                })



            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

        await db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    productos.push(doc.data());

                });
                this.setState({ productos: productos });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        this.fetchInfo();
}
  
  onChange =  e => {
      this.setState({
          [e.target.name]: e.target.value
      });


 

    console.log(e.target.value)
     this.setState({
      newGanancia: (this.state.newPrecio - (this.state.newPrecio/100)*15)
  })
  }

  onChangeFile = (e) => {

    const { user } = this.context;

    const file = e.target.files[0];

    const storageRef = firebaseConfig.storage().ref();
    const fileRef = storageRef.child('/foto/productos/' + this.state.tienda + '/' + file.name);
    fileRef.put(file).then(() => {
        console.log("Upload a file")
        storageRef.child('/foto/productos/' + this.state.tienda + '/' + file.name).getDownloadURL()
            .then((url) => {

                this.setState({
                    newFotoProducto: url,
                });


            });


    })



}

  onSearch =  e =>{
    this.setState({
      [e.target.name]: e.target.value
    });
    let searchResult = [];
    console.log("SI ESTAAAAAAA")
    console.log(e.target.value)

    var i = 0;
    var j = 0;
    var searchValue = e.target.value.toUpperCase();
    console.log(this.state.productos.length)

    if (searchValue != ""){
      for (i = 0; this.state.productos.length > i; i++){
        var item = this.state.productos[i]

        if(item.descripcion.toUpperCase().includes(searchValue) || 
        item.estado.toUpperCase().includes(searchValue) ||
        item.producto.toUpperCase().includes(searchValue) ){
          console.log("SI ESTAAAAAAA")
          searchResult[j] = item;
          j = j +1;

      }
    }
    this.setState({
      productos : searchResult
    });
    console.log("Finallllllll", searchResult)  
  } else {
    this.fetchInfo()
  }
}


onFilter = async () =>{
    var filterResult = [];
    console.log("SI ESTAAAAAAA")
    console.log("INICIO", this.state.dataTable.length)

    var i = 0;
    var j = 0;

    if ( this.state.newProducto != ""){
      console.log("SI newTipoServicio")
      for (i = 0; this.state.dataTable.length > i; i++){
        
        var item = this.state.dataTable[i]
        console.log("INICIO", this.state.dataTable[i])

        console.log("SI newTipoServicio", item.producto)
        console.log("SI newTipoServicio", this.state.newProducto)

        if(item.producto == this.state.newProducto){
          console.log("SI ESTAAAAAAA newTipoServicio")
          filterResult[j] = item;
          j = j +1;

        }
      }
    }
    console.log("Valor= ", j) 
    if ( this.state.newFiltroEstado != ""){
      console.log("SI newEstado")
      for (i = 0; this.state.dataTable.length > i; i++){
        var item = this.state.dataTable[i]
        console.log("SI Estado", item.estado)
        console.log("SI newEstado", this.state.newFiltroEstado)

        if(item.estado == this.state.newFiltroEstado){
          console.log("SI ESTAAAAAAA newEstado")
          filterResult[j] = item;
          j = j +1;
        }
      }
    } 
    
    console.log("Valor= ", j) 
    if (this.state.newProducto == ""  && 
    this.state.newFiltroEstado == ""){
        this.fetchInfo()
      }

      console.log("Finallllllll", filterResult) 
      console.log("Valor= ", j) 
    this.setState({
      productos : filterResult
    });

    filterResult = []
    console.log("Finallllllll", filterResult)  
 
}

  

  
  render() {

    return (
      <>
        <div className="row mb-5 mt-3">
            <div className="col-12 col-lg-4 align-self-center text-left">
                <h2 className="Categoria-Titulo mb-0 mt-1">Productos</h2>
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
                        type="text"
                        className='form-control text-muted Search-Inputprepend-Input'
                        name = "buscar"
                        onChange={this.onSearch}
                        placeholder="Buscar"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                
                        />
                    </div>
                    <div >
                        <button className='btn text-white Categoria-btnMorado mx-1'
                            data-toggle='modal'
                            data-target='#FiltrarModalProductos'
                            >
                            <i className='fa fa-filter mr-2'></i> Filtrar
                        </button>
                    </div>
                    <div >
                        <button className='btn text-white Categoria-btnMorado'
                            data-toggle='modal'
                            data-target='#agregarProducto'>
                            <i className='fa fa-plus mr-2'></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>      


        <div className='row mt-5'>
            <div className='col-12 table-responsive tableScrollVertical'>
                <table className='table' id='myTable' ref={this.title}>
                    <thead className='text-left CategoriaTabla-Thead'>
                        <tr>

                            <th className="tableClickeable" onClick={this.sortTable('Producto')}>
                            Producto <i class="fas fa-sort"></i>
                            </th>
                            <th className="tableClickeable" onClick={this.sortTable('Precio')}>
                                Precio <i class="fas fa-sort"></i>
                            </th>
                            <th className="tableClickeable" onClick={this.sortTable('Ganancia')}>
                                Ganancia <i class="fas fa-sort"></i>
                            </th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    {this.state.productos && this.state.productos.length > 0 && this.state.productos.map((producto) => (


                        <tbody className='text-left CategoriaTabla-Body'>
                            <tr>
                                <td >{producto.producto}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.ganancia}</td>
                                <td>{producto.descripcion}</td>
                                <td><img src={producto.imagen} className="imagenProducto" /></td>
                                <td className={producto.estado == "Pendiente" ? "servicioPendiente" : ""}>{producto.estado}</td>
                                <td >
                                <button className="tableButton" onClick={this.delete(producto.uid)}><img src={Delete} /></button>
                                <button className="tableButton" onClick={this.delete(producto.uid)}><img src={Update} /></button>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>

        <div
            className='modal fade'
            id='agregarProducto'
        >
            <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content Categoria-inputShadow Categoria-modal'>
                    <div className='text-center modal-header border-bottom-0'>
                        <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                            Agregar Productos
                        </h4>
                    </div>
                    <div className='row mb-3' ></div>
                    <input type="file" id="file" style={{ display: "none" }}
                        onChange={(e) => this.onChangeFile(e)} />
                    <label htmlFor="file" className="divFotoProducto" style={{ backgroundColor: "#6C3EFF" }}>

                        <img src={this.state.newFotoProducto} id="fotoProducto" />

                    </label>
                    <div className='mx-5'>

                        <h2 className='Categoria-SubTitulo'>Nombre del producto</h2>
                        <form action="">
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
                    <div className='row mb-3' ></div>
                    <div className='mx-5'>
                        <h2 className='Categoria-SubTitulo'>Descripción del producto</h2>
                        <form action="">
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



        
        <div
            className='modal fade'
            id='FiltrarModalProductos'
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
                            <option value='Cabello'>Cabello</option>
                            <option value='Manos'>Manos</option>
                            <option value='Maquillaje'>Maquillaje</option>

                            </select>
                        </div>
                        <div className='row mb-3' ></div>
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
                                onClick={this.onFilter}

                                >
                                Agregar
                                </button>
                            </div>
                        </div>
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
