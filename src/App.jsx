import { useState, useEffect } from 'react';
import './App.css';
import AccountList from './components/AccountList';
import AddAccountForm from './components/AddAccountForm';
import AddExpenseForm from './components/AddExpenseForm';
import TransactionList from './components/TransactionList';
import BackupManager from './components/BackupManager';
import EditTransactionModal from './components/EditTransactionModal';
import SummaryDashboard from './components/SummaryDashboard';
import EditAccountModal from './components/EditAccountModal';
import AddTransferForm from './components/AddTransferForm';

function App() {
  // Estados para manejar las cuentas y las transacciones
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

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
        // Si es Tarjeta de Crédito, el gasto se suma al balance actual (que representa el gasto total)
        // Si es Débito/Efectivo, el gasto se resta del balance actual.
        const newBalance = acc.type === 'Tarjeta de Crédito' 
          ? acc.currentBalance + transaction.amount
          : acc.currentBalance - transaction.amount;
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

  const handleDeleteTransaction = (id) => {
    const transactionToDelete = transactions.find(tx => tx.id === id);
    if (!transactionToDelete) return;

    // Revertir el balance de la cuenta afectada
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === transactionToDelete.accountId) {
        const newBalance = acc.type === 'Tarjeta de Crédito'
          ? acc.currentBalance - transactionToDelete.amount
          : acc.currentBalance + transactionToDelete.amount;
        return { ...acc, currentBalance: newBalance };
      }
      return acc;
    });
    setAccounts(updatedAccounts);

    // Eliminar la transacción
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const handleUpdateTransaction = (updatedTx) => {
    // 1. Encontrar la transacción original
    const originalTx = transactions.find(tx => tx.id === updatedTx.id);
    if (!originalTx) return;

    // 2. Revertir el monto original en la cuenta y aplicar el nuevo
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === originalTx.accountId) {
        // Revertir el monto original
        const balanceAfterRevert = acc.type === 'Tarjeta de Crédito'
          ? acc.currentBalance - originalTx.amount
          : acc.currentBalance + originalTx.amount;
        
        // Aplicar el nuevo monto
        const newBalance = acc.type === 'Tarjeta de Crédito'
          ? balanceAfterRevert + updatedTx.amount
          : balanceAfterRevert - updatedTx.amount;

        return { ...acc, currentBalance: newBalance };
      }
      return acc;
    });
    setAccounts(updatedAccounts);

    // 3. Actualizar la lista de transacciones
    setTransactions(transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
    setIsEditing(false);
    setCurrentTransaction(null);
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTransaction(null);
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    setIsEditingAccount(false);
    setCurrentAccount(null);
  };

  const handleEditAccountClick = (account) => {
    setCurrentAccount(account);
    setIsEditingAccount(true);
  };

  const handleCancelEditAccount = () => {
    setIsEditingAccount(false);
    setCurrentAccount(null);
  };

  const handleAddTransfer = (transfer) => {
    let fromAccountCorrect = false;
    let toAccountCorrect = false;

    const updatedAccounts = accounts.map(acc => {
      // Restar de la cuenta de origen
      if (acc.id === transfer.from) {
        fromAccountCorrect = true;
        return { ...acc, currentBalance: acc.currentBalance - transfer.amount };
      }
      // Restar de la deuda de la cuenta de destino (tarjeta de crédito)
      if (acc.id === transfer.to) {
        toAccountCorrect = true;
        return { ...acc, currentBalance: acc.currentBalance - transfer.amount };
      }
      return acc;
    });

    if (fromAccountCorrect && toAccountCorrect) {
      setAccounts(updatedAccounts);
      // Opcional: Añadir una transacción para registrar el pago
      const newTransaction = {
        id: Date.now(),
        accountId: transfer.to, // Asociar a la tarjeta de crédito
        description: `Pago desde cuenta de origen`,
        amount: transfer.amount,
        category: 'Pago de Deuda',
        date: new Date().toISOString().slice(0, 10),
      };
      setTransactions([...transactions, newTransaction]);

    } else {
      alert("Error al procesar la transferencia. Cuentas no encontradas.");
    }
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
          {/* Sección para Pagos y Transferencias */}
          <AddTransferForm accounts={accounts} onAddTransfer={handleAddTransfer} />
        </div>
        <div className="col-lg-7">
          {/* Panel de Resumen */}
          <SummaryDashboard transactions={transactions} accounts={accounts} />
          {/* Sección de Resumen de Cuentas */}
          <AccountList accounts={accounts} onEdit={handleEditAccountClick} />
          {/* Sección de Historial de Transacciones */}
          <TransactionList transactions={transactions} accounts={accounts} onEdit={handleEditClick} onDelete={handleDeleteTransaction} />
        </div>
      </div>

      {/* Sección de Importar/Exportar */}
      <BackupManager accounts={accounts} transactions={transactions} onRestore={handleRestoreData} />

      {isEditing && (
        <EditTransactionModal 
          transaction={currentTransaction}
          onUpdate={handleUpdateTransaction}
          onCancel={handleCancelEdit}
        />
      )}

      {isEditingAccount && (
        <EditAccountModal
          account={currentAccount}
          onUpdate={handleUpdateAccount}
          onCancel={handleCancelEditAccount}
        />
      )}

    </div>
  );
}

export default App;
