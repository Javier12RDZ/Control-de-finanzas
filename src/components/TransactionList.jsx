import React from 'react';

function TransactionList({ transactions, accounts, onEdit, onDelete }) {
  const getAccountDetails = (accountId) => {
    return accounts.find(acc => acc.id === accountId);
  };

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Historial de Transacciones</h3>
        <ul className="list-group list-group-flush">
          {sortedTransactions.length === 0 ? (
            <li className="list-group-item">No hay transacciones registradas.</li>
          ) : (
            sortedTransactions.map(tx => {
              const account = getAccountDetails(tx.accountId);
              const accountName = account ? `${account.name} (${account.currency})` : 'Cuenta no encontrada';

              return (
                <li key={tx.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="my-0">{tx.description}</h6>
                      <small className="text-muted">{tx.category} | {accountName}</small>
                      {tx.conversionDetails && (
                        <small className="d-block text-info fw-bold">
                          {`Pagado: ${formatCurrency(tx.conversionDetails.fromAmount, tx.conversionDetails.fromCurrency)} @ ${tx.conversionDetails.exchangeRate}`}
                        </small>
                      )}
                    </div>
                    <div className="text-end">
                      {tx.type === 'income' ? (
                          <span className="text-success fw-bold">{formatCurrency(tx.amount, account?.currency)}</span>
                      ) : (
                          <span className="text-danger fw-bold">{formatCurrency(tx.amount, account?.currency)}</span>
                      )}
                      <small className="d-block text-muted">{new Date(tx.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(tx)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(tx.id)}>Eliminar</button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default TransactionList;
