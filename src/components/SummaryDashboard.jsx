import React, { useMemo, useState } from 'react';
import ReportWindow from './ReportWindow';

function SummaryDashboard({ transactions, accounts, dateFilter }) {

  const formatCurrency = (amount, currency = 'MXN') => {
    const currencyCode = currency || 'MXN';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) { // eslint-disable-line no-unused-vars
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
  };

  const summary = useMemo(() => {
    const initialSummary = {
      totalInAccounts: {},
      totalDebt: {},
      expensesToday: {}, 
      cashExpensesToday: {},
      creditExpensesToday: {},
      debtPaymentsToday: {}, // Nuevo rastreador
      expensesThisWeek: {}, 
      cashExpensesThisWeek: {},
      creditExpensesThisWeek: {},
      debtPaymentsThisWeek: {}, // Nuevo rastreador
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

    const getLocalDateString = (date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    const today = getLocalDateString(new Date());
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const firstDayOfWeek = new Date(new Date().setDate(diff));
    const firstDayStr = getLocalDateString(firstDayOfWeek);

    transactions.forEach(tx => {
      const accountId = tx.accountId || tx.toAccountId;
      const account = accounts.find(acc => acc.id === accountId);
      const currency = account?.currency || 'MXN';

      if (!summaryByCurrency[currency]) {
        summaryByCurrency[currency] = { totalInAccounts: 0, totalDebt: 0 };
      }
      // Inicializar contadores si no existen
      if (!summaryByCurrency[currency].cashExpensesToday) summaryByCurrency[currency].cashExpensesToday = 0;
      if (!summaryByCurrency[currency].creditExpensesToday) summaryByCurrency[currency].creditExpensesToday = 0;
      if (!summaryByCurrency[currency].debtPaymentsToday) summaryByCurrency[currency].debtPaymentsToday = 0;

      if (!summaryByCurrency[currency].cashExpensesThisWeek) summaryByCurrency[currency].cashExpensesThisWeek = 0;
      if (!summaryByCurrency[currency].creditExpensesThisWeek) summaryByCurrency[currency].creditExpensesThisWeek = 0;
      if (!summaryByCurrency[currency].debtPaymentsThisWeek) summaryByCurrency[currency].debtPaymentsThisWeek = 0;

      if (!summaryByCurrency[currency].incomeThisWeek) summaryByCurrency[currency].incomeThisWeek = 0;

      // Lógica de Clasificación
      if (tx.type === 'income') {
        if (tx.date >= firstDayStr) {
          summaryByCurrency[currency].incomeThisWeek += tx.amount;
        }
      } else if (tx.category === 'Pago de Deuda') {
        // Rastrear Pagos de Deuda por separado
        if (tx.date === today) {
          summaryByCurrency[currency].debtPaymentsToday += tx.amount;
        }
        if (tx.date >= firstDayStr) {
          summaryByCurrency[currency].debtPaymentsThisWeek += tx.amount;
        }
      } else if (tx.type !== 'internalTransfer') {
        // Gastos regulares (Consumo)
        const isCredit = account.type === 'Tarjeta de Crédito';

        if (tx.date === today) {
          if (isCredit) {
            summaryByCurrency[currency].creditExpensesToday += tx.amount;
          } else {
            summaryByCurrency[currency].cashExpensesToday += tx.amount;
          }
        }
        if (tx.date >= firstDayStr) {
          if (isCredit) {
             summaryByCurrency[currency].creditExpensesThisWeek += tx.amount;
          } else {
             summaryByCurrency[currency].cashExpensesThisWeek += tx.amount;
          }
        }
      } 
    });

    Object.keys(summaryByCurrency).forEach(currency => {
      initialSummary.totalInAccounts[currency] = summaryByCurrency[currency].totalInAccounts;
      initialSummary.totalDebt[currency] = summaryByCurrency[currency].totalDebt;
      
      // Asignar valores separados
      initialSummary.cashExpensesToday[currency] = summaryByCurrency[currency].cashExpensesToday || 0;
      initialSummary.creditExpensesToday[currency] = summaryByCurrency[currency].creditExpensesToday || 0;
      initialSummary.debtPaymentsToday[currency] = summaryByCurrency[currency].debtPaymentsToday || 0;
      
      initialSummary.cashExpensesThisWeek[currency] = summaryByCurrency[currency].cashExpensesThisWeek || 0;
      initialSummary.creditExpensesThisWeek[currency] = summaryByCurrency[currency].creditExpensesThisWeek || 0;
      initialSummary.debtPaymentsThisWeek[currency] = summaryByCurrency[currency].debtPaymentsThisWeek || 0;

      initialSummary.incomeThisWeek[currency] = summaryByCurrency[currency].incomeThisWeek || 0;
    });

    return initialSummary;

  }, [accounts, transactions]);

  const reportSummary = useMemo(() => {
    if (!dateFilter.start || !dateFilter.end) return null;
    const reportTransactions = transactions.filter(tx => tx.date >= dateFilter.start && tx.date <= dateFilter.end);
    return reportTransactions.reduce((acc, tx) => {
        const accountId = tx.accountId || tx.toAccountId;
        const account = accounts.find(a => a.id === accountId);
        const currency = account?.currency || 'MXN';
        if (!acc[currency]) {
            acc[currency] = { income: 0, expense: 0 };
        }
        if (tx.type === 'income') {
            acc[currency].income += tx.amount;
        } else if (tx.type !== 'internalTransfer' && tx.category !== 'Pago de Deuda') {
            acc[currency].expense += tx.amount;
        }
        return acc;
    }, {});
  }, [transactions, accounts, dateFilter]);

  const [showReportWindow, setShowReportWindow] = useState(false);

  const renderSummary = (data) => {
    const entries = Object.entries(data);
    if (entries.length === 0 || entries.every(([/*_*/, value]) => value === 0)) {
        return <p className="fs-5 fw-bold mb-1">{formatCurrency(0)}</p>;
    }
    return entries.map(([currency, value]) => {
        if (value === 0) return null;
        return <p key={currency} className="fs-5 fw-bold mb-1">{formatCurrency(value, currency)}</p>
    });
  };

  const renderSplitSummary = (cashData, creditData, debtData = {}) => {
    const currencies = new Set([...Object.keys(cashData), ...Object.keys(creditData), ...Object.keys(debtData)]);
    if (currencies.size === 0) return <p className="fs-5 fw-bold mb-1">{formatCurrency(0)}</p>;

    return Array.from(currencies).map(currency => {
      const cash = cashData[currency] || 0;
      const credit = creditData[currency] || 0;
      const debt = debtData[currency] || 0;
      const total = cash + credit + debt;

      if (total === 0) return null;

      return (
        <div key={currency} className="mb-2">
          {/* Total Sum (Cash + Credit + Debt Payments) */}
          <p className="fs-5 fw-bold mb-0 text-danger">{formatCurrency(total, currency)}</p>
          <small className="text-muted d-block" style={{ fontSize: '0.8em' }}>
            Efec: {formatCurrency(cash, currency)} | Créd: {formatCurrency(credit, currency)} | Pagos: {formatCurrency(debt, currency)}
          </small>
        </div>
      );
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
              <div>
                {renderSplitSummary(summary.cashExpensesToday, summary.creditExpensesToday, summary.debtPaymentsToday)}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="p-3 bg-light rounded h-100">
              <h5>Gastos de la Semana</h5>
              <div>
                {renderSplitSummary(summary.cashExpensesThisWeek, summary.creditExpensesThisWeek, summary.debtPaymentsThisWeek)}
              </div>
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
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title">Reporte del {dateFilter.start} al {dateFilter.end}</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowReportWindow(true)}>Ver en Nueva Ventana</button>
            </div>
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

        {showReportWindow && (
          <ReportWindow
            closeWindow={() => setShowReportWindow(false)}
            transactions={transactions.filter(tx => tx.date >= dateFilter.start && tx.date <= dateFilter.end)}
            reportSummary={reportSummary}
            dateFilter={dateFilter}
          />
        )}

      </div>
    </div>
  );
}

export default SummaryDashboard;
