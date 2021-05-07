import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/containers/Agenda/Agenda.scss';
import firebaseConfig from "../../firebase/setup.jsx";
import { AuthContext } from '../../firebase/context';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/es';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin, { DayGridView } from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; 
import { Link } from "react-router-dom";
import { ContactSupportOutlined, Filter } from '@material-ui/icons';
import { data } from 'jquery';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import Modal from '@material-ui/core/Modal';
import moment from 'moment';
import loadingImage from '../../assets/images/components/Loader/LoaderPrueba.gif';
import GifLoader from '../../components/Loader/index';
import $ from 'jquery';
import IconActive from '../../hooks/iconActive';





export class Agenda extends Component {



    constructor(props) {


        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            tab: "Ordenes",
            tiendas: [],
            events: [],
            uid: "",
            selectedDay: new Date(),
            diaActual: "",
            tabCalendar: "Mes",
            isMes: true,
            isSemana: false,
            isDia: false,
            currentViewName: 'dayGridMonth',
            ordenes: [],
            open: false,
            ordenesOriginal: [],
            fechaEventoFinal:"",
            fechaEventoInicio:"",
            fechaEventoInicioEmpty:"",
            fechaEventoFinalEmpty: "",
            NombreEvento:"",
            NombreEventoEmpty:"",
            NombreTienda:"",
            cliente : "",
            estado : "",
            servicio : "",
            empleado : "",
            data: [],
            dateSelect:"",
            isProxima:"",
            isTermianda:"",
            isCancelada:"",
            isPendiente:"",
            idEvento:"",
            loading: true,
           
            filtro: ["Próxima", "Cancelada", "Pendiente", "Terminada"],

            equipo: []

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

        const MESES = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        const f = new Date();

        var inicio = "";
        var fin = "";
        const semanaInicio = new Date().getDate() - new Date().getDay()
        if (semanaInicio == 0) {
            inicio = semanaInicio + 1
        }
        else {
            inicio = semanaInicio
        }
        const semanaFin = new Date().getDate() + 6 - new Date().getDay()
        if ((f.getMonth() == 1 ||
            f.getMonth() == 3 ||
            f.getMonth() == 5 ||
            f.getMonth() == 7 ||
            f.getMonth() == 8 ||
            f.getMonth() == 10 ||
            f.getMonth() == 12) && semanaFin > 30) {
            fin = 31
        } else
            if (f.getMonth() == 2 && semanaFin > 27) {
                fin = 28
            } else
                if ((f.getMonth() == 4 ||
                    f.getMonth() == 6 ||
                    f.getMonth() == 9 ||
                    f.getMonth() == 11) && semanaFin > 29) {
                    fin = 30
                } else {
                    fin = semanaFin
                }
        const diaActual = MESES[f.getMonth()] + " " + inicio + " - " + fin + ", " + new Date().getFullYear().toString()


        this.setState({
            tab: "Ordenes",
            diaActual: diaActual,
            isProxima:true,
            isTermianda:true,
            isCancelada:true,
            isPendiente:true,
        });

      
        

        


        const tiendas = [];
        const ordenesOriginal = [];

        const { user } = this.context;

        this.uidText = user["id"];

        this.setState({
            uid: this.uidText,
        });

        var nombreTienda = "";
       
        this.fetchEventsOrdenes(nombreTienda,this.state.isProxima, this.state.isCancelada, this.state.isPendiente, this.state.isTermianda)
    }

