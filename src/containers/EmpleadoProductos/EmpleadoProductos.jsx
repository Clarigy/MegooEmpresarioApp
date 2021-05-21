import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/EmpleadoProductos/EmpleadoProductos.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { Redirect } from 'react-router-dom';
import InfoTienda from '../../assets/images/components/Iconos/icono_informacion_tienda_noPress.svg';
import Servicios from '../../assets/images/components/Iconos/icono_servicios.svg';
import Productos from '../../assets/images/components/Iconos/icono_productos_press.svg';
import { Link } from "react-router-dom";




export class EmpleadoProductos extends Component {

    constructor(props) {



        super(props);
        this.state = {
            name: "",

            uid: this.props.uid,
            foto: "",
            tienda: "",
            productos: [],
            checkbox: [],
            newGanancia: []
        };

    }



    componentDidMount = async () => {
        const productos = [];

        const db = firebaseConfig.firestore();
        let docRef = await db.collection("EmpleadosTest").doc(this.state.uid);
        //let docRef = db.collection("Perfil").doc(user["id"]);

        docRef.get().then(doc => {
            if (doc.exists) {
                if(doc.data()["checkBox"] != undefined){
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["fotoPerfil"],
                    tienda: doc.data()["tienda"],
                    checkbox: doc.data()["checkBox"]
                });

            }
            else{
                this.setState({
                    name: doc.data()["nombre"],
                    foto: doc.data()["fotoPerfil"],
                    tienda: doc.data()["tienda"],
                    checkbox: []
                });

            }


                db.collection("ProductosTest").where("tienda", "==", this.state.tienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            productos.push(doc.data());
                        });
                        this.setState({
                            productos: productos
                        });

                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });



            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });






    }

    onChangeGanancia  = e => {
        const checkbox = this.state.checkbox
        const ganancias = this.state.newGanancia

        var checkboxLenght = ""

        if (checkbox.length == 0){
            var temp = ganancias.some(v => (v.producto === e.target.name))
            console.log("CAMBIO GANANCIA", temp)
            console.log("GANANCIA", ganancias[i])
            if(temp){
                for (var j = 0; j < ganancias.length; j++){
                    if(ganancias[j].producto == e.target.name){
                        ganancias.splice(j, 1);
                        var obj ={
                            producto: e.target.name,
                            ganancia: e.target.value
                        }
                        ganancias.push(obj)
                    }
                }
                
                }else{
                        var obj ={
                            producto: e.target.name,
                            ganancia: e.target.value
                        }
                        ganancias.push(obj)
                }

        }else{
           checkboxLenght = checkbox.length
           for (var i = 0; i < checkboxLenght; i++) {

            console.log("GANANCIA", checkbox)
            if (e.target.name == checkbox[i].producto) {
                checkbox[i].ganancia = e.target.value
            }
            else{
                var temp = ganancias.some(v => (v.producto === e.target.name))
                console.log("CAMBIO GANANCIA", temp)
                console.log("GANANCIA", ganancias[i])
                if(temp){
                    for (var j = 0; j < ganancias.length; j++){
                        if(ganancias[j].producto == e.target.name){
                            ganancias.splice(j, 1);
                            var obj ={
                                producto: e.target.name,
                                ganancia: e.target.value
                            }
                            ganancias.push(obj)
                        }
                    }
                    
                    }else{
                            var obj ={
                                producto: e.target.name,
                                ganancia: e.target.value
                            }
                            ganancias.push(obj)
                    }
                }   
                
                console.log("CAMBIO GANANCIA", ganancias)
            }
        }
        console.log("lenght", checkboxLenght)
   


        this.setState({
            checkbox: checkbox,
            newGanancia: ganancias
        })

        this.onSubmit();

    }


    onChange = e => {
        const checkbox = this.state.checkbox


     


        for (var i = 0; i < checkbox.length; i++) {
            if (e.target.value == checkbox[i].producto) {
                this.old = true
                checkbox.splice(i, 1);
                break;
            } else {
                this.old = false
            }
        }
        if (!this.old) {
            var obj = this.state.newGanancia.find(v => (v.producto === e.target.value))
            checkbox.push(obj)
        }


        this.setState({
            checkbox: checkbox
        })

        this.onSubmit();

    }

    onSubmit = async () => {


        const db = firebaseConfig.firestore();



        await db.collection("EmpleadosTest").doc(this.state.uid).update({
            "checkBox": this.state.checkbox,
        });




    }


    exit = e => {

        this.setState({
            uid: undefined
        })

    }

getGanancia(v){
    var ganancia = "";
    for(var i=0; i<this.state.checkbox.length; i++){
        var item = this.state.checkbox[i]
        if(v=== item.producto){
            ganancia = item.ganancia;
            break;
        }
    }

    return ganancia;
}




    render() {






        this.fotoDefault = "https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6"



        if (this.state.uid == undefined) {
            return (
                <>
                    <Redirect to={{
                        pathname: "/Equipo",
                        customObject: this.state.uid,
                    }} />
                </>
            )
        } else {
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-5 containerDivInfoTienda'>

                            <div className='row mb-5' ></div>

                            <h2 className="Categoria-Titulo columnInfoTiendas">Productos</h2>
                            <div className='row mb-5' ></div>
                            <div className='row mb-5' ></div>

                            <div className='row'>
                            <div className='col-12 table-responsive'>
                                <table className='table' >
                                    <thead className='text-left '>
                                        <tr>
                                            <th className= "tableContent">Producto</th>
                                            <th>Precio</th>
                                            <th>Ganancia</th>
                                            <th>Acción</th>                                                  
                                        </tr>
                                    </thead>


                                    {this.state.productos && this.state.productos.length > 0 && this.state.productos.map((producto, i) => (
                                            
                                        <tbody className='text-left CategoriaTabla-Body' >
                                            <tr>
                                                <td>{producto.producto}</td>
                                                <td>{producto.ganancia}</td>
                                                <td>
                                                    <input
                                                    type='text'
                                                    className='form-control text-muted '
                                                    placeholder=''
                                                    aria-label='Username'
                                                    onChange={this.onChangeGanancia}
                                                    name={producto.producto}
                                                    defaultValue= {this.getGanancia(producto.producto)}
                                                   
                                                    />
                                                </td>
                                                <td>
                                                    <label className="containerCheck">
                                                        <input
                                                            defaultChecked={this.state.checkbox.some(v => (v.producto === producto.producto))}
                                                            name="checkbox"
                                                            type="checkbox"
                                                            value={producto.producto}
                                                            className=""
                                                            onChange={this.onChange} />
                                                        <span className="checkBoxProxima"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        {/*<div className='col-12 table-responsive'>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.producto}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                                <h2 className="productosList">{producto.precio}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                            <h2 className="productosList">{producto.ganancia}</h2>
                                            </div>
                                            <div className="columnDatos text-center">
                                            <label className="containerCheck">
                                                    <input
                                                        defaultChecked={this.state.checkbox.some(v => (v === producto.producto))}
                                                        name="checkbox"
                                                        type="checkbox"
                                                        value={producto.producto}
                                                        className=""
                                                        onChange={this.onChange} />
                                                    <span className="checkBoxProxima"></span>
                                                    </label>
                                            </div>
                                            <br />
                                            <div className='row mb-3' ></div>
                                    </div>*/}
                                        </tbody>

                                    ))}
                                    </table>
                                    </div>
                            </div>
                            <div className='row mb-5' ></div>










                        </div>

                        
                    </div>
                </>
            )
        }
        ;
    }
}

export default EmpleadoProductos;