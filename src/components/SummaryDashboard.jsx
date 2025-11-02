import React from 'react';

function SummaryDashboard({ transactions, accounts }) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().slice(0, 10);
    return transactions
      .filter(tx => tx.date === today)
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getWeekExpenses = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const firstDayStr = firstDay.toISOString().slice(0, 10);

    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    const lastDayStr = lastDay.toISOString().slice(0, 10);

    return transactions
      .filter(tx => tx.date >= firstDayStr && tx.date <= lastDayStr)
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getTotalCreditCardDebt = () => {
    return accounts
      .filter(acc => acc.type === 'Tarjeta de Crédito')
      .reduce((total, acc) => total + acc.currentBalance, 0);
  };

  const getTotalDebitBalance = () => {
    return accounts
      .filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo')
      .reduce((total, acc) => total + acc.currentBalance, 0);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Resumen General</h3>
        <div className="row text-center">
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Total en Cuentas</h5>
              <p className="fs-4 text-success fw-bold">{formatCurrency(getTotalDebitBalance())}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Deuda en Tarjetas</h5>
              <p className="fs-4 text-danger fw-bold">{formatCurrency(getTotalCreditCardDebt())}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Gastos de la Semana</h5>
              <p className="fs-4 text-warning fw-bold">{formatCurrency(getWeekExpenses())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryDashboard;
