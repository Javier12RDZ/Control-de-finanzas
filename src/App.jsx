import { useState, useEffect } from 'react';
import './App.css';
import AccountList from './components/AccountList';
import AddAccountForm from './components/AddAccountForm';
import AddExpenseForm from './components/AddExpenseForm';
import TransactionList from './components/TransactionList';
import BackupManager from './components/BackupManager';

function App() {
  // Estados para manejar las cuentas y las transacciones
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem('finance-app-accounts');
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
      const storedTransactions = localStorage.getItem('finance-app-transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
    }
  }, []);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem('finance-app-accounts', JSON.stringify(accounts));
    } catch (error) {
      console.error("Error saving accounts to localStorage", error);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('finance-app-transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage", error);
    }
  }, [transactions]);

  const handleAddAccount = (account) => {
    setAccounts([...accounts, account]);
  };

  const handleAddTransaction = (transaction) => {
    // 1. Agregar la nueva transacción al estado
    setTransactions([...transactions, transaction]);

    // 2. Actualizar el balance de la cuenta correspondiente
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === transaction.accountId) {
        const newBalance = acc.type === 'Débito' 
          ? acc.currentBalance - transaction.amount // Restar en débito
          : acc.currentBalance + transaction.amount; // Sumar en crédito (es el gasto acumulado)
        return { ...acc, currentBalance: newBalance };
      }
      return acc;
    });

    setAccounts(updatedAccounts);
  };

  const handleRestoreData = (restoredAccounts, restoredTransactions) => {
    setAccounts(restoredAccounts);
    setTransactions(restoredTransactions);
  };


  return (
    <div className="container mt-4">
      <header className="text-center mb-4">
        <h1>Control de Finanzas Personales</h1>
        <p className="lead">Gestiona tus cuentas y gastos de forma sencilla.</p>
      </header>

      <div className="row">
        <div className="col-lg-5">
          {/* Formulario para agregar cuentas */}
          <AddAccountForm onAddAccount={handleAddAccount} />
          {/* Sección para Agregar Gastos */}
          <AddExpenseForm accounts={accounts} onAddTransaction={handleAddTransaction} />
        </div>
        <div className="col-lg-7">
          {/* Sección de Resumen de Cuentas */}
          <AccountList accounts={accounts} />
          {/* Sección de Historial de Transacciones */}
          <TransactionList transactions={transactions} accounts={accounts} />
        </div>
      </div>

      {/* Sección de Importar/Exportar */}
      <BackupManager accounts={accounts} transactions={transactions} onRestore={handleRestoreData} />

    </div>
  );
}

export default App;
