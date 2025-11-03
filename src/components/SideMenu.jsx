import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';

function SideMenu({ show, onHide, onApplyFilter, onClearFilter, onShowModal }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      onApplyFilter(startDate, endDate);
      onHide(); // Cierra el menú después de generar el reporte
    }
  };

  const handleActionClick = (modalName) => {
    onShowModal(modalName);
    onHide(); // Cierra el menú para mostrar el modal
  };

  return (
    <Offcanvas show={show} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Opciones</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h6>Acciones Rápidas</h6>
        <div className="d-grid gap-2 mb-4">
          <button className="btn btn-primary" onClick={() => handleActionClick('expense')}>Agregar Gasto</button>
          <button className="btn btn-success" onClick={() => handleActionClick('income')}>Registrar Ingreso</button>
          <button className="btn btn-info" onClick={() => handleActionClick('account')}>Agregar Cuenta</button>
          <button className="btn btn-warning" onClick={() => handleActionClick('transfer')}>Realizar Pago/Transferencia</button>
          <button className="btn btn-info" onClick={() => handleActionClick('internalTransfer')}>Transferencia Interna</button>
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SideMenu;
