import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

function ReportWindow({ closeWindow, transactions, reportSummary, dateFilter }) {
  const newWindow = useRef(null);
  const [container, setContainer] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDescription, setFilterDescription] = useState('');

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) { // eslint-disable-line no-unused-vars
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  // 1. Obtener categorías únicas para el selector
  const uniqueCategories = useMemo(() => {
    const categories = transactions.map(tx => tx.category).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [transactions]);

  // 2. Filtrar transacciones según los inputs
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesCategory = filterCategory ? tx.category === filterCategory : true;
      const matchesDescription = filterDescription 
        ? tx.description.toLowerCase().includes(filterDescription.toLowerCase()) 
        : true;
      return matchesCategory && matchesDescription;
    });
  }, [transactions, filterCategory, filterDescription]);

  // 3. Recalcular el resumen basado en las transacciones filtradas
  const filteredSummary = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const currency = tx.currency || 'MXN';
      if (!acc[currency]) {
        acc[currency] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        acc[currency].income += tx.amount;
      } else if (tx.type !== 'internalTransfer' && tx.category !== 'Pago de Deuda') {
        acc[currency].expense += tx.amount;
      }
      return acc;
    }, {});
  }, [filteredTransactions]);


  useEffect(() => {
    newWindow.current = window.open('', '', 'width=900,height=700');
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
      if (newWindow.current) {
        newWindow.current.removeEventListener('beforeunload', handleBeforeUnload);
        newWindow.current.close();
      }
    };
  }, [closeWindow, dateFilter]); // Intentionalmente no incluimos los filtros aquí para no reabrir la ventana

  const ReportContent = (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Reporte del {dateFilter.start} al {dateFilter.end}</h3>
        <button className="btn btn-primary no-print" onClick={() => newWindow.current.print()}>Imprimir</button>
      </div>

      {/* Filtros */}
      <div className="card mb-4 bg-light">
        <div className="card-body">
            <h5 className="card-title mb-3">Filtrar Reporte</h5>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Descripción</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Buscar por descripción..." 
                        value={filterDescription}
                        onChange={(e) => setFilterDescription(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Categoría</label>
                    <select 
                        className="form-select" 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-4">
        <h4>Resumen del Periodo (Filtrado)</h4>
        {Object.keys(filteredSummary).length > 0 ? (
            Object.keys(filteredSummary).map(currency => (
                <div key={currency} className="mb-3 p-3 border rounded shadow-sm">
                <h5 className="mb-3">Moneda: <span className="badge bg-info">{currency}</span></h5>
                <div className="row text-center">
                    <div className="col-md-6">
                    <div className="p-2 bg-white rounded border h-100">
                        <h6 className="text-muted">Ingresos</h6>
                        <p className="fs-4 text-success fw-bold mb-0">{formatCurrency(filteredSummary[currency].income, currency)}</p>
                    </div>
                    </div>
                    <div className="col-md-6">
                    <div className="p-2 bg-white rounded border h-100">
                        <h6 className="text-muted">Gastos</h6>
                        <p className="fs-4 text-danger fw-bold mb-0">{formatCurrency(filteredSummary[currency].expense, currency)}</p>
                    </div>
                    </div>
                </div>
                </div>
            ))
        ) : (
            <p className="text-muted fst-italic">No hay datos para el filtro seleccionado.</p>
        )}
      </div>

      <h4>Detalle de Transacciones ({filteredTransactions.length})</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
            <thead className="table-dark">
            <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
            </tr>
            </thead>
            <tbody>
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                    <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td>{tx.category}</td>
                    <td className={tx.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className="text-center text-muted">No se encontraron transacciones.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );

  if (container) {
    return ReactDOM.createPortal(ReportContent, container);
  }

  return null;
}

export default ReportWindow;
