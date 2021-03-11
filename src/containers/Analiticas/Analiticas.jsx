import React, { Component } from 'react';
import '../../assets/styles/containers/AprobacionTiendas/Tienda.scss';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import IconActive from '../../hooks/iconActive';

export class Analiticas extends Component {
  componentDidMount() {
    IconActive.checkPath('Siderbar-Analiticas', '/analiticas', this.props.match.path);
}
    render() {
        return (
            <>
                <div className='container-fluid'>
                    <div className='mx-0 mx-md-3 mx-lg-5 mt-5'>
                    <div className='row mb-5' style={{ height: '20px' }}></div>
                        <div className='row mb-5'>
                            <div className='col-12 col-lg-4 mb-3'>
                                <h2 className='Tienda-Titulo mb-0 mt-1'>Analiticas</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Analiticas;
