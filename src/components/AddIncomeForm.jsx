import { useState } from 'react';

function AddIncomeForm({ accounts, onAddIncome }) {
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Solo permitir ingresos a cuentas de débito/efectivo
  const eligibleAccounts = accounts.filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountId || !description || !amount) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    onAddIncome({ 
      accountId: parseInt(accountId),
      description,
      amount: parseFloat(amount),
      date
    });
    // Limpiar
    setDescription('');
    setAmount('');
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">Registrar Ingreso</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="incomeAccount" className="form-label">Depositar en la cuenta</label>
            <select id="incomeAccount" className="form-select" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona una cuenta</option>
              {eligibleAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="incomeDesc" className="form-label">Descripción del Ingreso</label>
            <input id="incomeDesc" type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Salario, Venta" required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="incomeAmount" className="form-label">Monto</label>
              <input id="incomeAmount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="incomeDate" className="form-label">Fecha</label>
              <input id="incomeDate" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success">Registrar Ingreso</button>
        </form>
      </div>
    </div>
  );
}

export default AddIncomeForm;
