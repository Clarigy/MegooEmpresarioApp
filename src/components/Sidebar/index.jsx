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
import Logotipo from '../../assets/images/components/Siderbar/Siderbar_Logotipo.png';
import LogoutButton from "../molecule/LogoutButton.jsx";


export default class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foto: "",
            status: "",
        };

    }


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
            console.log('clickSideBar');
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
    }

    render() {
        return (
            <ul className='navbar-nav sidebar sidebar-dark accordion siderbar-color' id='accordionSidebar'>
                {/* <!-- Sidebar - Brand --> */}
                <a className='sidebar-brand d-flex align-items-center justify-content-center mt-5' href='/perfil'>
                    <div className='sidebar-brand-icon'>
                        <img src={ImagenPerfil} id="fotoPerfilSidebar" alt="" />
                    </div>

                </a>

                <li className='nav-item mt-4 mb-2 Siderbar_IconHover' id="Siderbar-Agendas">
                    <a href="/agenda" className='nav-link '>
                        {/* <i className='fa fa-cog' /> */}
                        <img src={Agenda} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Agenda</span>
                    </a>
                </li>


                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-Tienda">
                    <a href="/tiendas" className='nav-link ' >
                        <img src={Tienda} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Tiendas</span>
                    </a>
                </li>




                {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-Equipo">
                    <a href="/equipo" className='nav-link'>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={Equipo} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Equipo</span>
                    </a>
                </li>


                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-Clientes">
                    <a href="/clientes" className='nav-link'>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={Clientes} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Clientes</span>
                    </a>
                </li>

                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-Descuentos">
                    <a href="/descuentos" className='nav-link'>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={Descuentos} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Promociones y Descuentos</span>
                    </a>
                </li>


                {/* <!-- Nav Item - Tables --> */}
                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-Analiticas">
                    <a href="/analiticas" className='nav-link '>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={Analiticas} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Analiticas</span>
                    </a>
                </li>

                <li className='nav-item my-2 Siderbar_IconHover' id="Siderbar-BalancePagos">
                    <a href="/balancepagos" className='nav-link '>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={BalancePagos} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Balance de pagos</span>
                    </a>
                </li>

                <li className='nav-item my-2' >
                    <a className='nav-link '>
                        {/* <i className='fa fa-wrench' /> */}
                        <img src={Logotipo} alt="" className="mr-3 Siderbar_IconHover_Img" />
                        <span className="Siderbar-IconoTitulo">Meego</span>
                    </a>
                </li>

                <LogoutButton />

                {/* <!-- Divider --> */}
                <hr className='sidebar-divider d-none d-md-block' />

                {/* <!-- Sidebar Toggler (Sidebar) --> */}
                <div className='text-center d-none d-md-inline'>
                    <button className=' rounded-circle border-0' id='sidebarToggle' />
                </div>
            </ul>
        );
    }
}
