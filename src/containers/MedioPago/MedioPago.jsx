import React, { Component } from 'react';
import '../../assets/styles/containers/AprobacionTiendas/Tienda.scss';
import '../../assets/styles/Tablas/Tablas.scss';

import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import DropZone from '../../components/Dropzone/DropZone.js';
import firebaseConfig from '../../firebase/setup.jsx';
import { db, storage } from '../../firebase';

const imageMaxSize = 2000000; // 2mb
const imageTypeFile = ['image/png', 'image/jpeg', 'application/pdf'];
class MedioPago extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datosMedioPago: [],
            numNequi: '',
            certificado: '',
            nombreDocumento: '',
            loading: true,
            medioPagoCertificado: true,
            newEstado: 'Pendiente',
            estado: '',
            tienda: this.props.uid,
            fotosDrop: [],
            fotosTienda: []
        };
        this.onChange = this.onChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
        // this.onUpdate = this.onUpdate.bind(this);
        //this.onDropImage = this.onDropImage.bind(this);
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    async componentDidMount() {
        const datosMedioPago = [];
        const IDDatos = [];

        db.collection(`/Tiendas/${this.state.tienda}/medioPago`)
            .doc('Nequi')
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log('MEDIO PAGO', doc.data().numNequi);
                    this.setState({
                        numNequi: doc.data().numNequi,
                        nombreDocumento: doc.data().nombreDocumento,
                        certificado: doc.data().certificado,
                        medioPagoCertificado: false,
                        estado: doc.data().estado
                    });
                }
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });
    }

    async onCreate(e) {
        e.preventDefault(); //previene que la página se haga F5
        const db = firebaseConfig.firestore();
        let urlFotosArray = this.state.fotosTienda;

        if (this.state.fotosDrop[0]) {
            for (var i = 0; i < this.state.fotosDrop.length; i++) {
                const nombreImagen = this.state.fotosDrop[i].name;

                const file = this.state.fotosDrop[i];
                console.log('CERTIFICADO', file);
                const storageRef = firebaseConfig.storage().ref();
                const fileRef = storageRef.child(
                    '/foto/tienda/' + this.state.tienda + '/' + this.state.name + '/' + nombreImagen
                );
                fileRef.put(file).then(() => {
                    console.log('Upload a file');
                    storageRef
                        .child('/foto/tienda/' + this.state.tienda + '/' + this.state.name + '/' + nombreImagen)
                        .getDownloadURL()
                        .then(async (url) => {
                            console.log('URL', url);
                            urlFotosArray = url;
                            console.log(urlFotosArray);
                            db.collection(`/Tiendas/${this.state.tienda}/medioPago`)
                                .doc('Nequi')
                                .set({
                                    certificado: urlFotosArray,
                                    estado: this.state.newEstado,
                                    numNequi: this.state.numNequi,
                                    nombreDocumento: nombreImagen
                                })
                                .catch(function (error) {
                                    console.error('Error adding document: ', error);
                                });
                        })
                        .catch((err) => console.error(err));
                });
            }

            this.setState({ arrTienda: urlFotosArray, fotosStatus: fotosStatusArray, fotosDrop: [] });
        }
    }
    // async onUpdate(e) {
    //     e.preventDefault(); //previene que la página se haga F5
    //     const db = firebaseConfig.firestore();
    //     let urlFotosArray = this.state.fotosTienda;
    //     let fotosStatusArray = this.state.fotosStatus;

    //     if (this.state.fotosDrop[0]) {
    //         for (var i = 0; i < this.state.fotosDrop.length; i++) {
    //             const nombreImagen = this.state.fotosDrop[i].name;

    //             const file = this.state.fotosDrop[i];
    //             console.log('CERTIFICADO', file);
    //             const storageRef = firebaseConfig.storage().ref();
    //             const fileRef = storageRef.child(
    //                 '/foto/tienda/' + this.state.tienda + '/' + this.state.name + '/' + nombreImagen
    //             );
    //             fileRef.put(file).then(() => {
    //                 console.log('Upload a file');
    //                 storageRef
    //                     .child('/foto/tienda/' + this.state.tienda + '/' + this.state.name + '/' + nombreImagen)
    //                     .getDownloadURL()
    //                     .then(async (url) => {
    //                         console.log('URL', url);
    //                         urlFotosArray = url;
    //                         fotosStatusArray.push('Pendiente aprobación');
    //                         console.log(urlFotosArray);
    //                         db.collection(`/Tiendas/${this.state.tienda}/medioPago`)
    //                             .doc('Nequi')
    //                             .set({
    //                                 certificado: urlFotosArray,
    //                                 estado: this.state.newEstado,
    //                                 numNequi: this.state.numNequi,
    //                                 nombreDocumento: this.state.nombreDocumento
    //                             })
    //                             .catch(function (error) {
    //                                 console.error('Error adding document: ', error);
    //                             });
    //                     })
    //                     .catch((err) => console.error(err));
    //             });
    //         }

    //         this.setState({ arrTienda: urlFotosArray, fotosStatus: fotosStatusArray, fotosDrop: [] });
    //     }
    // }

    deleteDropFoto(i) {
        return () => {
            this.state.fotosDrop.splice(i, 1);
            this.setState({
                fotosDrop: this.state.fotosDrop
            });
        };
    }

    drop = (e) => {
        this.setState(
            {
                fotosDrop: e
            },
            () => {
                if (this.state.fotosDrop[0]) {
                    for (var i = 0; i < this.state.fotosDrop.length; i++) {
                        const nombreImagen = this.state.fotosDrop[i].name;
                        this.setState({
                            nombreDocumento: nombreImagen
                        });
                    }
                }
            }
        );
    };
    render() {
        return (
            <>
                <div className='container-fluid'>
                    <div className='mx-0 mx-md-2 mt-5'>
                        <div className='row'>
                            <div className='col-12' style={{ height: '50px' }}></div>
                            <div className='col-12 col-md-6 text-left'>
                                <h5 className='Categoria-Titulo mb-0 mt-1'>Medio de pago</h5>
                            </div>
                        </div>
                        <div className='row mt-5'></div>
                        <div className='row'>
                            <div className='col p-0'>
                                <div className='row form-group'>
                                    <div className='col-12'>
                                        <div className='form-group text-left'>
                                            <label htmlFor='numNequi' style={{ color: '#1A1446' }}>
                                                Número de cuenta Nequi:
                                            </label>
                                            <input
                                                type='text'
                                                name='numNequi'
                                                id='numNequi'
                                                placeholder='Número de cuenta'
                                                className='form-control Tienda-InputStyle'
                                                // value={numNequi}
                                                defaultValue={this.state.numNequi}
                                                onChange={this.onChange}
                                                required
                                            />
                                        </div>
                                        <div className='form-group text-left mt-5'>
                                            <label htmlFor='' style={{ color: '#1A1446' }}>
                                                Cargar Certificado:
                                            </label>
                                            <div className='columnDescripcion'>
                                                <DropZone
                                                    id='myDropzoneElementID'
                                                    funcDrop={this.drop}
                                                    funcRemove={this.deleteDropFoto}
                                                />
                                            </div>

                                            <div className='col-12  mb-4 '>
                                                <h2 className='Categoria-SubTitulo'>{this.state.nombreDocumento}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <button
                                        className='btn text-white px-4 py-2 Tienda-FontSpartan Tienda-btnMorado btnFull'
                                        disabled={sessionStorage.getItem('Rol') == 'Consulta' ? true : false}
                                        onClick={this.onCreate}
                                    >
                                        {/* Aprobar Tienda */}
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default MedioPago;
