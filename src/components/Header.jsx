import React from 'react';

function Header({ onOpenSideMenu }) {
  return (
    <header className="d-flex align-items-center pb-3 mb-4 border-bottom">
      <button className="btn btn-light me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#appSideMenu" aria-controls="appSideMenu" onClick={onOpenSideMenu}>
        ☰
      </button>
      <div>
        <h1 className="h4 mb-0">Control de Finanzas Personales</h1>
        <p className="mb-0 text-muted">Gestiona tus cuentas y gastos de forma sencilla.</p>
      </div>
    </header>
  );
}

export default Header;