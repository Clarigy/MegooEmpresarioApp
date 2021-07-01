import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Tiendas/Tiendas.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import { AuthContext } from '../../firebase/context';
import { Link } from 'react-router-dom';
import NoHayTiendas from '../../assets/images/containers/Tiendas/Tiendas.png';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';

export class Tiendas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            uid: '',
            isEmpty: false,
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
            });
        }, 1000);
        const items = [];

        const { user } = this.context;

        this.uidText = user['id'];

        this.setState({
            uid: this.uidText,
            isEmpty: false
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
                    items.push(doc.data());
                });
                this.setState({ items: items });
                if (this.state.items.length > 0) {
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
    };

    render() {
        const { loading } = this.state;

        this.fotoDefault =
            'https://firebasestorage.googleapis.com/v0/b/meegoapptest-98b27.appspot.com/o/foto%2Ftiendas%2FVector.png?alt=media&token=f25340c9-55c8-4e23-b100-ea7906115ce6';

        return (
            <>
                <GifLoader loading={loading} imageSrc={loadingImage} overlayBackground='rgba(219,219,219, .8)' />

                <div className='container-fluid'>
                    <div className='mx-0 mx-md- mx-lg-5 perfilContainer'>
                        <div className='row mb-5'></div>
                        <div className='DivHeaderTienda'>
                            <div className='Titulo-Tienda'>
                                <h2 className='Categoria-Titulo'>Tiendas</h2>
                            </div>
                            <div className='btnGuardarTiendas'>
                                <Link
                                    to={{
                                        pathname: '/CrearTienda',
                                        customObject: this.state.uid
                                    }}
                                >
                                    <button
                                        className='btn text-white Categoria-btnMorado'
                                        data-toggle='modal'
                                        data-target='#AgregarModal'
                                    >
                                        <i className='fa fa-plus mr-2'></i> Agregar
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='row mb-5'></div>
                    <div className='row mb-5'></div>

                    <div className='perfilContainer'>
                        {this.state.isEmpty ? (
                            <div className='columnNoTiendas centered'>
                                <img className='notTiendas' src={NoHayTiendas} />
                            </div>
                        ) : (
                            this.state.items &&
                            this.state.items.length > 0 &&
                            this.state.items.map((item) => (
                                <div key={item.uid} className='columnFotoTiendas'>
                                    <Link
                                        to={{
                                            pathname: '/NewTienda',
                                            customObject: item.uid,

                                            hash: '#' + item.nombre
                                        }}
                                    >
                                        <div
                                            className={
                                                item.fotoProveedor == this.fotoDefault
                                                    ? 'divFotoTiendasNew'
                                                    : 'divFotoTiendas'
                                            }
                                            style={
                                                item.fotoProveedor == this.fotoDefault
                                                    ? { backgroundColor: '#fff' }
                                                    : { backgroundColor: '#1A1446' }
                                            }
                                        >
                                            <img
                                                src={
                                                    item.fotoProveedor == undefined
                                                        ? this.fotoDefault
                                                        : item.fotoProveedor
                                                }
                                                id='fotoTiendas'
                                                className='text-cente'
                                            />
                                        </div>
                                        <h2 className='text-center Categoria-SubTitulo mb-0 mt-1'>{item.nombre}</h2>
                                        <h2 className='text-center Categoria-SubTitulo-Rojo mb-0 mt-1'>
                                            {item.aprobado == 'si' ? '' : 'Pendiente de aprobación'}
                                        </h2>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </>
        );
    }
}
Tiendas.contextType = AuthContext;
export default Tiendas;
