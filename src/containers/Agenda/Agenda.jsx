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






const currentDate = '2018-11-01';

const resourcesData = [

    { id: 'Próxima', text: 'Próxima', color: '#6C3EFF' },
    { id: 'Cancelada', text: 'Cancelada', color: '#FF3B7B' },
    { id: 'Pendiente', text: 'Pendiente', color: '#00D4D8' },
    { id: 'Terminada', text: 'Terminada', color: '#1A1446' },
    { id: 1, text: 'Terminada', color: '#6C3EFF' },
    { id: 2, text: 'Terminada', color: '#FF3B7B' },
    { id: 3, text: 'Terminada', color: '#00D4D8' },
    { id: 4, text: 'Terminada', color: '#1A1446' },
    { id: 5, text: 'Terminada', color: '#7CB3B2' },
    { id: 6, text: 'Terminada', color: '#C726B2' },
    { id: 7, text: 'Terminada', color: '#FF2663' },
    { id: 8, text: 'Terminada', color: '#FFC663' },
    { id: 9, text: 'Terminada', color: '#1FC6E9' },
    { id: 0, text: 'Terminada', color: '#1F49F8' },

]

const appointments = [
    {
      title: 'Website Re-Design Plan',
      startDate: new Date(2021, 4, 15, 9, 35),
      endDate: new Date(2021, 4, 15, 11, 30),
      id: 0,
      location: 'Room 1',
    }, {
      title: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date(2021, 4, 15, 12, 11),
      endDate: new Date(2021, 4, 25, 13, 0),
      id: 1,
      location: 'Room 1',
    }, {
      title: 'Install New Router in Dev Room',
      startDate: new Date(2021, 5, 25, 14, 30),
      endDate: new Date(2021, 5, 25, 15, 35),
      id: 2,
      location: 'Room 2',
    }, {
      title: 'Approve Personal Computer Upgrade Plan',
      startDate: new Date(2021, 5, 26, 10, 0),
      endDate: new Date(2021, 5, 26, 11, 0),
      id: 3,
      location: 'Room 2',
    }
]

export class Agenda extends Component {



