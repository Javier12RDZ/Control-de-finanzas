import { useState } from 'react';

function AddExpenseForm({ accounts, onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');

  // Asegurarse de que el accountId tenga un valor por defecto si hay cuentas
  if (!accountId && accounts.length > 0) {
    setAccountId(accounts[0].id);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !accountId) {
      alert('Por favor, completa todos los campos y selecciona una cuenta.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      accountId: parseInt(accountId, 10),
      date: new Date().toISOString(),
    };

    onAddTransaction(newTransaction);

    // Limpiar formulario
    setDescription('');
    setAmount('');
  };

  if (accounts.length === 0) {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h2 className="card-title">Registrar Gasto</h2>
                <p className='text-muted'>Primero debes agregar una cuenta para poder registrar un gasto.</p>
            </div>
        </div>
    ); 
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">Registrar Gasto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="expenseDescription" className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              id="expenseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Café, Transporte, Comida"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expenseAmount" className="form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="expenseAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 50.00"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="expenseAccount" className="form-label">Cuenta</label>
              <select
                className="form-select"
                id="expenseAccount"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.bank})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-success">Agregar Gasto</button>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseForm;
