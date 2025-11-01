import React from 'react';

function AccountList({ accounts }) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  if (accounts.length === 0) {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Mis Cuentas</h2>
          <p className="text-muted">Aún no has agregado ninguna cuenta. ¡Añade una para empezar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">Mis Cuentas</h2>
        <ul className="list-group list-group-flush">
          {accounts.map(account => (
            <li key={account.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{account.name}</h5>
                <small className="text-muted">{account.bank} - {account.type}</small>
              </div>
              <div className="text-end">
                {account.type === 'Crédito' ? (
                  <div>
                    <span className="fw-bold">{formatCurrency(account.currentBalance)}</span>
                    <small className="d-block text-muted">de {formatCurrency(account.balance)}</small>
                  </div>
                ) : (
                  <span className="fw-bold fs-5">{formatCurrency(account.currentBalance)}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AccountList;
