import React from 'react';
import Sidebar from './Sidebar';
import Nav from './Navbar';
import '../assets/styles/Layout/Layout.scss';

const Layout = ({ children }) => {

  return (
    <>
    <div id="wrapper">
        <Sidebar />
        <div id='content-wrapper' className='d-flex flex-column Layout-ColorFondo'>
          <div id='content' className='Layout-BordeRadius'>
            <Nav />
            {/* <!-- Begin Page Content --> */}
            {/* <div className='container-fluid'> */}

            {/* <!-- Page Heading --> */}
            {/* <div className='d-sm-flex align-items-center justify-content-between mb-4'> */}

            { children }
            {/* </div> */}

            {/* </div> */}
            {/* <!-- /.container-fluid --> */}
          </div>
        </div>
      </div>

      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up" />
      </a>

      {/* <!-- Logout Modal--> */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ready to Leave?
              </h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              Select "Logout" below if you are ready to end your
              current session.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <a className="btn btn-primary" href="login.html">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
      /*<div id='wrapper'>
        <Sidebar />
        <div id='content-wrapper' className='d-flex flex-column Layout-ColorFondo'>
          <div id='content' className="Layout-BordeRadius">
            {/* <Nav /> *
            /* <!-- Begin Page Content --> 
            /* <div className='container-fluid'> }

              {/* <!-- Page Heading --> *
              {/* <div className='d-sm-flex align-items-center justify-content-between mb-4'> 

                { children }
              {/* </div> 

            {/* </div> *
            {/* <!-- /.container-fluid --> 
          </div>
        </div>

      </div>

      <a className='scroll-to-top rounded' href='#page-top'>
        <i className='fas fa-angle-up' />
      </a>
      {/* <!-- Logout Modal--> 
      <div className='modal fade' id='logoutModal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>Ready to Leave?</h5>
              <button className='close' type='button' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <div className='modal-body'>Select "Logout" below if you are ready to end your current session.</div>
            <div className='modal-footer'>
              <button className='btn btn-secondary' type='button' data-dismiss='modal'>Cancel</button>
              <a className='btn btn-primary' href='login.html'>Logout</a>
            </div>
          </div>
        </div>
      </div>
    </>*/
  );
};

export default Layout;
