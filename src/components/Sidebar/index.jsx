/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import '../../assets/styles/components/Siderbar/Siderbar.scss';
import ImagenPerfil from '../../assets/images/containers/Perfil/perfil.png';
import Tienda from '../../assets/images/components/Siderbar/Siderbar_Tienda.svg';
import Agenda from '../../assets/images/components/Siderbar/Siderbar_Agenda.svg';
import Equipo from '../../assets/images/components/Siderbar/Siderbar_Equipo.svg';
import Clientes from '../../assets/images/components/Siderbar/Siderbar_Clientes.svg';
import Descuentos from '../../assets/images/components/Siderbar/Siderbar_descuentos.svg';
import Analiticas from '../../assets/images/components/Siderbar/Siderbar_Estadisticas.svg';
import BalancePagos from '../../assets/images/components/Siderbar/Siderbar_BalancePagos.svg';
import Logout from '../../assets/images/components/Siderbar/Sidebar_Logout.svg';
import firebaseConfig from '../../firebase/setup.jsx';
import 'firebase/auth';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foto: '',
            status: ''
        };
        this.logout = this.logout.bind(this);

        // const user = firebaseConfig.auth().currentUser;
        // if (user) {
        //     console.log("Existe usuario")
        //     this.state = {
        //         isLogin: true,
        //         name: user.displayName,
        //     }
        // } else {
        //     console.log("No existe usuario")
        //     this.state = {
        //         isLogin: false,
        //         name: "",
        //     }
        // }
    }

    logout = () => {
        firebaseConfig
            .auth()
            .signOut()
            .then(() => {
                console.log('Cerro sesion');
            })
            .catch((error) => {
                console.log(error);
            });
        this.setState({
            isLogin: false
        });
    };
    /**
     * Effect sidebar
     */
    componentDidMount() {
        $('body').toggleClass('sidebar-toggled');
        $('.sidebar').toggleClass('toggled');
        $('.Siderbar-IconoTitulo').hide();

        if ($('.sidebar').hasClass('toggled')) {
            $('.sidebar .collapse').collapse('hide');
            $('.Siderbar-IconoTitulo').hide();
        }
        $('#sidebarToggle, #sidebarToggleTop').on('click', (e) => {
            $('body').toggleClass('sidebar-toggled');
            $('.Siderbar-IconoTitulo').show();
            $('.sidebar').toggleClass('toggled');
            if ($('.sidebar').hasClass('toggled')) {
                $('.sidebar .collapse').collapse('hide');
                $('.Siderbar-IconoTitulo').hide();
            }
        });

        // Close any open menu accordions when window is resized below 768px
        $(window).resize(() => {
            if ($(window).width() < 768) {
                $('.sidebar .collapse').collapse('hide');
                $('.Siderbar-IconoTitulo').hide();
            }

            // Toggle the side navigation when window is resized below 480px
            if ($(window).width() < 480 && !$('.sidebar').hasClass('toggled')) {
                $('body').addClass('sidebar-toggled');
                $('.sidebar').addClass('toggled');
                $('.sidebar .collapse').collapse('hide');
            }
        });

        // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
        $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
            if ($(window).width() > 768) {
                const e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;
                this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                e.preventDefault();
            }
        });

        // Scroll to top button appear
        $(document).on('scroll', function () {
            const scrollDistance = $(this).scrollTop();
            if (scrollDistance > 100) {
                $('.scroll-to-top').fadeIn();
            } else {
                $('.scroll-to-top').fadeOut();
            }
        });

        // Smooth scrolling using jQuery easing
        $(document).on('click', 'a.scroll-to-top', function (e) {
            const $anchor = $(this);
            $('html, body')
                .stop()
                .animate(
                    {
                        scrollTop: $($anchor.attr('href')).offset().top
                    },
                    1000,
                    'easeInOutExpo'
                );
            e.preventDefault();
        });

        firebaseConfig.auth().onAuthStateChanged((user) => {
            if (user) {
            
                const db = firebaseConfig.firestore();
                let docRef = db.collection('Perfil').doc(user.uid);

                docRef
                    .get()
                    .then((doc) => {
                 
                        if (doc.exists) {
                
                            if (doc.data()['foto'] == '' || doc.data()['foto'] == undefined) {
                                this.setState({
                                    foto: 'https://firebasestorage.googleapis.com/v0/b/meegoapp.appspot.com/o/foto%2Fuser.png?alt=media&token=3765c611-9c4c-4c01-bce7-6767290fc2d1'
                                });
                            } else {
                                this.setState({
                                    foto: doc.data()['foto']
                                });
                            }
                        } else {
                            // doc.data() will be undefined in this case
                            console.log('No such document!');
                        }
                    })
                    .catch(function (error) {
                        console.log('Error getting document:', error);
                    });
            }
        });
    }

    render() {
        return (
            <div className='navbar-nav sidebar sidebar-dark accordion siderbar-color' id='accordionSidebar'>
                <div className='siedebar-fixed  position-fixed '>
                    <ul
                        className='navbar-nav sidebar sidebar-dark accordion siderbar-color sidebar-container'
                        id='accordionSidebar'
                    >
                        <div>
                            {/* <!-- Sidebar - Brand -->*/}
                            <Link to={'/perfil'}>
                                <div className='sidebar-brand d-flex align-items-center justify-content-center mt-5'>
                                    <img src={this.state.foto} id='fotoPerfilSidebar' alt='' />
                                </div>
                            </Link>

                            {/* <!-- Divider --> */}
                            {/* <hr className='sidebar-divider my-0' /> */}

                            {/* <!-- Nav Item - Dashboard --> */}
                            <li className='nav-item mt-4 mb-2 Siderbar_IconHover' id='Siderbar-Agendas'>
                                <Link to={'/agenda'} className='nav-link py-2'>
                                    <img src={Agenda} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Agenda</span>
                                </Link>
                            </li>

                            {/* <!-- Divider --> */}
                            {/* <hr className='sidebar-divider' /> */}

                            {/* <!-- Heading --> */}
                            {/* <div className='sidebar-heading'>Interface</div> */}

                            {/* <!-- Nav Item - Pages Collapse Menu --> */}
                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-Tienda'>
                                <Link to={'/tiendas'} className='nav-link py-2'>
                                    <img src={Tienda} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Tiendas</span>
                                </Link>
                            </li>

                            {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-Equipo'>
                                <Link to={'/equipo'} className='nav-link py-2'>
                                    <img src={Equipo} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Equipo</span>
                                </Link>
                            </li>

                            {/* <!-- Divider --> */}
                            {/* <hr className='sidebar-divider' /> */}

                            {/* <!-- Heading --> */}
                            {/* <div className='sidebar-heading'>Addons</div> */}

                            {/* <!-- Nav Item - Pages Collapse Menu --> */}
                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-Clientes'>
                                <Link to={'/clientes'} className='nav-link py-2'>
                                    <img src={Clientes} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Clientes</span>
                                </Link>
                            </li>

                            {/* <!-- Nav Item - Charts --> */}
                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-Descuentos'>
                                <Link to={'/descuentos'} className='nav-link py-2'>
                                    {/* <i className='fa fa-wrench' /> */}
                                    <img src={Descuentos} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Promociones y Descuentos</span>
                                </Link>
                            </li>

                            {/* <!-- Nav Item - Tables --> */}
                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-Analiticas'>
                                <Link to={'/analiticas'} className='nav-link py-2'>
                                    {/* <i className='fa fa-wrench' /> */}
                                    <img src={Analiticas} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Analiticas</span>
                                </Link>
                            </li>

                            <li className='nav-item my-2 Siderbar_IconHover' id='Siderbar-BalancePagos'>
                                <Link to={'/balancePagos'} className='nav-link py-2'>
                                    {/* <i className='fa fa-wrench' /> */}
                                    <img
                                        src={BalancePagos}
                                        alt=''
                                        className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img'
                                    />
                                    <span className='Siderbar-IconoTitulo mt-2 mt-md-0'>Balance de pagos</span>
                                </Link>
                            </li>

                            {/* <!-- Divider --> */}
                            {/* <hr className='sidebar-divider d-none d-md-block' /> */}

                            <li className='nav-item my-2 Siderbar_IconHover' id='Salir'>
                                <Link to={'/'} className='nav-link py-2'>
                                    <div
                                        onClick={() => {
                                            this.logout();
                                        }}
                                    >
                                        <img src={Logout} alt='' className='mr-3 ml-3 ml-md-0 Siderbar_IconHover_Img' />
                                        {/* <i className='fa fa-wrench' /> */}

                                        <span className='mr-3 ml-3 ml-md-0 Siderbar-IconoTitulo'>Logout</span>
                                    </div>
                                </Link>
                            </li>
                        </div>

                        {/* <!-- Divider --> */}
                        {/* <hr className='sidebar-divider d-none d-md-block' /> */}

                        {/* <!-- Sidebar Toggler (Sidebar) --> */}
                        <div className='text-center d-none d-md-inline mt-3'>
                            <button className='rounded-circle border-0' id='sidebarToggle' />
                        </div>
                    </ul>
                </div>
            </div>
        );
    }
}
