import React, { useMemo } from 'react';

function SummaryDashboard({ transactions, accounts, dateFilter }) {

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  const summary = useMemo(() => {
    const initialSummary = {
      totalInAccounts: {},
      totalDebt: {},
      expensesToday: {},
      expensesThisWeek: {},
      incomeThisWeek: {},
    };

    const summaryByCurrency = accounts.reduce((acc, account) => {
      const currency = account.currency || 'MXN';
      if (!acc[currency]) {
        acc[currency] = {
          totalInAccounts: 0,
          totalDebt: 0,
        };
      }
      if (account.type === 'Cuenta de Ahorro/Débito' || account.type === 'Efectivo') {
        acc[currency].totalInAccounts += account.currentBalance;
      } else if (account.type === 'Tarjeta de Crédito' || account.type === 'Préstamo Personal') {
        acc[currency].totalDebt += account.currentBalance;
      }
      return acc;
    }, {});

    // --- Lógica de Fecha Corregida ---
    const getLocalDateString = (date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    const today = getLocalDateString(new Date());
    
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Dom, 1=Lun, ..., 6=Sáb
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuste para que la semana empiece en Lunes
    const firstDayOfWeek = new Date(new Date().setDate(diff));
    const firstDayStr = getLocalDateString(firstDayOfWeek);
    // --- Fin de Lógica de Fecha ---

    transactions.forEach(tx => {
      const account = accounts.find(acc => acc.id === tx.accountId);
      const currency = account?.currency || 'MXN';
      if (!summaryByCurrency[currency]) {
        summaryByCurrency[currency] = { totalInAccounts: 0, totalDebt: 0 };
      }
      if (!summaryByCurrency[currency].expensesToday) summaryByCurrency[currency].expensesToday = 0;
      if (!summaryByCurrency[currency].expensesThisWeek) summaryByCurrency[currency].expensesThisWeek = 0;
      if (!summaryByCurrency[currency].incomeThisWeek) summaryByCurrency[currency].incomeThisWeek = 0;

      if (tx.type !== 'income' && tx.category !== 'Pago de Deuda') {
        if (tx.date === today) {
          summaryByCurrency[currency].expensesToday += tx.amount;
        }
        if (tx.date >= firstDayStr) {
          summaryByCurrency[currency].expensesThisWeek += tx.amount;
        }
      } else if (tx.type === 'income') {
        if (tx.date >= firstDayStr) {
          summaryByCurrency[currency].incomeThisWeek += tx.amount;
        }
      }
    });

    // Aplanar la estructura para renderizar
    Object.keys(summaryByCurrency).forEach(currency => {
      initialSummary.totalInAccounts[currency] = summaryByCurrency[currency].totalInAccounts;
      initialSummary.totalDebt[currency] = summaryByCurrency[currency].totalDebt;
      initialSummary.expensesToday[currency] = summaryByCurrency[currency].expensesToday || 0;
      initialSummary.expensesThisWeek[currency] = summaryByCurrency[currency].expensesThisWeek || 0;
      initialSummary.incomeThisWeek[currency] = summaryByCurrency[currency].incomeThisWeek || 0;
    });

    return initialSummary;

  }, [accounts, transactions]);

  const reportSummary = useMemo(() => {
    if (!dateFilter.start || !dateFilter.end) return null;
    const reportTransactions = transactions.filter(tx => tx.date >= dateFilter.start && tx.date <= dateFilter.end);
    return reportTransactions.reduce((acc, tx) => {
        const account = accounts.find(a => a.id === tx.accountId);
        const currency = account?.currency || 'MXN';
        if (!acc[currency]) {
            acc[currency] = { income: 0, expense: 0 };
        }
        if (tx.type === 'income') {
            acc[currency].income += tx.amount;
        } else {
            acc[currency].expense += tx.amount;
        }
        return acc;
    }, {});
  }, [transactions, accounts, dateFilter]);

  const renderSummary = (data) => {
    const entries = Object.entries(data);
    if (entries.length === 0 || entries.every(([_, value]) => value === 0)) {
        return <p className="fs-5 fw-bold mb-1">{formatCurrency(0)}</p>;
    }
    return entries.map(([currency, value]) => {
        if (value === 0) return null; // No mostrar si el valor es 0
        return <p key={currency} className="fs-5 fw-bold mb-1">{formatCurrency(value, currency)}</p>
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">Resumen General</h3>
        <div className="row text-center mb-3">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Total en Cuentas</h5>
              <div className="text-success">{renderSummary(summary.totalInAccounts)}</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Deuda Total</h5>
              <div className="text-danger">{renderSummary(summary.totalDebt)}</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Gastos de Hoy</h5>
              <div className="text-danger">{renderSummary(summary.expensesToday)}</div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Gastos de la Semana</h5>
              <div className="text-danger">{renderSummary(summary.expensesThisWeek)}</div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Ingresos de la Semana</h5>
              <div className="text-success">{renderSummary(summary.incomeThisWeek)}</div>
            </div>
          </div>
        </div>

        {reportSummary && (
          <div className="mt-4 pt-3 border-top">
            <h4 className="card-title">Reporte del {dateFilter.start} al {dateFilter.end}</h4>
            {Object.keys(reportSummary).map(currency => (
                <div key={currency} className="mb-3 p-3 border rounded">
                    <h5 className="mb-3">Moneda: <span className="badge bg-info">{currency}</span></h5>
                    <div className="row text-center">
                        <div className="col-md-6">
                            <div className="p-2 bg-light rounded h-100">
                            <h5>Ingresos del Periodo</h5>
                            <p className="fs-4 text-success fw-bold">{formatCurrency(reportSummary[currency].income, currency)}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-2 bg-light rounded h-100">
                            <h5>Gastos del Periodo</h5>
                            <p className="fs-4 text-danger fw-bold">{formatCurrency(reportSummary[currency].expense, currency)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default SummaryDashboard;
