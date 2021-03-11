import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import '../../assets/styles/Tablas/Tablas.scss';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Icono_Senal from '../../assets/images/components/Iconos/señal.svg';
const options = {
    paginationSize: 5,
    pageStartIndex: 1,
    alwaysShowAllBtns: false, // Always show next and previous button
    withFirstAndLast: true, // Hide the going to First and Last page button
    hideSizePerPage: true, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    prePageText: 'Anterior',
    nextPageText: 'Siguiente',
    // paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
        {
            text: '10',
            value: 10
        },
        {
            text: '10',
            value: 10
        },
        {
            text: '30',
            value: 30
        }
    ] // A numeric array is also available. the purpose of above example is custom the text
};

export class Tabla extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    MySearch = (props) => {
        let input;

        const handleClick = () => {
            props.onSearch(input.value);
            // $('.react-bootstrap-table-pagination-list').removeClass('col-md-6 col-xs-6 col-sm-6 col-lg-6');
            // $('.react-bootstrap-table-pagination-list').addClass('col-2 offset-5 mt-4');
            // $('.react-bootstrap-table-page-btns-ul ').addClass('ml-5');
        };
        const onChange = () => {
            props.onSearch(input.value);
            // $('.react-bootstrap-table-pagination-list').removeClass('col-md-6 col-xs-6 col-sm-6 col-lg-6');
            // $('.react-bootstrap-table-pagination-list').addClass('col-2 offset-5 mt-4');
            // $('.react-bootstrap-table-page-btns-ul ').addClass('ml-5');
        };
        return (
            <div className='row mb-5 mt-3'>
                <div className='col-12 col-lg-4 align-self-center'>
                    <h2 className='Tienda-Titulo mb-0 '>Aprobación de Tiendas</h2>
                </div>
                <div className='col-6 col-sm-4 col-lg-2 offset-lg-2'>
                    <div className='input-group Tienda-inputShadow '>
                        <div className='input-group-prepend'>
                            <span className='input-group-text Tienda-Inputprepend py-0' id='basic-addon1'>
                                <i className='fa fa-search text-muted'></i>
                            </span>
                        </div>
                        <input
                            type='text'
                            className='form-control search text-muted py-0 input-sm Tienda-Inputprepend-Input'
                            ref={(n) => (input = n)}
                            onChange={onChange}
                            placeholder='Buscar'
                            aria-label='Username'
                            aria-describedby='basic-addon1'
                        />
                        <button className='' id='HomeBtnSearch' onClick={handleClick}>
                            Click to Search!!
                        </button>
                    </div>
                </div>
                <div className='col-6 col-sm-4 col-lg-2'>
                    <div className='input-group Tienda-inputShadow'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text Tienda-Inputprepend' id='basic-addon1'>
                                <img src={Icono_Senal} alt='' />
                            </span>
                        </div>
                        <select
                            name=''
                            id=''
                            className='form-control text-muted Tienda-Inputprepend-Input'
                            placeholder='Buscar'
                            aria-label='Buscar'
                            aria-describedby='basic-addon1'
                        >
                            {/* <option value=''>Ordenar por</option> */}
                            {this.props.Columnas.map((item, index) =>{
                              console.log(item.text);
                              console.log(this.props.Columnas[this.props.Columnas.length-1].text);
                              return (
                                <option key={index} value={item.text} >{item.text === this.props.Columnas[this.props.Columnas.length-1].text ? ' ' : item.text }</option>
                              );
                            })}
                        </select>
                    </div>
                </div>
                <div className='col-12 col-sm-4 col-lg-2 text-center text-md-left mt-3 mt-md-0'>
                    {this.props.Modal === true ? (
                        <button
                            type='button'
                            class='btn btn-primary'
                            data-toggle='modal'
                            data-target={this.props.ModalID}
                        >
                            Launch demo modal
                        </button>
                    ) : (
                        <button className='btn text-white px-4 py-2 Tienda-btnMorado'>
                            <i className='fa fa-filter mr-2'></i>Filtrar
                        </button>
                    )}
                    {/* <button className='btn text-white px-4 py-2 Tienda-btnMorado'>
                      <i className='fa fa-filter mr-2'></i>Filtrar
                  </button>
                  <button type='button' class='btn btn-primary' data-toggle='modal' data-target={this.props.modal}>
                      Launch demo modal
                  </button>  */}
                </div>
                {/* <div className='col-3 col-sm-2 offset-2 offset-sm-2 text-center'>
                  <input
                      className='form-control'
                      ref={(n) => (input = n)}
                      type='text'
                      onChange={onChange}
                      placeholder='Buscar...'
                  />
                  <button className='' id='HomeBtnSearch' onClick={handleClick}>
                      Click to Search!!
                  </button>
              </div> */}
            </div>
        );
    };
    render() {
        const { Columnas, Datos, Modal, ModalID } = this.props;
        console.log('Columnas', Columnas);
        console.log('Datos', Datos);
        console.log('Modal', Modal);
        console.log('Modal_ID', ModalID);
        return (
            <>
                <ToolkitProvider keyField='ID' data={Datos} columns={Columnas} search={{ defaultSearch: ' ' }}>
                    {(props) => (
                        <div>
                            <this.MySearch {...props.searchProps} />
                            <BootstrapTable
                                {...props.baseProps}
                                bordered={false}
                                wrapperClasses='table-responsive'
                                classes='TablaEstilo'
                                bodyClasses='text-left TiendaTabla-Body'
                                headerWrapperClasses='text-left TiendaTabla-Thead'
                                rowClasses=''
                                pagination={paginationFactory(options)}
                            />
                        </div>
                    )}
                </ToolkitProvider>
            </>
        );
    }
}

export default Tabla;
