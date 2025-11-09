import React, { useState } from 'react';

function TransactionList({ transactions, accounts, onEdit, onDelete, getLocalDateString }) {
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const getAccountDetails = (accountId) => {
    return accounts.find(acc => acc.id === accountId);
  };

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
      console.error("Failed to format currency with code:", currencyCode);
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  const today = getLocalDateString(new Date());

  const filteredTransactions = showAllTransactions
    ? transactions
    : transactions.filter(tx => tx.date === today);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateB < dateA) return -1;
    if (dateB > dateA) return 1;
    return b.id - a.id; // Fallback to ID for same-day transactions
  });

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">Historial de Transacciones</h3>
        <div className="d-flex justify-content-end mb-3">
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowAllTransactions(!showAllTransactions)}
          >
            {showAllTransactions ? 'Mostrar Transacciones de Hoy' : 'Mostrar Todas las Transacciones'}
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {sortedTransactions.length === 0 ? (
            <li className="list-group-item">No hay transacciones para el período seleccionado.</li>
          ) : (
            sortedTransactions.map(tx => {
              // For new two-account txs, use toAccountId. For old ones, use accountId.
              const displayAccountId = tx.toAccountId || tx.accountId;
              const account = getAccountDetails(displayAccountId);

              let detailLine;
              // For transfers/payments, the description is self-explanatory.
              if (tx.type === 'internalTransfer' || tx.category === 'Pago de Deuda') {
                detailLine = <small className="text-muted">{tx.category}</small>;
              } else {
                // For regular txs, show category and account name.
                const accountName = account ? `${account.name} (${account.currency})` : 'Cuenta no encontrada';
                detailLine = <small className="text-muted">{tx.category} | {accountName}</small>;
              }

              return (
                <li key={tx.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="my-0">{tx.description}</h6>
                      {detailLine}
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
                      <small className="d-block text-muted">{tx.date}</small>
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
