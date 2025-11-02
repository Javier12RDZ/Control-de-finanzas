import React from 'react';

function SummaryDashboard({ transactions, accounts, dateFilter }) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().slice(0, 10);
    return transactions
      .filter(tx => tx.date === today && tx.type !== 'income')
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
      .filter(tx => tx.date >= firstDayStr && tx.date <= lastDayStr && tx.type !== 'income')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getWeeklyIncome = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const firstDayStr = firstDay.toISOString().slice(0, 10);

    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    const lastDayStr = lastDay.toISOString().slice(0, 10);

    return transactions
      .filter(tx => tx.date >= firstDayStr && tx.date <= lastDayStr && tx.type === 'income')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getTotalDebt = () => {
    return accounts
      .filter(acc => acc.type === 'Tarjeta de Crédito' || acc.type === 'Préstamo Personal')
      .reduce((total, acc) => total + acc.currentBalance, 0);
  };

  const getTotalDebitBalance = () => {
    return accounts
      .filter(acc => acc.type === 'Cuenta de Ahorro/Débito' || acc.type === 'Efectivo')
      .reduce((total, acc) => total + acc.currentBalance, 0);
  };

  // --- Lógica para el reporte por fechas ---
  const getReportTransactions = () => {
    if (!dateFilter.start || !dateFilter.end) return [];
    return transactions.filter(tx => tx.date >= dateFilter.start && tx.date <= dateFilter.end);
  };

  const getReportExpenses = () => {
    return getReportTransactions()
      .filter(tx => tx.type !== 'income')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getReportIncome = () => {
    return getReportTransactions()
      .filter(tx => tx.type === 'income')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const isReportActive = dateFilter.start && dateFilter.end;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Resumen General</h3>
        <div className="row text-center mb-3">
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Total en Cuentas</h5>
              <p className="fs-4 text-success fw-bold">{formatCurrency(getTotalDebitBalance())}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Deuda Total</h5>
              <p className="fs-4 text-danger fw-bold">{formatCurrency(getTotalDebt())}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-light rounded h-100">
              <h5>Gastos de Hoy</h5>
              <p className="fs-4 text-danger fw-bold">{formatCurrency(getTodayExpenses())}</p>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-md-6">
            <div className="p-2 bg-light rounded h-100">
              <h5>Gastos de la Semana</h5>
              <p className="fs-4 text-danger fw-bold">{formatCurrency(getWeekExpenses())}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-2 bg-light rounded h-100">
              <h5>Ingresos de la Semana</h5>
              <p className="fs-4 text-success fw-bold">{formatCurrency(getWeeklyIncome())}</p>
            </div>
          </div>
        </div>

        {isReportActive && (
          <div className="mt-4 pt-3 border-top">
            <h4 className="card-title">Reporte del {dateFilter.start} al {dateFilter.end}</h4>
            <div className="row text-center">
              <div className="col-md-6">
                <div className="p-2 bg-light rounded h-100">
                  <h5>Ingresos del Periodo</h5>
                  <p className="fs-4 text-success fw-bold">{formatCurrency(getReportIncome())}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2 bg-light rounded h-100">
                  <h5>Gastos del Periodo</h5>
                  <p className="fs-4 text-danger fw-bold">{formatCurrency(getReportExpenses())}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SummaryDashboard;
