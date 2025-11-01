import { useState } from 'react';

function AddAccountForm({ onAddAccount }) {
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [type, setType] = useState('Débito');
  const [balance, setBalance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !bank || !balance) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    
    const newAccount = {
      id: Date.now(),
      name,
      bank,
      type,
      // Guardamos el valor como número
      balance: parseFloat(balance),
      // Si es de débito, el balance actual es el mismo que el inicial.
      // Si es de crédito, el balance actual empieza en 0 (no hemos gastado nada).
      currentBalance: type === 'Débito' ? parseFloat(balance) : 0,
    };

    onAddAccount(newAccount);

    // Limpiar formulario
    setName('');
    setBank('');
    setType('Débito');
    setBalance('');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">Agregar Nueva Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="accountName" className="form-label">Nombre de la Cuenta</label>
            <input
              type="text"
              className="form-control"
              id="accountName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Ahorros, Nómina"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bankName" className="form-label">Banco</label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="Ej: BBVA, Santander"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="accountType" className="form-label">Tipo de Cuenta</label>
              <select
                className="form-select"
                id="accountType"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="balance" className="form-label">
                {type === 'Débito' ? 'Balance Inicial' : 'Límite de Crédito'}
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Ej: 5000"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Agregar Cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default AddAccountForm;
