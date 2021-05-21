import React, { Component } from 'react';
import '../../assets/styles/containers/AprobacionTiendas/Tienda.scss';
import '../../assets/styles/Tablas/Tablas.scss';

import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import DropZone from "../../components/Dropzone/DropZone.js";
import firebaseConfig from "../../firebase/setup.jsx";
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
            certificadoName: '',
            loading: true,
            file: [],
            medioPagoCertificado: true,
            newEstado: "Pendiente",
            tienda: this.props.uid,
            fotosDrop: "",
            fotosDropPreview: [],
            fotosTienda: [],
            fotosStatus: [],
            arrTienda: [],
            fotosDrop: [],
            fotosDropPreview: [],
            fotosTienda: [],
            fotosStatus: [],
            arrTienda: [],
    
        };
        this.onChange = this.onChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
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
        console.log("holaaa")

        db.collection("MedioPagoTest").where("tienda", "==", this.state.tienda)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              datosMedioPago.push(doc.data());
              IDDatos.push(doc.id);

          });
          this.setState({ MedioPago: datosMedioPago, idDataTabla: IDDatos, dataTable: datosMedioPago });
      })
      .catch(function (error) {
          console.log("Error getting documents: ", error);
      });
  }
        
    
    
    async onCreate(e) {
        e.preventDefault(); //previene que la página se haga F5
        const { numNequi, file } = this.state;
        const archivo = file[0];
        const db = firebaseConfig.firestore();
        let urlFotosArray = this.state.fotosTienda;
        let fotosStatusArray = this.state.fotosStatus;

        

        await db.collection("MedioPagoTest").add({
            Fotos: this.state.fotosTienda,
            Estado: this.state.newEstado,
            Nequi: this.state.numNequi,
            tienda: this.state.tienda
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                db.collection("MedioPagoTest").doc(docRef.id).update({
                    uid: docRef.id
    
                })
    
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

            if (this.state.fotosDrop[0]) {
                for (var i = 0; i < this.state.fotosDrop.length; i++) {
                    const nombreImagen = this.state.fotosDrop[i].name;
    
                    const file = this.state.fotosDrop[i];
                    const storageRef = firebaseConfig.storage().ref();
                    const fileRef = storageRef.child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen);
                    fileRef.put(file).then(() => {
                        console.log('Upload a file');
                        storageRef
                            .child('/foto/tienda/' + this.state.uid + '/' + this.state.name + '/' + nombreImagen)
                            .getDownloadURL()
                            .then(async (url) => {
                                urlFotosArray.push(url);
                                fotosStatusArray.push("Pendiente aprobación")
                                await db.collection("TiendasTest").doc(this.state.uid + "-" + this.state.nameold).update({
                                    fotosStatus: fotosStatusArray,
                                    fotosTienda: urlFotosArray
                                });
                            })
                            .catch((err) => console.error(err));
                    });
                }
    
    
    
                this.setState({
                    fotosDrop: []
                })
                
    
                this.setState({ arrTienda: urlFotosArray, fotosStatus: fotosStatusArray });

        /*const storageRef = storage
            .ref(`documentos/Medio de pago/${sessionStorage.getItem('idTiendaAprobacion')}/${archivo.name}`)
            .put(archivo);
        storageRef.on(
            'State_changed',
            (snapshot) => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref(`documentos/Medio de pago/${sessionStorage.getItem('idTiendaAprobacion')}`)
                    .child(archivo.name)
                    .getDownloadURL()
                    .then((url) =>
                        db
                            .collection(`Tiendas`)
                            .doc(`${sessionStorage.getItem('idTiendaAprobacion')}`)
                            .collection('medioPago')
                            .doc('Nequi')
                            .set({
                                certificado: url,
                                nombreDocumento: archivo.name,
                                numNequi
                            })
                    );

                setTimeout(() => {
                    window.location.reload(true);
                }, 1500);
            }
        );*/
    }
}
    async onUpdate(e) {
        e.preventDefault(); //previene que la página se haga F5
        const { numNequi, file, certificado } = this.state;
        const archivo = file[0];


            /*const db = firebaseConfig.firestore();
            var batch = db.batch();

            let newUserRef = db.collection("MedioPagoTest").where("tienda", "==", this.state.tienda);
            console.log("refffff",newUserRef)
            batch.update(newUserRef, {
                "Nequi": this.state.numNequi,
                "Estado": this.state.newEstado,
                "Fotos": this.state.fotosDrop,
            });
            batch.commit();+/







        /*if (file.length == 0) {
            db.collection(`Tiendas`)
                .doc(`${sessionStorage.getItem('idTiendaAprobacion')}`)
                .collection('medioPago')
                .doc('Nequi')
                .update({
                    numNequi
                });
            setTimeout(() => {
                window.location.reload(true);
            }, 1500);
        } else {
            storage.refFromURL(certificado).delete(); //Se elimina la imagen anterior para actualizarla
            const storageRef = storage
                .ref(`documentos/Medio de pago/${sessionStorage.getItem('idTiendaAprobacion')}/${archivo.name}`)
                .put(archivo);
            storageRef.on(
                'State_changed',
                (snapshot) => {},
                (error) => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref(`documentos/Medio de pago/${sessionStorage.getItem('idTiendaAprobacion')}`)
                        .child(archivo.name)
                        .getDownloadURL()
                        .then((url) =>
                            db
                                .collection(`Tiendas`)
                                .doc(`${sessionStorage.getItem('idTiendaAprobacion')}`)
                                .collection('medioPago')
                                .doc('Nequi')
                                .set({
                                    certificado: url,
                                    nombreDocumento: archivo.name,
                                    numNequi
                                })
                        );

                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1500);
                }
            );
        }*/
    }

    deleteDropFoto(i) {
        return () => {
            
            console.log("elimisdfdfgdfgdfgnar", this.state.fotosDrop[i].name)
            
            this.state.fotosDrop.splice(i, 1);
            this.setState({
                fotosDrop: this.state.fotosDrop,
            })
            console.log("eliminar", this.state.fotosDrop)


        }



    }

    drop = e => {
        console.log("recibir",e)
        this.setState({
            fotosDrop: e,
        })
        console.log("resultado",this.state.fotosDrop)
        console.log("fggertgertert", this.state.fotosDrop)



    }
    render() {
        const { data, loading, numNequi, certificado, medioPagoCertificado, certificadoName } = this.state;
        const files = this.state.file.map((file) => (
            <li key={file.name}>
                {file.name} -{file.size} bytes
            </li>
        ));
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
                            <div className='col-12'>
                                <form
                                    className=''
                                    onSubmit={medioPagoCertificado === true ? this.onCreate : this.onUpdate}
                                >
                                    <div className='row form-group'>
                                        
                                        <div className='col-12 col-md-6'>
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
                                                    defaultValue={numNequi}
                                                    onChange={this.onChange}
                                                    required
                                                />
                                            </div>
                                            <div className='form-group text-left mt-5'>
                                                <label htmlFor='' style={{ color: '#1A1446' }}>
                                                    Cargar Certificado:
                                                </label>
                                                <div className='columnDescripcion'>

                                        <DropZone id = "myDropzoneElementIDPago" funcDrop={this.drop} funcRemove={this.deleteDropFoto} />



                                    </div>

                                    <div className="row  mb-4 " >



                                        {this.state.fotosDrop && this.state.fotosDrop.length > 0 && this.state.fotosDrop.map((itemfotosDrop, i) => (
                                            <div className=" columnFotos mr-4">

                                                <img src={URL.createObjectURL(itemfotosDrop)} id="fotosTiendaPendientes" className='text-center' />
                                                <h5 className="textoPendiente"
                                                >Pendiente <br /> aprobación</h5>
                                                <button className="top-right" onClick={this.deleteDropFoto(i)}>x</button>
                                            </div>
                                        ))}

                                    </div>

                                                {/*<Dropzone
                                                    onDrop={this.onDropImage}
                                                    maxSize={imageMaxSize}
                                                    accept={imageTypeFile}
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section className='container'>
                                                            <div
                                                                {...getRootProps({ className: 'dropzone text-center' })}
                                                            >
                                                                <input {...getInputProps()} />
                                                                <p className='mb-0 mt-3 Categoria-SubTituloPequeno'>
                                                                    Arrastrar y soltar la imagen o clic
                                                                </p>
                                                            </div>
                                                            <aside>
                                                                {medioPagoCertificado === true ? (
                                                                    <h6 className='Categoria-SubTituloPequeno mt-4'>
                                                                        Archivo:{' '}
                                                                        <a href={certificado} target='_blank'>
                                                                            {certificadoName}
                                                                        </a>
                                                                    </h6>
                                                                ) : (
                                                                    <h6 className='Categoria-SubTituloPequeno mt-4'>
                                                                        Archivo:
                                                                    </h6>
                                                                )}
                                                                <ul className='Categoria-SubTituloPequeno'>{files}</ul>
                                                            </aside>
                                                        </section>
                                                    )}
                                                </Dropzone>*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-9 text-right mt-5'>
                                        <button className='btn text-white px-4 py-2 Tienda-FontSpartan Tienda-btnMorado'
                                        disabled={sessionStorage.getItem('Rol') == 'Consulta' ? true : false}>
                                            {/* Aprobar Tienda */}
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default MedioPago;