    fetchEventsOrdenes(nombreTienda, isProxima, isCancelada, isPendiente, isTermianda){
        const { user } = this.context;
        const tiendas = [];
        const events = [];
        

        const db = firebaseConfig.firestore();
        //let docRef = db.collection("TiendasTest").doc(user["id"]);
        let docRef = db.collection("TiendasTest").where("uid", "==", user["id"])
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tiendas.push(doc.data());

                });
                this.setState({ tiendas: tiendas });
                if (nombreTienda == ""){
                    this.setState({ nombreTienda:this.state.tiendas[0]["nombre"]})
                } else {
                    this.setState({ nombreTienda: nombreTienda})
                }

                

                
                
                db.collection("OrdenesTest").where("uidproveedor", "==", this.state.tiendas[0]["uid"] + "-" +  this.state.nombreTienda)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots

                            this.setState({
                                fechaEventoInicio :  doc.data()["fechaInicio"],
                                fechaEventoFinal:  doc.data()["fechaFin"],
                                cliente :  doc.data()["cliente"],
                                estado : doc.data()["estado"],
                                NombreEvento : doc.data()["servicio"],
                                empleado :  doc.data()["empleado"],
                                idEvento: doc.data()["uid"]
                            });

                            var colors = ""

                            if (this.state.isProxima == true){
                                if (this.state.estado == "proxima"){
                                    let event = {
                                        id: "12345677",
                                        title: this.state.NombreEvento,
                                        start: moment(this.state.fechaEventoInicio).format(),
                                        end: moment(this.state.fechaEventoFinal).format(),
                                        color: "#6c3eff",
                                        cliente: this.state.cliente,
                                        estado: this.state.estado,
                                        empleado: this.state.empleado,
                                        id: this.state.idEvento
                                    }
                                    events.push(event)
                                }
                            }

                            if (this.state.isPendiente == true){
                                if (this.state.estado == "pendiente"){
                                    let event = {
                                        id: "12345677",
                                        title: this.state.NombreEvento,
                                        start: moment(this.state.fechaEventoInicio).format(),
                                        end: moment(this.state.fechaEventoFinal).format(),
                                        color: "#00D4D8",
                                        cliente: this.state.cliente,
                                        estado: this.state.estado,
                                        empleado: this.state.empleado,
                                        id: this.state.idEvento
                                    }
                                    events.push(event)
                                }
                            }

                            if (this.state.isTermianda == true){
                                if (this.state.estado == "terminada"){
                                    let event = {
                                        id: "12345677",
                                        title: this.state.NombreEvento,
                                        start: moment(this.state.fechaEventoInicio).format(),
                                        end: moment(this.state.fechaEventoFinal).format(),
                                        color: "#1A1446",
                                        cliente: this.state.cliente,
                                        estado: this.state.estado,
                                        empleado: this.state.empleado,
                                        id: this.state.idEvento
                                    }
                                    events.push(event)
                                }
                            }

                            if (this.state.isCancelada == true){
                                if (this.state.estado == "cancelada"){
                                    let event = {
                                        id: "12345677",
                                        title: this.state.NombreEvento,
                                        start:moment(this.state.fechaEventoInicio).format(),
                                        end:moment(this.state.fechaEventoFinal).format(),
                                        color: "#FF3B7B",
                                        cliente: this.state.cliente,
                                        estado: this.state.estado,
                                        empleado: this.state.empleado,
                                        id: this.state.idEvento
                                    }
                                    events.push(event)
                                }
                            }                                    
                            
                        })


                        this.setState({ events: events });

                        console.log(this.state.events)

                    });


            })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
                

       

    }

    

    

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleDateClick = (arg) => { // bind with an arrow function
        alert(arg.dateStr)
      }



    tabChange = () => {

        if (this.state.tab == "Ordenes") {
            this.setState({
                tab: "Equipo",
            });
            this.equipo();
        } else {
            this.setState({
                tab: "Ordenes",
            });
            this.ordenes();
        }

    }

    equipo() {

        this.setState({
            data: [],
        })

        const equipo = [];

        const db = firebaseConfig.firestore();
        db.collection("EmpleadosTest").where("tienda", "==", this.state.tiendas[0]["uid"] + "-" + this.state.nombreTienda)
            .get()
            .then((querySnapshot) => {
                var count = 0
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    equipo.push(doc.data());
                    count += 1
                    console.log(count)
                    // doc.data() is never undefined for query doc snapshots
                    const startDate = doc.data().fechaInicio.toDate();
                    const endDate = doc.data().fechaFin.toDate();
                    const rRule = 'FREQ=YEARLY;BYDAY=' + doc.data().diasLaborales;
                    const title = doc.data().nombre;
                    const obj = { 'startDate': startDate, 'endDate': endDate, 'rRule': rRule, 'title': title, 'type': count };
                    this.setState({
                        data: [...this.state.data, obj]
                    });

                });
                this.setState({
                    equipo: equipo,
                });
                console.log(this.state.data)
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });



        console.log(this.state.equipo)

    }

    ordenes() {
        this.setState({
            data: [],
        })

        const db = firebaseConfig.firestore();
        db.collection("OrdenesTest").where("uidProveedor", "==", this.state.tiendas[0]["uid"] + "-" + this.state.nombreTienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const startDate = doc.data().fechaInicio.toDate();
                    const endDate = doc.data().fechaFin.toDate();
                    const type = doc.data().estado;
                    const obj = { 'startDate': startDate, 'endDate': endDate, 'type': type };
                    this.setState({
                        data: [...this.state.data, obj]
                    });

                });
                console.log(this.state.data)

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    tabCalendarChange(e) {
        return () => {
            console.log("Inicioooo", this.state.tabCalendar)
            console.log("Inicioooo", e)

            if (e == "Semana") {
                this.setState({
                    tabCalendar: "Semana",
                    isSemana: true,
                    isMes: false,
                    isDia: false,
                    currentViewName: "timeGridWeek"
                });
                console.log('Semanaaaaaa')
                console.log(this.state.currentViewName)
                console.log(this.state.tabCalendar)
            } else if (e == "Mes") {
                this.setState({
                    tabCalendar: "Mes",
                    isMes: true,
                    isSemana: false,
                    isDia: false,
                    currentViewName: "dayGridMonth"
                });
                console.log('Meeeeeeees')
                console.log(this.state.currentViewName)
                console.log(this.state.tabCalendar)
            } else if (e=="Dia") {
                this.setState({
                    tabCalendar: "Dia",
                    isDia: true,
                    isMes: false,
                    isSemana: false,
                    currentViewName: "timeGridDay"
                });
                console.log('Diaaaaaaaaa')
                console.log(this.state.currentViewName)
                console.log(this.state.tabCalendar)
            }
        }

    }


    selectTienda = e => {

        this.setState({
            data: [],
        })

        if (this.state.tab == "Ordenes") {
            this.fetchEventsOrdenes(e.target.value, this.state.isProxima, this.state.isCancelada, this.state.isPendiente, this.state.isTermianda)

        }

        else if (this.state.tab == "Equipo") {


            const equipo = [];

            const db = firebaseConfig.firestore();
            db.collection("EmpleadosTest").where("tienda", "==", this.state.tiendas[0]["uid"] + "-" + e.target.value)
                .get()
                .then((querySnapshot) => {
                    var count = 0
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        equipo.push(doc.data());


                        // doc.data() is never undefined for query doc snapshots
                        const startDate = doc.data().fechaInicio.toDate();
                        const endDate = doc.data().fechaFin.toDate();
                        const rRule = 'FREQ=YEARLY;BYDAY=' + doc.data().diasLaborales;
                        const title = doc.data().nombre;
                        const obj = { 'startDate': startDate, 'endDate': endDate, 'rRule': rRule, 'title': title, 'type': count };
                        this.setState({
                            data: [...this.state.data, obj]
                        });
                        count += 1

                    });
                    this.setState({
                        equipo: equipo,
                    });
                    console.log(this.state.data)
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

        }

        this.setState({
            nombreTienda: e.target.value
        });
        console.log(e.target.value)

    }


    handleDayClick(day, { selected }) {
        if (selected) {
            // Unselect the day if already selected
            this.setState({ selectedDay: undefined });
            return;
        }

        const MESES = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        const f = day;
        var inicio = "";
        var fin = "";
        const semanaInicio = day.getDate() - day.getDay()
        if (semanaInicio == 0) {
            inicio = semanaInicio + 1
        }
        else {
            inicio = semanaInicio
        }
        const semanaFin = day.getDate() + 6 - day.getDay()
        if ((f.getMonth() == 0 ||
            f.getMonth() == 2 ||
            f.getMonth() == 4 ||
            f.getMonth() == 6 ||
            f.getMonth() == 7 ||
            f.getMonth() == 9 ||
            f.getMonth() == 11) && semanaFin > 30) {
            fin = 31
        } else
            if (f.getMonth() == 1 && semanaFin > 27) {
                fin = 28
            } else
                if ((f.getMonth() == 3 ||
                    f.getMonth() == 5 ||
                    f.getMonth() == 8 ||
                    f.getMonth() == 10) && semanaFin > 29) {
                    fin = 30
                } else {
                    fin = semanaFin
                }
        const diaActual = MESES[f.getMonth()] + " " + inicio + " - " + fin + ", " + day.getFullYear().toString()



        this.setState({
            selectedDay: day,
            diaActual: diaActual
        });

    }

    nextWeek = () => {
        var date = new Date(this.state.selectedDay)
        var newDate = new Date(date)

        newDate.setDate(newDate.getDate() + 7);

        this.setState({
            selectedDay: newDate
        });
        this.handleDayClick(newDate, false)
    }

    prevWeek = () => {
        var date = new Date(this.state.selectedDay)
        var newDate = new Date(date)

        newDate.setDate(newDate.getDate() - 7);

        this.setState({
            selectedDay: newDate
        });
        this.handleDayClick(newDate, false)

    }

    onChange = e => {

        const filtro = this.state.filtro

        if (e.target.value == "Próxima") {
            if (filtro.indexOf("Próxima") == -1) {
                filtro.push("Próxima");
            } else {
                const index = filtro.indexOf("Próxima");
                if (index > -1) {
                    filtro.splice(index, 1);
                }
            }
            this.setState({
                filtro: filtro
            })
        } else if (e.target.value == "Cancelada") {
            if (filtro.indexOf("Cancelada") == -1) {
                filtro.push("Cancelada");
            } else {
                const index = filtro.indexOf("Cancelada");
                if (index > -1) {
                    filtro.splice(index, 1);
                }
            }
            this.setState({
                filtro: filtro
            })
        } else if (e.target.value == "Terminada") {
            if (filtro.indexOf("Terminada") == -1) {
                filtro.push("Terminada");
            } else {
                const index = filtro.indexOf("Terminada");
                if (index > -1) {
                    filtro.splice(index, 1);
                }
            }
            this.setState({
                filtro: filtro
            })
        } else if (e.target.value == "Pendiente") {
            if (filtro.indexOf("Pendiente") == -1) {
                filtro.push("Pendiente");
            } else {
                const index = filtro.indexOf("Pendiente");
                if (index > -1) {
                    filtro.splice(index, 1);
                }
            }
            this.setState({
                filtro: filtro
            })
        }
        this.filter();

    }

    filter() {

        console.log(this.state.filtro)

        this.setState({
            data: []
        })

        const db = firebaseConfig.firestore();
        db.collection("OrdenesTest").where("uidProveedor", "==", this.state.tiendas[0]["uid"] + "-" + this.state.nombreTienda)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    for (var i = 0; i < this.state.filtro.length; i++) {
                        if (doc.data().estado == this.state.filtro[i]) {
                            const startDate = doc.data().fechaInicio.toDate();
                            const endDate = doc.data().fechaFin.toDate();
                            const type = doc.data().estado;
                            const obj = { 'startDate': startDate, 'endDate': endDate, 'type': type };
                            this.setState({
                                data: [...this.state.data, obj]
                            });
                        }
                    }
                });
            })

            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        console.log(this.state.data)


    }

    

    renderEventContent = (eventInfo) => {
        console.log(eventInfo)
        return (
          <>
        
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event._def.title}</i>
            
          </>
        )
    }
    
    handleEventClick = (clickInfo) => {

        this.setState({
            open: true,
            dateSelect: clickInfo,
            NombreEvento: clickInfo.event._def.title,
            fechaEventoInicio: moment(clickInfo.event.start).format('YYYY-MM-DDTHH:mm'),
            fechaEventoFinal: moment(clickInfo.event.end).format('YYYY-MM-DDTHH:mm'),
            cliente: clickInfo.event._def.extendedProps.cliente,
            empleado: clickInfo.event._def.extendedProps.empleado,

        });

      

        console.log(this.state.NombreEvento)
        console.log(this.state.fechaEventoInicio)
        console.log(this.state.fechaEventoFinal)
        console.log(this.state.cliente)
        console.log(this.state.empleado)

        let calendarApi = this.state.dateSelect.view.calendar
        
    
        calendarApi.unselect() // clear date selection
    
        

        /*if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          clickInfo.event.remove()
        }*/
    }
    
    handleEvents = (events) => {
        this.setState({
          currentEvents: events
        })
        


    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this.state.fechaEventoInicio)
        console.log(this.state.fechaEventoFinal)
        console.log(this.state.NombreEvento)


    }

    handleOpen = (selectInfo) => {
        this.setState({
            open: true,
            dateSelect: selectInfo
        });
        let calendarApi = this.state.dateSelect.view.calendar
        

        if (this.state.NombreEvento == ""){
            this.setState({
                NombreEventoEmpty: "El campo esta vacío"
            });
        }else{
            this.setState({
                NombreEventoEmpty: ""
            });
        }
        if (this.state.fechaEventoInicio == ""){
            this.setState({
                fechaEventoInicioEmpty: "El campo esta vacío"
            });
        } else{
            this.setState({
                fechaEventoInicioEmpty: ""
            });
        }
        if (this.state.fechaEventoFinal == ""){
            this.setState({
                fechaEventoFinalEmpty: "El campo esta vacío"
            });
        }else{
            this.setState({
                fechaEventoFinalEmpty: "El campo esta vacío"
            });
        }
    
    
        calendarApi.unselect() // clear date selection
    
        }


    onSubmit = e => {

        console.log(this.state.fechaEventoInicio)
        console.log(this.state.fechaEventoFinal)
        console.log(this.state.NombreEvento)
        let calendarApi = this.state.dateSelect.view.calendar
       
    if (this.state.NombreEvento != "" && this.state.fechaEventoInicio != "" && this.state.fechaEventoFinal != "") {
        const { user } = this.context;
        var idEvento = this.state.NombreEvento + "-" + this.state.fechaEventoInicio + "-" + this.state.fechaEventoFinal;
        const db = firebaseConfig.firestore();
        var batch = db.batch();
     

        db.collection("users/").doc(user.id).collection("citasOrdenes").doc(idEvento).set({
                "nombre": this.state.NombreEvento,
                "FechaInicio": this.state.fechaEventoInicio,
                "fechaFinal": this.state.fechaEventoFinal,
                "id": idEvento,
            });


        
        
        /*calendarApi.addEvent({
                id: idEvento,
                title: this.state.NombreEvento,
                start: this.state.fechaEventoInicio,
                end: this.state.fechaEventoFinal,
                color: '#FF3B7B'
        })*/
            
           
         

    } else {
      
    }
    e.preventDefault();
    };

    onChangeFilter = e => {


        if (e.target.value == "Próxima"){
            if (e.target.checked == true){
                this.setState({
                    isProxima:true
                });
            } else {
                this.setState({
                    isProxima:false
                });
            }
        } else if (e.target.value == "Cancelada"){
            if (e.target.checked == true){
                this.setState({
                    isCancelada:true,
                })
            } else {
                this.setState({
                    isCancelada:false,
                })
            }
        } else if (e.target.value == "Pendiente"){
            if (e.target.checked == true){
                this.setState({
                    isPendiente:true,
                })
            } else {
                this.setState({
                    isPendiente:false,
                })
            }
        } else if (e.target.value == "Terminada"){
            if (e.target.checked == true){
                this.setState({
                    isTermianda:true,
                })
            } else {
                this.setState({
                    isTermianda:false,
                })
            }
        }


              
       this.fetchEventsOrdenes(this.state.nombreTienda, this.state.isProxima, this.state.isCancelada, this.state.isPendiente, this.state.isTermianda)


    }
    


    onEventChanged  = e =>{
        console.log(e.event.start)
      
        const { user } = this.context;
        const db = firebaseConfig.firestore();
    
        var batch = db.batch();
        let newUserRef = db.collection("OrdenesTest/").doc(e.event._def.publicId);
        batch.update(newUserRef, {
            "fechaInicio": moment(e.event.start).format(),
            "fechaFin": moment(e.event.end).format(),
            "cliente": e.event._def.extendedProps.cliente,
            "estado": e.event._def.extendedProps.estado,
            "servicio": e.event._def.title,
            "empleado": e.event._def.extendedProps.empleado,
            "uid": e.event._def.publicId,
        });
        batch.commit();

    }

    onVerCliente = e =>{
        this.props.history.push('/clientes');
    }
    
    



    render() {
        const { loading } = this.state;

        if (this.state.tab == "Ordenes") {
            return (
                <>
                 <GifLoader
                    loading={loading}
                    imageSrc={loadingImage}
                    overlayBackground="rgba(219,219,219, .8)"
                />

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>

                            <div className='row'>

                                <div className='tabButtons text-center row'>
                                    <div className={this.state.tab == "Ordenes" ? "tabButtonSelect" : "tabButtonUnSelect"} onClick={this.tabChange}>
                                        <h5>Agenda Órdenes</h5>
                                    </div>
                                    <div className={this.state.tab == "Equipo" ? "tabButtonSelect" : "tabButtonUnSelect"} onClick={this.tabChange}>
                                        <h5>Agenda Equipo y Suscripciones</h5>
                                    </div>
                                </div>


                            </div>

                            <div className='row mb-5' ></div>
                            <div className='bodyContainerAgenga'>
                                <div className="text-center columnLeftAgenda">

                                    <div className='col-12 col-lg-3 mb-3'>
                                        <select
                                            name=''
                                            id=''
                                            className=' text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'
                                            placeholder='Buscar'
                                            aria-label='Buscar'
                                            aria-describedby='basic-addon1'
                                            onChange={this.selectTienda}
                                        >
                                            {this.state.tiendas.map((tienda) => (
                                                <option value={tienda.nombre}>{tienda.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <DayPicker
                                        onDayClick={this.handleDayClick}
                                        selectedDays={this.state.selectedDay}
                                        localeUtils={MomentLocaleUtils}
                                        locale={"es"}
                                        firstDayOfWeek={0}
                                    //   className="Ordenes"
                                    //   renderDay={renderDay}
                                    />


                                    <div className='row mb-5' ></div>
                                    <div className="columnDatos text-center">
                                        <h2 className="estadoOrdenes">Órdenes</h2>
                                    </div>
                                    <div className='row mb-5' ></div>
                                    <div className="row">
                                    <label className="containerCheck">Próximas
                                        <input 
                                            defaultChecked={true}
                                            name="checkBoxServicios"
                                            type="checkbox"
                                            value="Próxima"
                                            onChange={this.onChangeFilter}/>
                                        <span className="checkBoxProxima"></span>
                                    </label>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">      
                                        <label className="containerCheck">Canceladas
                                            <input 
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value="Cancelada"
                                                onChange={this.onChangeFilter}/>
                                            <span className="checkBoxCancelada"></span>
                                        </label>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">
                                        <label className="containerCheck">Pendientes
                                                <input 
                                                    defaultChecked={true}
                                                    name="checkBoxServicios"
                                                    type="checkbox"
                                                    value="Pendiente"
                                                    onChange={this.onChangeFilter}/>
                                                <span className="checkBoxPendiente"></span>
                                        </label>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">
                                        <label className="containerCheck">Terminadas
                                                <input 
                                                    defaultChecked={true}
                                                    name="checkBoxServicios"
                                                    type="checkbox"
                                                    value="Terminada"
                                                    onChange={this.onChangeFilter}/>
                                                <span className="checkBoxTerminada"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className='row columnRightAgenda'>                                    
                                    
                                    <div className="callendarContainer">
                                        <FullCalendar
                                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                            headerToolbar={{
                                            left:'dayGridMonth,timeGridWeek,timeGridDay',
                                            center: 'title',
                                            right: 'today prev,next'
                                            }}
                                            initialView='dayGridMonth'
                                            //eventColor= 'green'
                                            eventDidMount= {this.popUpInfo}
                                            editable={true}
                                            //selectable={true}
                                            //selectMirror={true}
                                            dayMaxEvents={true}
                                            //weekends={true}
                                            locale= {esLocale}
                                            height= '80vh'
                                            events={this.state.events} // alternatively, use the `events` setting to fetch from a feed
                                            //select={this.handleOpen}
                                            //dateClick={this.handleDateClick}
                                            //eventContent={this.renderEventContent} // custom render function
                                            eventClick={this.handleEventClick}
                                            eventChange={this.onEventChanged}
                                            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                                            /* you can update a remote database when these fire:
                                            eventAdd={function(){}}
                                            
                                            eventRemove={function(){}}
                                            */
                                        />
                                    </div>
                                </div>                           
                            </div>
                        </div>
                        <Modal
                                open={this.state.open}
                                onClose={this.handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >

                                <div className="modal-popup">
                                <h2 className="titulo">Información del evento</h2>
                                <h2 className='Categoria-SubTitulo'>Nombre del evento:</h2>
                                <input
                                            type='text'
                                            className='form-control text-muted '
                                            aria-label='Document'
                                            name='NombreEvento'
                                           
                                            defaultValue={this.state.NombreEvento}
                                        />
                              
                                <h2 className='Categoria-SubTitulo'>Desde:</h2>
                                    <input
                                            type='datetime-local'
                                            className='form-control text-muted '
                                            aria-label='fechaEventoFinal'
                                            name='fechaEventoInicio'
                                            defaultValue={this.state.fechaEventoInicio}
                                        />
                                
                                <h2 className='Categoria-SubTitulo'>Hasta:</h2>
                                <input
                                            type='datetime-local'
                                            className='form-control text-muted '
                                            aria-label='fechaEventoFinal'
                                            name='fechaEventoInicio'
                                            defaultValue={this.state.fechaEventoFinal}
                                        />
                                    
                                
                                <h2 className='Categoria-SubTitulo'>Cliente:</h2>
                                <input
                                            type='text'
                                            className='form-control text-muted '
                                            aria-label='Document'
                                            name='cliente'
                                            defaultValue={this.state.cliente}
                                        />
                                <h2 className='Categoria-SubTitulo'>Empleado:</h2>
                                <input
                                            type='text'
                                            className='form-control text-muted '
                                            aria-label='Document'
                                            name='empleado'
                                            defaultValue={this.state.empleado}
                                        />
                               
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarPerfil'
                                    data-toggle='modal'
                                    data-target='#GuardarModal'
                                    onClick={this.onVerCliente}
                                    >
                                        Ver cliente
                                </button>

                                </div>
                            </Modal>                            
                    </div>
                </>
            )
        } else if (this.state.tab == "Equipo") {
            return (
                <>
                 <GifLoader
                    loading={loading}
                    imageSrc={loadingImage}
                    overlayBackground="rgba(219,219,219, .8)"
                />

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>


                            <div className='row'>

                                <div className='tabButtons text-center row'>
                                    <div className={this.state.tab == "Ordenes" ? "tabButtonSelect" : "tabButtonUnSelect"} onClick={this.tabChange}>
                                        <h5>Agenda Órdenes</h5>
                                    </div>
                                    <div className={this.state.tab == "Equipo" ? "tabButtonSelect" : "tabButtonUnSelect"} onClick={this.tabChange}>
                                        <h5>Agenda Equipo y Suscripciones</h5>
                                    </div>
                                </div>


                            </div>

                            <div className='row mb-5' ></div>
                            <div className='bodyContainerAgenga'>
                            <div className="text-center columnLeftAgenda">

                                <div className='col-12 col-lg-3 mb-3'>


                                    <select
                                        name=''
                                        id=''
                                        className=' text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'
                                        placeholder='Buscar'
                                        aria-label='Buscar'
                                        aria-describedby='basic-addon1'
                                        onChange={this.selectTienda}
                                    >

                                        {this.state.tiendas.map((tienda) => (
                                            <option value={tienda.nombre}>{tienda.nombre}</option>
                                        ))}


                                    </select>


                                </div>

                                <DayPicker
                                    onDayClick={this.handleDayClick}
                                    selectedDays={this.state.selectedDay}
                                    localeUtils={MomentLocaleUtils}
                                    locale={"es"}
                                    firstDayOfWeek={0}
                                //   className="Ordenes"
                                //   renderDay={renderDay}
                                />


                                <div className='row mb-5' ></div>
                                
                                <div className="columnDatos text-center">
                                    <h2 className="estadoOrdenes">Equipo de trabajo</h2>
                                </div>
                                <div className='row mb-5' ></div>

                                {this.state.equipo && this.state.equipo.length > 0 && this.state.equipo.map((equipo, i) => (



                                    <div className="row">
                                        <div className={"empleado" + i}>
                                            <input
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value={equipo.nombre}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <h2 className="estadoOrdenes ">{equipo.nombre}</h2>
                                    </div>




                                ))}

                                <div className='row mb-5' ></div>
                                <div className="columnDatos text-center">
                                    <h2 className="estadoOrdenes">Suscripciones</h2>
                                </div>
                                <div className='row mb-5' ></div>

                            </div>

                          
                                <div className="row columnRightAgenda">
                                <div className="callendarContainer">
                                        <FullCalendar
                                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                            headerToolbar={{
                                            left:'dayGridMonth,timeGridWeek,timeGridDay',
                                            center: 'title',
                                            right: 'today prev,next'
                                            }}
                                            initialView='dayGridMonth'
                                            eventColor= 'blue'
                                            editable={true}
                                            selectable={true}
                                            selectMirror={true}
                                            //dayMaxEvents={true}
                                            //weekends={true}
                                            locale= {esLocale}
                                            height= '80vh'
                                            //events={} // alternatively, use the `events` setting to fetch from a feed
                                            select={this.handleOpen}
                                            dateClick={this.handleDateClick}
                                            eventContent={this.renderEventContent} // custom render function
                                            eventClick={this.handleEventClick}
                                            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                                            /* you can update a remote database when these fire:
                                            eventAdd={function(){}}
                                            eventChange={function(){}}
                                            eventRemove={function(){}}
                                            */
                                        />
                                    </div>

                                </div>
                            </div>
                            <Modal
                                open={this.state.open}
                                onClose={this.handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div className="modal-popup">
                                <h2 className="titulo">Crear evento</h2>
                                <h2 className='Categoria-SubTitulo'>Nombre del evento:</h2>
                                        <input
                                            type='text'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='Document'
                                            onChange={this.onChange}
                                            name='NombreEvento'
                                            value={this.state.NombreEvento}
                                        />
                                <h2 className='Categoria-Alerta-Rojo'></h2>
                                <h2 className='Categoria-SubTitulo'>Desde:</h2>
                                        <input
                                            type='datetime-local'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='fechaEventoFinal'
                                            onChange={this.onChange}
                                            name='fechaEventoInicio'
                                            value={this.state.fechaEventoInicio}
                                        />
                                <h2 className='Categoria-Alerta-Rojo'></h2>
                                <h2 className='Categoria-SubTitulo'>Hasta:</h2>
                                        <input
                                            type='datetime-local'
                                            className='form-control text-muted '
                                            placeholder=''
                                            aria-label='fechaEventoFinal'
                                            onChange={this.onChange}
                                            name='fechaEventoFinal'
                                            value={this.state.fechaEventoFinal}
                                        />
                                <h2 className='Categoria-Alerta-Rojo'></h2>
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarPerfil'
                                    data-toggle='modal'
                                    data-target='#GuardarModal'
                                    onClick={this.onSubmit}
                                    >
                                        cancelar
                                </button>
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado btnGuardarPerfil'
                                    data-toggle='modal'
                                    data-target='#GuardarModal'
                                    onClick={this.onSubmit}
                                    >
                                        Guardar Evento
                                </button>

                            
                                
                                </div>
                            </Modal>
                    </div>
                    </div>
                </>
            )
        }
        ;
    }
}
Agenda.contextType = AuthContext;
export default Agenda;
