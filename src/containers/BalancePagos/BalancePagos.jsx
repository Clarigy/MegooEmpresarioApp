import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import '../../assets/styles/Tablas/Tablas.scss';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import IconActive from '../../hooks/iconActive';

export class BalancePagos extends Component {
    componentDidMount() {
        IconActive.checkPath('Siderbar-BalancePagos', '/balancepagos', this.props.match.path);
    }
    render() {
        return (
            <>
                <div className='container-fluid'>
                    <div className='mx-0 mx-md-3 mx-lg-5'>
                        <div className='row mb-5' style={{ height: '20px' }}></div>
                        <div className='col-6 col-sm-3 col-lg-2 text-left'>
                                <button className='btn text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'>
                                Arte Frances <i className="fa fa-chevron-down"></i>
                                </button>
                            </div>
                        <div className='row my-5'></div>

                        <div className='row'>
                            <div className='col-12 col-lg-3 mb-3'>
                                <h2 className='Categoria-Titulo mb-0 mt-1'>Balance de pagos</h2>
                            </div>
                            <div className='col-12 col-sm-3 col-lg-2'>
                                <div className='input-group mb-3 Categoria-inputShadow '>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text Categoria-Inputprepend' id='basic-addon1'>
                                            <i className='fa fa-search text-muted'></i>
                                        </span>
                                    </div>
                                    <input
                                        type='text'
                                        className='form-control text-muted Categoria-Inputprepend-Input'
                                        placeholder='Buscar'
                                        aria-label='Username'
                                        aria-describedby='basic-addon1'
                                    />
                                </div>
                            </div>
                            <div className='col-12 col-sm-3 col-lg-2'>
                                <div className='input-group mb-3 Categoria-inputShadow'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text Categoria-Inputprepend' id='basic-addon1'>
                                            <img src={Icono_Senal} alt='' />
                                        </span>
                                    </div>
                                    <select
                                        name=''
                                        id=''
                                        className='form-control text-muted Categoria-Inputprepend-Input'
                                        placeholder='Buscar'
                                        aria-label='Buscar'
                                        aria-describedby='basic-addon1'
                                    >
                                        <option value=''>Ordenar por</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-6 col-sm-3 col-lg-2 text-center'>
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado'>
                                    <i className='fa fa-arrow-down mr-2'></i>Descargar
                                </button>
                            </div>
                            <div className='col-6 col-sm-3 col-lg-2 text-center text-md-left'>
                                <button className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado'>
                                    <i class="fa fas fa-filter mr-2"></i>Filtrar
                                </button>
                            </div>
                        </div>

                        <div className='row my-2' style={{ height: '20px' }}></div>
                        <div className='row'>
                            <div className='col-12'>
                                <h2 className='Categoria-Titulo mb-0 mt-1'>Actual</h2>
                            </div>
                        </div>

                        <div className='row mt-5'>
                            <div className='col-12 table-responsive'>
                                <table className='table' id='Categoria'>
                                    <thead className='text-left CategoriaTabla-Thead'>
                                        <tr>
                                            <th>Balance</th>
                                            <th>Servicio</th>
                                            <th>Fecha</th>
                                            <th>Valor</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-left CategoriaTabla-Body'>
                                        <tr id='TR-Fondo'>
                                            <td>Balance 1</td>
                                            <td>Corte de cabello</td>
                                            <td>Del 14 al 20 de noviembre</td>
                                            <td>$20.000</td>
                                            <td>Pago</td>
                                        </tr>
                                        <tr>
                                            <td>Balance 2</td>
                                            <td>Uñas Acrilicas</td>
                                            <td>Del 14 al 20 de noviembre</td>
                                            <td>$50.000</td>
                                            <td>Pago</td>
                                        </tr>
                                        <tr>
                                            <td>Balance 3</td>
                                            <td>Tinte sencillo</td>
                                            <td>Del 14 al 20 de noviembre</td>
                                            <td>$65.000</td>
                                            <td>Pago</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='row my-2' style={{ height: '20px' }}></div>
                        <div className='row'>
                            <div className='col-12'>
                                <h2 className='Categoria-Titulo mb-0 mt-1'>Anteriores</h2>
                            </div>
                        </div>

                        <div className='row mt-5'>
                            <div className='col-12 table-responsive'>
                                <table className='table' id='Categoria'>
                                    <thead className='text-left CategoriaTabla-Thead'>
                                        <tr>
                                            <th>Balance</th>
                                            <th>Servicio</th>
                                            <th>Fecha</th>
                                            <th>Valor</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-left CategoriaTabla-Body'>
                                        <tr>
                                            <td>Balance 4</td>
                                            <td>Corte de cabello</td>
                                            <td>Del 14 al 20 de noviembre</td>
                                            <td>$120.000</td>
                                            <td>Pago</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='row my-4'></div>
                        <div className='row'>
                            <div className='col-12 col-md-8 offset-0 offset-md-2'>
                                <h2 className='Categoria-Titulo mb-0 mt-1'>Detalles</h2>
                            </div>
                        </div>

                        <div className='row mt-5'>
                            <div className='col-12 col-md-8 offset-0 offset-md-2 table-responsive'>
                                <table className='table' id='Categoria'>
                                    <thead className='text-left CategoriaTabla-Thead'>
                                        <tr>
                                            <th>Servicio</th>
                                            <th>Fecha</th>
                                            <th>Valor</th>
                                            <th>Cliente</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-left CategoriaTabla-Body'>
                                        <tr>
                                            <td>Corte de cabello</td>
                                            <td>20/11/2020</td>
                                            <td>$20.000</td>
                                            <td>Andres Lopez</td>
                                            <td>Terminado</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}

export default BalancePagos;
