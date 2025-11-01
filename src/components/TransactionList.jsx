import React from 'react';

function TransactionList({ transactions, accounts }) {

  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Cuenta no encontrada';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  }

  // Ordenar transacciones por fecha, de la más reciente a la más antigua
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">Historial de Gastos</h2>
        {sortedTransactions.length === 0 ? (
          <p className="text-muted">No hay gastos registrados todavía.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {sortedTransactions.map(tx => (
              <li key={tx.id} className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{tx.description}</h5>
                  <span className="fw-bold text-danger">-{formatCurrency(tx.amount)}</span>
                </div>
                <p className="mb-1 text-muted">Pagado con: {getAccountName(tx.accountId)}</p>
                <small>{formatDate(tx.date)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
