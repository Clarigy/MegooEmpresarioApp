import React, { Component } from 'react';
import '../../assets/styles/components/Navbar/Navbar.scss';
import '../../assets/styles/components/cards/Cards.scss';
import firebaseConfig from '../../firebase/setup.jsx';
import moment from 'moment';
import { AuthContext } from '../../firebase/context';

export class CardPromociones extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: this.props.tiendaUid,
            combo: this.props.combo,
            servicios: this.props.servicios,
            Promociones: [],
            fechaFin: '',
            servicioFinal: ''
        };
    }

    componentDidMount = () => {
        this.checkPromociones();
        const fecha = new Date(this.state.combo.fechaValido.seconds * 1000).toLocaleString();
        this.setState({
            fechaFin: fecha
        });
        let servicios = '';

        for (let i = 0; i < this.state.servicios.length; i++) {
            servicios = `${servicios}${this.state.servicios[i].servicios.servicio}. `;
        }
        this.setState({
            servicioFinal: servicios
        });
    };
    checkPromociones = async () => {
        const Promociones = [];
        const servicios = [];

        const db = firebaseConfig.firestore();
        const tiendaId = this.props.tiendaUid;
        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Paquetes/suscripciones`;
        await db
            .collection(collectionRef)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    Promociones.push(doc.data());
                });
                this.setState({ Promociones: Promociones }, () => {});
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error);
            });

        // let colAnother = `/Tiendas/${tiendaId}/suscripciones/`;
        // colAnother
        //     .collection('servicios')
        //     .get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             // doc.data() is never undefined for query doc snapshots
        //             servicios.push(doc.data());
        //         });
        //         this.setState({ servicios: servicios }, () => {

        //         });
        //     })
        //     .catch(function (error) {
        //         console.log('Error getting documents: ', error);
        //     });
    };

    // combos.forEach(element => {
    //     servicio = servicios + " + " + element
    // });
    onSubmit = async () => {
        const db = firebaseConfig.firestore();
        var batch = db.batch();

        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const tiendaId = this.props.tiendaUid;
        const servicios = this.state.servicios;

        let color = ['6c3eff', 'FF3B7B', '00D4D8', '1A1446'];
        let randomNumber = Math.floor(Math.random() * color.length);
        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Paquetes/suscripciones`;
        await db
            .collection(collectionRef)
            .add({
                nombre: this.state.combo.nombre,
                tipoTienda: this.state.combo.tipoTienda,
                genero: this.state.combo.genero,
                tipoServicio: this.state.combo.tipoServicio,
                gananciaMensual: this.state.combo.gananciaMensual,
                imagen: this.state.combo.imagen,
                fechaValido: this.state.combo.fechaValido,
                validoDede: moment(date).format(),
                estado: 'Activo',
                color: color[randomNumber]
            })
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);

                let id = '';
                db.collection(collectionRef)
                    .doc(docRef.id)
                    .update(
                        {
                            uid: docRef.id
                        },
                        (id = docRef.id)
                    )
                    .then(function (docRef) {
                        let collection = `/Tiendas/${tiendaId}/opcionesPlan/Paquetes/suscripciones/${id}/servicios`;
                        for (let i = 0; i < servicios.length; i++) {
                            const element = servicios[i];
                            console.log(element.servicios);
                            db.collection(collection).add({
                                categoria: element.servicios.categoria,
                                servicio: element.servicios.servicio,
                                precioBasico: element.servicios.precioBasico,
                                precioPlus: element.servicios.precioPlus,
                                precioPremium: element.servicios.precioPremium
                            });
                        }
                    });
            });
        await this.checkPromociones();
        batch.commit();
    };

    onDelete = async () => {
        const db = firebaseConfig.firestore();
        var batch = db.batch();
        const comboDelete = this.state.Promociones.find((v) => v.nombre == this.state.combo.nombre);
        const tiendaId = this.props.tiendaUid;

        let collectionRef = `/Tiendas/${tiendaId}/opcionesPlan/Paquetes/suscripciones`;
        await db.collection(collectionRef).doc(comboDelete.uid).delete();
        batch.commit();
        await this.checkPromociones();
    };

    render() {
        return (
            <>
                <div id={'card'} className='contenedor-card sombra-oscura'>
                    <div className='descuentos-card'>
                        <div className='card-right'>
                            <h3 className='Categoria-SubTitulo'>{this.state.combo.nombre}</h3>
                            <p>{`Tipo de tienda: ${this.state.combo.tipoTienda}`}</p>
                            <p>{`Servicios: ${this.state.servicioFinal}`}</p>
                            <p>{`Género: ${this.state.combo.genero}`}</p>
                            <p>{`Tipo de servicio: ${this.state.combo.tipoServicio}`}</p>
                            <h3 className='Categoria-SubTitulo'>{`Ganancia mensual: $${this.state.combo.gananciaMensual}`}</h3>
                        </div>
                        <div>
                            <img className='img-card' src={this.state.combo.imagen}></img>
                        </div>
                    </div>
                    <div>
                        <p>{`Valido hasta: ${this.state.fechaFin}`}</p>
                    </div>
                    <div>
                        {this.state.Promociones.some((v) => v.nombre == this.state.combo.nombre) ? (
                            <button className='btn text-white Categoria-btnRosado' onClick={() => this.onDelete()}>
                                Desactivar este Combo
                            </button>
                        ) : (
                            <button className='btn text-white Categoria-btnMorado' onClick={() => this.onSubmit()}>
                                Activar este Combo
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
CardPromociones.contextType = AuthContext;
export default CardPromociones;
