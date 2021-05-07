import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tiendas/Tiendas.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { AuthContext } from '../../firebase/context';
import { Link } from "react-router-dom";
import NoHayTiendas from "../../assets/images/containers/Tiendas/Tiendas.png"
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';



export class Tiendas extends Component {



    constructor(props) {


        super(props);

        this.state = {
            items: [],
            uid: "",
            isEmpty: "",
            loading: true
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
        const items = [];



        const { user } = this.context;

        this.uidText = user["id"];

        this.setState({
            uid: this.uidText,
            isEmpty: ""
        });


        const db = firebaseConfig.firestore();
        //let docRef = db.collection("TiendasTest").doc(user["id"]);
        let docRef = db.collection("TiendasTest").where("uid", "==", user["id"])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    items.push(doc.data());

                });
                this.setState({ items: items });
                console.log(this.state.items)
                if (this.state.items.length > 0){
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
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });



    }


    render() {
        const { loading } = this.state;

        this.fotoDefault = "https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6"
        console.log(this.state.uid)

 


        return (
            <>
                <GifLoader
                    loading={loading}
                    imageSrc={loadingImage}
                    overlayBackground="rgba(219,219,219, .8)"
                />

                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-5 perfilContainer'>
                        <div className='row mb-5' ></div>
                        <div className='DivHeader'>
                            <div className='Titulo-Tienda'>
                                <h2 className='Categoria-Titulo'>Tiendas</h2>
                            </div>
                            <div className='btnGuardarTiendas'>
                                <Link to={{
                                    pathname: "/CrearTienda",
                                    customObject: this.state.uid

                                }} >
                                    <button className='btn text-white Categoria-btnMorado'
                                        data-toggle='modal'
                                        data-target='#AgregarModal'>
                                        <i className='fa fa-plus mr-2'></i> Agregar
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className='row mb-5' ></div>
                        <div className='row mb-5' ></div>
                    </div>

                    <div className="tiendasContainer">
                            {this.state.isEmpty ? (
                                <div className="columnNoTiendas">
                                    <img className="notTiendas" src={NoHayTiendas} />

                                </div>
                            ):( this.state.items && this.state.items.length > 0 && this.state.items.map(item => (

                                    <div className="columnFotoTiendas">
                                        <Link to={{
                                            pathname: "/NewTienda",
                                            customObject: this.state.uid + "-" + item.nombre,
                                            hash: "#" + item.nombre,
    
                                        }} >
                                             <div className={item.foto == this.fotoDefault ? "divFotoTiendasNew" : "divFotoTiendas"} style={item.foto == this.fotoDefault ? {backgroundColor: "#fff"} : {backgroundColor: "#1A1446"} }>
                                            <img src={item.fotosTienda[0] == undefined ?  this.fotoDefault : item.fotosTienda[0]} id="fotoTiendas" className='text-cente' />
                                            </div>
                                            <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>
                                            <h2 className='text-center Categoria-SubTitulo-Rojo mb-0 mt-1'>{item.aprobado ? "" : "Pendiente de aprobación"}</h2>
                                        </Link>
    
                                    </div>
                                )
                            ))}
                        </div>
                    
                </div>
                
            </>
        )
            ;
    }
}
Tiendas.contextType = AuthContext;
export default Tiendas;
