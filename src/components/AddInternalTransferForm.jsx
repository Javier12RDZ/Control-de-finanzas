import React, { useState, useEffect } from 'react';

function AddInternalTransferForm({ accounts, onAddInternalTransfer, getLocalDateString }) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getLocalDateString(new Date()));
  const [exchangeRateInput, setExchangeRateInput] = useState(''); // Valor del input del tipo de cambio
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');

  const eligibleAccounts = accounts.filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo');

  useEffect(() => {
    const fromAcc = accounts.find(acc => acc.id === parseInt(fromAccountId));
    const toAcc = accounts.find(acc => acc.id === parseInt(toAccountId));

    if (fromAcc && toAcc && fromAcc.currency !== toAcc.currency) {
      // Solo soportamos USD y MXN por ahora
      if (!((fromAcc.currency === 'USD' && toAcc.currency === 'MXN') || (fromAcc.currency === 'MXN' && toAcc.currency === 'USD'))) {
        alert('Por ahora, las transferencias entre diferentes monedas solo están soportadas entre USD y MXN.');
        setShowExchangeRate(false);
        setExchangeRateInput('');
        return;
      }
      setShowExchangeRate(true);
      setFromCurrency(fromAcc.currency);
      setToCurrency(toAcc.currency);
    } else {
      setShowExchangeRate(false);
      setExchangeRateInput('');
    }
  }, [fromAccountId, toAccountId, accounts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !amount || (showExchangeRate && !exchangeRateInput)) {
      alert('Por favor, completa todos los campos, incluyendo el tipo de cambio si es necesario.');
      return;
    }
    if (fromAccountId === toAccountId) {
      alert('La cuenta de origen y destino no pueden ser la misma.');
      return;
    }

    let actualExchangeRate = null;
    if (showExchangeRate) {
      const rate = parseFloat(exchangeRateInput);
      // Si la transferencia es de MXN a USD, el tipo de cambio que necesitamos es 1/rate (USD por MXN)
      // Si es de USD a MXN, el tipo de cambio es el mismo (MXN por USD)
      if (fromCurrency === 'MXN' && toCurrency === 'USD') {
        actualExchangeRate = 1 / rate;
      } else {
        actualExchangeRate = rate;
      }
    }

    onAddInternalTransfer({
      from: parseInt(fromAccountId),
      to: parseInt(toAccountId),
      amount: parseFloat(amount),
      date: date,
      exchangeRate: actualExchangeRate,
    });

    // Limpiar formulario
    setFromAccountId('');
    setToAccountId('');
    setAmount('');
    setExchangeRateInput('');
    setDate(getLocalDateString(new Date()));
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">Transferencia Interna</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fromAccount" className="form-label">Desde la cuenta</label>
            <select id="fromAccount" className="form-select" value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona cuenta de origen</option>
              {eligibleAccounts.map(acc => <option key={acc.id} value={acc.id}>{`${acc.name} (${acc.currency})`}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccount" className="form-label">Hacia la cuenta</label>
            <select id="toAccount" className="form-select" value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
              <option value="" disabled>Selecciona cuenta de destino</option>
              {eligibleAccounts.map(acc => <option key={acc.id} value={acc.id}>{`${acc.name} (${acc.currency})`}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transferAmount" className="form-label">Monto a Transferir</label>
            <input id="transferAmount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </div>

          {showExchangeRate && (
            <div className="mb-3 p-3 bg-light border rounded">
              <label htmlFor="exchangeRateInput" className="form-label fw-bold">Tipo de Cambio</label>
              <p className="form-text">Estás transfiriendo entre diferentes monedas.</p>
              <div className="input-group">
                <span className="input-group-text">1 USD =</span>
                <input id="exchangeRateInput" type="number" step="0.01" className="form-control" value={exchangeRateInput} onChange={(e) => setExchangeRateInput(e.target.value)} placeholder="0.00" required />
                <span className="input-group-text">MXN</span>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="transferDate" className="form-label">Fecha</label>
            <input type="date" className="form-control" id="transferDate" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Realizar Transferencia</button>
        </form>
      </div>
    </div>
  );
}

export default AddInternalTransferForm;
