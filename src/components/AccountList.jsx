import React from 'react';

function AccountList({ accounts, onEdit }) {

  const formatCurrency = (amount, currency = 'MXN') => {
    // Soporte para cuentas viejas que no tienen la propiedad currency
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
      // Fallback por si el código de moneda no es válido
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Resumen de Cuentas</h3>
        <ul className="list-group list-group-flush">
          {accounts.length === 0 ? (
            <li className="list-group-item">No hay cuentas agregadas.</li>
          ) : (
            accounts.map(account => (
              <li key={account.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="my-0">{account.name} <span className="badge bg-secondary">{account.currency || 'MXN'}</span></h6>
                    {account.bank && <small className="text-primary fw-bold">{account.bank}</small>}
                    <small className="text-muted d-block">{account.type}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="text-end me-3">
                      {account.type === 'Tarjeta de Crédito' ? (
                        <>
                          <span className="d-block fw-bold text-success">Disponible: {formatCurrency(account.balance - account.currentBalance, account.currency)}</span>
                          <small className="d-block">Gasto: <span className="text-danger">{formatCurrency(account.currentBalance, account.currency)}</span></small>
                          <small className="text-muted">Límite: {formatCurrency(account.balance, account.currency)}</small>
                        </>
                      ) : (
                        <span className="fw-bold">{formatCurrency(account.currentBalance, account.currency)}</span>
                      )}
                    </div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(account)}>✏️</button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default AccountList;
