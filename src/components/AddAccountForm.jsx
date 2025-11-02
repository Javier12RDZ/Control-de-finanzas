import { useState } from 'react';

function AddAccountForm({ onAddAccount }) {
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [accountType, setAccountType] = useState('Cuenta de Ahorro/Débito');
  const [currency, setCurrency] = useState('MXN'); // Estado para la moneda

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountName.trim() || !initialBalance.trim()) return;

    const initial = parseFloat(initialBalance);

    const newAccount = {
      id: Date.now(),
      name: accountName,
      bank: bankName,
      type: accountType,
      currency: currency, // Añadir moneda al objeto de la cuenta
      balance: initial, 
      currentBalance: accountType === 'Préstamo Personal' ? initial : (accountType === 'Tarjeta de Crédito' ? 0 : initial),
    };

    onAddAccount(newAccount);

    // Limpiar formulario
    setAccountName('');
    setBankName('');
    setInitialBalance('');
    setAccountType('Cuenta de Ahorro/Débito');
    setCurrency('MXN'); // Resetear moneda
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Agregar Nueva Cuenta</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="accountName" className="form-label">Nombre de la Cuenta</label>
            <input
              type="text"
              className="form-control"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Ej: Nómina, Ahorros, TC Oro"
              required
            />
          </div>
           <div className="mb-3">
            <label htmlFor="bankName" className="form-label">Banco (Opcional)</label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Ej: BBVA, Santander"
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="accountType" className="form-label">Tipo de Cuenta</label>
                <select
                  className="form-select"
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option>Cuenta de Ahorro/Débito</option>
                  <option>Efectivo</option>
                  <option>Tarjeta de Crédito</option>
                  <option>Préstamo Personal</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="currency" className="form-label">Moneda</label>
                <select
                  className="form-select"
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="MXN">Pesos (MXN)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="initialBalance" className="form-label">
              {accountType === 'Tarjeta de Crédito' ? 'Límite de Crédito' : 'Balance Inicial'}
            </label>
            <input
              type="number"
              className="form-control"
              id="initialBalance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Agregar Cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default AddAccountForm;
