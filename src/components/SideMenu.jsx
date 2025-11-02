import React, { useState } from 'react';

function SideMenu({ onApplyFilter, onClearFilter, onShowModal }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      onApplyFilter(startDate, endDate);
    }
  };

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="appSideMenu" aria-labelledby="appSideMenuLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="appSideMenuLabel">Opciones</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <h6>Acciones Rápidas</h6>
        <div className="d-grid gap-2 mb-4">
          <button className="btn btn-primary" data-bs-dismiss="offcanvas" onClick={() => onShowModal('expense')}>Agregar Gasto</button>
          <button className="btn btn-success" data-bs-dismiss="offcanvas" onClick={() => onShowModal('income')}>Registrar Ingreso</button>
          <button className="btn btn-info" data-bs-dismiss="offcanvas" onClick={() => onShowModal('account')}>Agregar Cuenta</button>
          <button className="btn btn-warning" data-bs-dismiss="offcanvas" onClick={() => onShowModal('transfer')}>Realizar Pago/Transferencia</button>
        </div>

        <hr />

        <h6>Reporte por Periodo</h6>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
          <input type="date" className="form-control" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">Fecha Fin</label>
          <input type="date" className="form-control" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="d-grid gap-2">
          <button className="btn btn-primary" onClick={handleGenerateReport}>Generar Reporte</button>
          <button className="btn btn-secondary" onClick={() => { setStartDate(''); setEndDate(''); onClearFilter(); }}>Limpiar Filtro</button>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
