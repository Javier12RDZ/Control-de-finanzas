import React, { useState } from 'react';

function SideMenu({ onApplyFilter, onClearFilter }) {
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
        <h5 className="offcanvas-title" id="appSideMenuLabel">Opciones Avanzadas</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <h6>Generar Reporte por Periodo</h6>
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
