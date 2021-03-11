import React, { Component } from 'react';
import '../../assets/styles/containers/Categorias/Categorias.scss';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import IconActive from '../../hooks/iconActive';


export class Descuentos extends Component {

  componentDidMount() {
    IconActive.checkPath('Siderbar-Descuentos', '/descuentos', this.props.match.path);
}
    render() {
        return (
            <>
                <div className='container-fluid'>
                    <div className='mx-0 mx-md-3 mx-lg-5'>
                    <div className='row mb-5' ></div>
                    <div className='row'>
                        <div className='col-12 col-lg-4 mb-3'>
                                <button className='btn text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'>
                                Arte Frances <i className="fa fa-chevron-down"></i>
                                </button>
                            </div>
                            <div className='col-10 col-sm-4 col-lg-3'>
                                <button className='btn text-white px-4 py-2 mt-1 mr-2 Categoria-btnMorado'>
                                Arte Frances <i className="fa fa-chevron-down"></i>
                                </button>
                            </div>
                            </div>
                            <div className='row mb-5' ></div>
                        <div className='row'>
                            <div className='col-12 col-lg-4 mb-3'>
                                <h2 className='Categoria-Titulo mb-0 mt-1'>Descuentos Personalizados</h2>
                            </div>
                            <div className='col-12 col-sm-4 col-lg-3'>
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
                            <div className='col-12 col-sm-4 col-lg-3'>
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
                                        <option value=''>Ordenar </option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-12 col-sm-4 col-lg-2 text-center text-md-left'>
                                <button
                                    className='btn text-white px-4 py-2 mt-1 Categoria-btnMorado'
                                    data-toggle='modal'
                                    data-target='#DescuentoModal'
                                >
                                    <i className='fa fa-plus mr-2'></i>Agregar
                                </button>
                            </div>
                        </div>

                        <div className='row mt-5'>
                            <div className='col-10 table-responsive'>
                                <table className='table' id='Categoria'>
                                    <thead className='text-left CategoriaTabla-Thead'>
                                        <tr>
                                            <th>Categoria</th>
                                            <th>Servicio</th>
                                            <th>Valor %</th>
                                            <th>Género</th>
                                            <th>Válido</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-left CategoriaTabla-Body'>
                                        <tr>
                                            <td>Manos</td>
                                            <td>Uñas Acrilicas</td>
                                            <td>25</td>
                                            <td>F</td>
                                            <td>01 Enero 2021</td>
                                            <td><a style={{ color: '#FF3B7B' }}>Eliminar</a></td>
                                        </tr>
                                        <tr>
                                            <td>Maquillaje</td>
                                            <td>Maquillaje Social</td>
                                            <td>25</td>
                                            <td>Ambos</td>
                                            <td>01 Enero 2021</td>
                                            <td><a style={{ color: '#FF3B7B' }}>Eliminar</a></td>
                                        </tr>
                                        <tr>
                                            <td>Manos</td>
                                            <td>Uñas Acrilicas</td>
                                            <td>25</td>
                                            <td>F</td>
                                            <td>01 Enero 2021</td>
                                            <td><a style={{ color: '#FF3B7B' }}>Eliminar</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div
                            class='modal fade'
                            id='DescuentoModal'
                            tabIndex='-1'
                            role='dialog'
                            aria-labelledby='exampleModalLabel'
                            aria-hidden='true'
                        >
                            <div className='modal-dialog modal-dialog-centered' role='document'>
                                <div className='modal-content Categoria-inputShadow Categoria-modal'>
                                    <div className='text-center modal-header border-bottom-0'>
                                        <h4 className='w-100 Categoria-Titulo modal-title' id='exampleModalLabel'>
                                            Agregar Descuento
                                        </h4>
                                    </div>
                                    <form className="Categoria-form">
                                        <div className='modal-body px-5'>
                                            <div className='form-group'>
                                                <label for='Nombre'>Categoria:</label>
                                                <input
                                                    type='text'
                                                    className='form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder'
                                                    id='Nombre'
                                                    placeholder='Categoria'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label for='Nombre'>Servicio:</label>
                                                <input
                                                    type='text'
                                                    className='form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder'
                                                    id='Nombre'
                                                    placeholder='Servicio'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label for='Nombre'>Valor:</label>
                                                <input
                                                    type='text'
                                                    className='form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder'
                                                    id='Nombre'
                                                    placeholder='Valor %'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label for='Nombre'>Género:</label>
                                                <input
                                                    type='text'
                                                    className='form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder'
                                                    id='Nombre'
                                                    placeholder='Género'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label for='Nombre'>Valido hasta:</label>
                                                <input
                                                    type='date'
                                                    className='form-control border-top-0 border-left-0 border-right-0 Categoria-inputBottomBorder'
                                                    id=''
                                                    value='2021-01-10'
                                                />
                                            </div>

                                        </div>
                                    </form>

                                    <div className='modal-footer'>
                                        <div className='row text-center'>
                                            <div >
                                                <button
                                                    className='btn text-white Categoria-btnMorado'
                                                    data-toggle='modal'
                                                    data-target='#exampleModal'
                                                >
                                                    Agregar Descuento
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}

export default Descuentos;
