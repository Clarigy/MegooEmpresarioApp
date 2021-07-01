import React, { Component } from 'react';
import '../../assets/styles/components/cards/Cards.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import moment from 'moment';
import { AuthContext } from '../../firebase/context';

export class CardDescuento extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: this.props.tiendaUid,
            descuento: this.props.descuento,
            servicios: '',
            Descuentos: [],
            fechaFin: ''
        };
    }

    componentDidMount = () => {
        this.checkDescuentos();
        let servicios = '';
        const fecha = new Date(this.state.descuento.fechaFin.seconds * 1000).toLocaleString();
        this.setState({
            fechaFin: fecha
        });
    };

    checkDescuentos = async () => {
        const Descuentos = [];

        const db = firebaseConfig.firestore();
        const tiendaId = this.props.tiendaUid;
        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Descuentos/suscripciones`;
        db.collection(collectionRef)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    Descuentos.push(doc.data());
                });
                this.setState({ Descuentos: Descuentos }, () => {});
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });
    };

    // combos.forEach(element => {
    //     servicio = servicios + " + " + element
    // });
    onSubmit = async () => {
        const db = firebaseConfig.firestore();
        var batch = db.batch();
        const tiendaId = this.props.tiendaUid;

        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Descuentos/suscripciones`;
        db.collection(collectionRef)
            .add({
                titulo: this.state.descuento.titulo,
                valor: this.state.descuento.valor,
                descripcion: this.state.descuento.contenido,
                foto: this.state.descuento.img,
                validoHasta: this.state.descuento.fechaFin
            })
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);

                db.collection(collectionRef).doc(docRef.id).update({
                    uid: docRef.id
                });
            });

        batch.commit();
        await this.checkDescuentos();
    };

    onDelete = async () => {
        const db = firebaseConfig.firestore();
        var batch = db.batch();
        const descuentoDelete = this.state.Descuentos.find((v) => v.titulo == this.state.descuento.titulo);
        const tiendaId = this.props.tiendaUid;

        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Descuentos/suscripciones`;
        db.collection(collectionRef).doc(descuentoDelete.uid).delete();
        batch.commit();
        await this.checkDescuentos();
    };

    render() {
        return (
            <>
                <div id={'card'} className='contenedor-card sombra-oscura'>
                    <div className='descuentos-card'>
                        <div className='card-right'>
                            <h3 className='Categoria-SubTitulo'>{this.state.descuento.titulo}</h3>
                            <p>{`${this.state.descuento.valor}% de descuento`}</p>
                            <p>{this.state.descuento.contenido}</p>
                        </div>
                        <div>
                            <img className='img-card' src={this.state.descuento.img}></img>
                        </div>
                    </div>
                    <div>
                        <p>{`Valirdo hasta: ${this.state.fechaFin}`}</p>
                    </div>
                    <div>
                        {this.state.Descuentos.some((v) => v.titulo == this.state.descuento.titulo) ? (
                            <button className='btn text-white Categoria-btnRosado' onClick={() => this.onDelete()}>
                                Desactivar este Descuento
                            </button>
                        ) : (
                            <button className='btn text-white Categoria-btnMorado' onClick={() => this.onSubmit()}>
                                Activar este Descuento
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
CardDescuento.contextType = AuthContext;
export default CardDescuento;
