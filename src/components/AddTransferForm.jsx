import { useState } from 'react';

function AddTransferForm({ accounts, onAddTransfer }) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');

  const debitAccounts = accounts.filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo');
  const creditAccounts = accounts.filter(acc => acc.type === 'Tarjeta de Crédito');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !amount) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    onAddTransfer({ 
      from: parseInt(fromAccountId), 
      to: parseInt(toAccountId), 
      amount: parseFloat(amount) 
    });
    setAmount('');
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">Realizar Pago / Transferencia</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fromAccount" className="form-label">Desde la cuenta (Origen)</label>
            <select id="fromAccount" className="form-select" value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona una cuenta de débito</option>
              {debitAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccount" className="form-label">Hacia la cuenta (Destino)</label>
            <select id="toAccount" className="form-select" value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona una tarjeta de crédito</option>
              {creditAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transferAmount" className="form-label">Monto a Pagar</label>
            <input id="transferAmount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </div>
          <button type="submit" className="btn btn-success">Realizar Pago</button>
        </form>
      </div>
    </div>
  );
}

export default AddTransferForm;
