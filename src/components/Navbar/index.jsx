/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../assets/styles/components/Navbar/Navbar.scss';


export default function Navbar() {
  return ( <nav className="navbar navbar-expand navbar-light topbar static-top Nabvar-Estilo"
  id="nabvar">
    {/* <!-- Sidebar Toggle (Topbar) --> */}
    <button
      id="sidebarToggleTop"
      className="btn btn-link d-md-none rounded-circle mr-3 Nabvar-Hamburguesa"
    >
      <i className="fa fa-bars" />
    </button>

    {/* <!-- Topbar Search --> */}
    {/* <form className='d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search'>
      <div className='input-group'>
        <input type='text' className='form-control bg-light border-0 small' placeholder='Search for...' aria-label='Search' aria-describedby='basic-addon2' />
        <div className='input-group-append'>
          <button className='btn btn-primary' type='button'>
            <i className='fa fa-search' />
          </button>
        </div>
      </div>
    </form> */}

    {/* <!-- Topbar Navbar --> */}
    <ul className='navbar-nav ml-auto'>

      {/* <li className='nav-item dropdown no-arrow d-sm-none'>
        <a className='nav-link dropdown-toggle' href='#' id='searchDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
          <i className='fa fa-search' />
        </a>
        <div className='dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in' aria-labelledby='searchDropdown'>
          <form className='form-inline mr-auto w-100 navbar-search'>
            <div className='input-group'>
              <input type='text' className='form-control bg-light border-0 small' placeholder='Search for...' aria-label='Search' aria-describedby='basic-addon2' />
              <div className='input-group-append'>
                <button className='btn btn-primary' type='button'>
                  <i className='fa fa-search' />
                </button>
              </div>
            </div>
          </form>
        </div>
      </li> */}

      {/* <li className='nav-item dropdown no-arrow'>
        <a className='nav-link dropdown-toggle' href='#' id='userDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
          <span className='mr-2 d-none d-lg-inline text-gray-600 small'>Valerie Luna</span>
          <img className='img-profile rounded-circle' src='https://source.unsplash.com/QAB-WJcbgJk/60x60' />
        </a>
        <div className='dropdown-menu dropdown-menu-right shadow animated--grow-in' aria-labelledby='userDropdown'>
          <a className='dropdown-item' href='#'>
            <i className='fa fa-user mr-2 text-gray-400' />
            Profile
          </a>
          <a className='dropdown-item' href='#'>
            <i className='fa fa-cogs mr-2 text-gray-400' />
            Settings
          </a>
          <a className='dropdown-item' href='#'>
            <i className='fa fa-list mr-2 text-gray-400' />
            Activity Log
          </a>
          <div className='dropdown-divider' />
          <a className='dropdown-item' href='#' data-toggle='modal' data-target='#logoutModal'>
            <i className='fa fa-sign-out mr-2 text-gray-400' />
            Logout
          </a>
        </div>
      </li> */}
    </ul>
  </nav>

  );
}
