import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

function ReportWindow({ closeWindow, transactions, reportSummary, dateFilter }) {
  const newWindow = useRef(null);
  const [container, setContainer] = useState(null);

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) { // eslint-disable-line no-unused-vars
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  useEffect(() => {
    newWindow.current = window.open('', '', 'width=800,height=600');
    const newWindowRoot = newWindow.current.document.createElement('div');
    newWindow.current.document.body.appendChild(newWindowRoot);
    setContainer(newWindowRoot);

    const bootstrapLink = newWindow.current.document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    newWindow.current.document.head.appendChild(bootstrapLink);

    newWindow.current.document.title = `Reporte del ${dateFilter.start} al ${dateFilter.end}`;

    const handleBeforeUnload = () => {
      closeWindow();
    };
    newWindow.current.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      newWindow.current.removeEventListener('beforeunload', handleBeforeUnload);
      newWindow.current.close();
    };
  }, [closeWindow, dateFilter]);

  const ReportContent = (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Reporte del ${dateFilter.start} al ${dateFilter.end}</h3>
        <button className="btn btn-primary" onClick={() => newWindow.current.print()}>Imprimir</button>
      </div>

      {reportSummary && (
        <div className="mb-4">
          <h4>Resumen del Periodo</h4>
          {Object.keys(reportSummary).map(currency => (
            <div key={currency} className="mb-3 p-3 border rounded">
              <h5 className="mb-3">Moneda: <span className="badge bg-info">{currency}</span></h5>
              <div className="row text-center">
                <div className="col-md-6">
                  <div className="p-2 bg-light rounded h-100">
                    <h5>Ingresos del Periodo</h5>
                    <p className="fs-4 text-success fw-bold">{formatCurrency(reportSummary[currency].income, currency)}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-2 bg-light rounded h-100">
                    <h5>Gastos del Periodo</h5>
                    <p className="fs-4 text-danger fw-bold">{formatCurrency(reportSummary[currency].expense, currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4>Transacciones del Periodo</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td className={tx.type === 'income' ? 'text-success' : 'text-danger'}>
                {formatCurrency(tx.amount, tx.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (container) {
    return ReactDOM.createPortal(ReportContent, container);
  }

  return null;
}

export default ReportWindow;
