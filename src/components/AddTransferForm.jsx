import { useState, useEffect } from 'react';

function AddTransferForm({ accounts, onAddTransfer }) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');

  const debitAccounts = accounts.filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo');
  const creditAccounts = accounts.filter(acc => acc.type === 'Tarjeta de Crédito' || acc.type === 'Préstamo Personal');

  useEffect(() => {
    const fromAcc = accounts.find(acc => acc.id === parseInt(fromAccountId));
    const toAcc = accounts.find(acc => acc.id === parseInt(toAccountId));

    if (fromAcc && toAcc && fromAcc.currency !== toAcc.currency) {
      setShowExchangeRate(true);
      setFromCurrency(fromAcc.currency);
      setToCurrency(toAcc.currency);
    } else {
      setShowExchangeRate(false);
      setExchangeRate('');
    }
  }, [fromAccountId, toAccountId, accounts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !amount || (showExchangeRate && !exchangeRate)) {
      alert('Por favor, completa todos los campos, incluyendo el tipo de cambio si es necesario.');
      return;
    }
    onAddTransfer({
      from: parseInt(fromAccountId),
      to: parseInt(toAccountId),
      amount: parseFloat(amount),
      exchangeRate: showExchangeRate ? parseFloat(exchangeRate) : null,
    });
    setAmount('');
    setExchangeRate('');
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
              {debitAccounts.map(acc => <option key={acc.id} value={acc.id}>{`${acc.name} (${acc.currency})`}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccount" className="form-label">Hacia la cuenta (Destino)</label>
            <select id="toAccount" className="form-select" value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona una deuda (Tarjeta o Préstamo)</option>
              {creditAccounts.map(acc => <option key={acc.id} value={acc.id}>{`${acc.name} (${acc.currency})`}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transferAmount" className="form-label">Monto a Pagar</label>
            <input id="transferAmount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </div>

          {showExchangeRate && (
            <div className="mb-3 p-3 bg-light border rounded">
              <label htmlFor="exchangeRate" className="form-label fw-bold">Tipo de Cambio</label>
              <p className="form-text">Estás transfiriendo entre diferentes monedas.</p>
              <div className="input-group">
                <span className="input-group-text">1 {fromCurrency} =</span>
                <input id="exchangeRate" type="number" step="0.01" className="form-control" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} placeholder="0.00" required />
                <span className="input-group-text">{toCurrency}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-success">Realizar Pago</button>
        </form>
      </div>
    </div>
  );
}

export default AddTransferForm;