    constructor(props) {


        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            tab: "Ordenes",
            tiendas: [],
            nombreTienda: "",
            uid: "",
            selectedDay: new Date(),
            diaActual: "",
            tabCalendar: "Mes",
            currentViewName: 'dayGridMonth',
            ordenes: [],
            ordenesOriginal: [],
            data: [],
            resources: [
                {
                    fieldName: 'type',
                    title: 'Type',
                    instances: resourcesData,
                },

            ],
            filtro: ["Próxima", "Cancelada", "Pendiente", "Terminada"],

            equipo: []

        };

    }

    componentDidMount = () => {

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
            diaActual: diaActual
        });



        const tiendas = [];
        const ordenesOriginal = [];

        const { user } = this.context;

        this.uidText = user["id"];

        this.setState({
            uid: this.uidText,
        });


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
                this.setState({ nombreTienda: this.state.tiendas[0]["nombre"] })
                db.collection("OrdenesTest").where("uidProveedor", "==", this.state.tiendas[0]["uid"] + "-" + this.state.tiendas[0]["nombre"])
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            ordenesOriginal.push(doc.data())
                            // doc.data() is never undefined for query doc snapshots

                            const startDate = doc.data().fechaInicio.toDate();
                            const endDate = doc.data().fechaFin.toDate();
                            const type = doc.data().estado;
                            const obj = { 'startDate': startDate, 'endDate': endDate, 'type': type };
                            this.setState({
                                data: [...this.state.data, obj]
                            });

                        });
                        this.setState({
                            ordenesOriginal: ordenesOriginal
                        });

                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });


            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });







    }

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
                    currentViewName: "timeGridWeek"
                });
                console.log('Semanaaaaaa')
                console.log(this.state.currentViewName)
                console.log(this.state.tabCalendar)
            } else if (e == "Mes") {
                this.setState({
                    tabCalendar: "Mes",
                    currentViewName: "dayGridMonth"
                });
                console.log('Meeeeeeees')
                console.log(this.state.currentViewName)
                console.log(this.state.tabCalendar)
            } else if (e=="Dia") {
                this.setState({
                    tabCalendar: "Dia",
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

            const db = firebaseConfig.firestore();
            db.collection("OrdenesTest").where("uidProveedor", "==", this.state.tiendas[0]["uid"] + "-" + e.target.value)
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

            this.setState({
                nombreTienda: e.target.value
            });

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

    renderEventContent  = (eventInfo) => {
        return (
          <>
            <b>{'holaaaa'}</b>
            <i>{eventInfo.event.title}</i>
          </>
        )
      }



    render() {

        if (this.state.tab == "Ordenes") {
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>

                            <div className='row mb-5' ></div>

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
                                        <div className="Próximas">

                                            <input
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value="Próxima"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <h2 className="estadoOrdenes">Próximas</h2>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">
                                        <div className="Canceladas">
                                            <input
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value="Cancelada"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <h2 className="estadoOrdenes">Canceladas</h2>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">
                                        <div className="Pendientes">
                                            <input
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value="Pendiente"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <h2 className="estadoOrdenes">Pendientes</h2>
                                    </div>

                                    <div className='row mb-1' ></div>
                                    <div className="row">
                                        <div className="Terminada">
                                            <input
                                                defaultChecked={true}
                                                name="checkBoxServicios"
                                                type="checkbox"
                                                value="Terminada"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <h2 className="estadoOrdenes ">Terminadas</h2>
                                    </div>
                                </div>

                                <div className='row columnRightAgenda'>                                    
                                    <div className='row'>                                       
                                        <div className='tabCalendar text-center row'>
                                            <div className={this.state.tabCalendar == "Mes" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Mes")}>
                                                <h5>Mes</h5>
                                            </div>
                                            <div className={this.state.tabCalendar == "Semana" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Semana")}>
                                                <h5>Semana</h5>
                                            </div>
                                            <div className={this.state.tabCalendar == "Dia" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Dia")}>
                                                <h5>Día</h5>
                                            </div>                                                
                                        </div>
                                    </div>
                                    <div className='row mb-5' ></div>

                                    <div className="callendarContainer">
                                        <FullCalendar
                                            plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                                            dateClick={this.handleDateClick}
                                            initialView= 'timeGridWeek'
                                            eventContent={this.renderEventContent}
                                            height= '100%'                                        
                                        />
                                    </div>
                                </div>                           
                            </div>
                        </div>                            
                    </div>
                </>
            )
        } else if (this.state.tab == "Equipo") {
            return (
                <>

                    <div className='container-fluid'>
                        <div className='mx-0 mx-md- mx-lg-8 perfilContainer'>

                            <div className='row mb-5' ></div>

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
                            <div className="text-center columnFotoPerfil">

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

                            <div className='row'>



                                <div className="columnRight">
                                    <div className='row'>
                                        <h2 className='Categoria-Titulo px-4 py-2'>{this.state.diaActual}</h2>
                                        <div onClick={this.prevWeek}>
                                            <h2 className='Categoria-SubTitulo px-4 py-3'>{"<"}</h2>
                                        </div>
                                        <div onClick={this.nextWeek}>
                                            <h2 className='Categoria-SubTitulo px-4 py-3'>{">"}</h2>
                                        </div>
                                        <div className='px-4 py-3'></div>
                                        <div className='tabCalendar text-center row'>
                                            <div className={this.state.tabCalendar == "Semana" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Semana")}>
                                                <h5>Semana</h5>
                                            </div>
                                            <div className={this.state.tabCalendar == "Mes" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Mes")}>
                                                <h5>Mes</h5>
                                            </div>
                                            <div className={this.state.tabCalendar == "Dia" ? "tabCalendarSelect" : "tabCalendarUnSelect"} onClick={this.tabCalendarChange("Dia")}>
                                                <h5>Año</h5>
                                            </div>
                                        </div>
                                    </div>

                                    <FullCalendar
                                        plugins={[ dayGridPlugin ]}
                                        initialView="dayGridMonth"
                                    />

                                </div>
                            </div>




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
