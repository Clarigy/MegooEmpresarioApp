/* eslint-disable import/no-named-as-default */
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginTest from '../containers/Login/LoginTest';
import Descuentos from '../containers/Descuentos/Descuentos';
import Perfil from '../containers/Perfil/Perfil';
import Tiendas from '../containers/Tiendas/Tiendas';
import Equipo from '../containers/Equipo/Equipo';
import Agenda from '../containers/Agenda/Agenda';
import Clientes from '../containers/Clientes/Clientes';
import Tienda from '../containers/Tienda/Tienda';
import Servicios from '../containers/Servicios/Servicios';
import Productos from '../containers/Productos/Productos';
import Empleado from '../containers/Empleado/Empleado';
import EmpleadoProductos from '../containers/EmpleadoProductos/EmpleadoProductos';
import EmpleadoServicios from '../containers/EmpleadoServicios/EmpleadoServicios';
import CrearTienda from '../containers/CrearTienda/CrearTienda';
import BalancePagos from '../containers/BalancePagos/BalancePagos';
import Analiticas from '../containers/Analiticas/Analiticas';
import { AuthContextProvider } from '../firebase';
import ProtectRoute from '../components/ProtectRoute/ProtectRoute';
import Root from '../components/Root/Root';
import SignUp from '../containers/SignUp/SignUp';

const App = () => (
  <BrowserRouter>
    <AuthContextProvider>
      <Layout>
        <Root>
          <Switch>
            <ProtectRoute type='public'  exact path='/' component={LoginTest} />
            <ProtectRoute type='private' exact path='/signup' component={SignUp} />
            <ProtectRoute type='private' exact path='/perfil' component={Perfil}  />
            
            <ProtectRoute type='private' exact path='/tiendas' component={Tiendas} />
            <ProtectRoute type='private' exact path='/tienda' component={Tienda} />
            <ProtectRoute type='private' exact path='/servicios' component={Servicios} />
            <ProtectRoute type='private' exact path='/productos' component={Productos} />
            <ProtectRoute type='private' exact path='/empleado' component={Empleado} />
            <ProtectRoute type='private' exact path='/agenda' component={Agenda} />
            <ProtectRoute type='private' exact path='/empleadoProductos' component={EmpleadoProductos} />
            <ProtectRoute type='private' exact path='/empleadoServicios' component={EmpleadoServicios} />
            <ProtectRoute type='private' exact path='/equipo' component={Equipo} />
            <ProtectRoute type='private' exact path='/clientes' component={Clientes} />
            <ProtectRoute type='private' exact path='/crearTienda' component={CrearTienda} />
            <ProtectRoute type='private' exact path='/descuentos' component={Descuentos} />
            <ProtectRoute type='private' exact path='/balancepagos' component={BalancePagos} />
            <ProtectRoute type='private' exact path='/analiticas' component={Analiticas} />
          </Switch>
        </Root>
      </Layout>
    </AuthContextProvider>
  </BrowserRouter>
);

export default App;
