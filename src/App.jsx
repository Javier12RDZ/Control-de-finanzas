import { useState, useEffect, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
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
import AddIncomeForm from './components/AddIncomeForm';
import AddInternalTransferForm from './components/AddInternalTransferForm';
import Header from './components/Header';
import SideMenu from './components/SideMenu';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const [showModal, setShowModal] = useState(null);
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem('finance-app-accounts');
      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      const storedTransactions = localStorage.getItem('finance-app-transactions');
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    } catch (error) {
      console.error("Error loading data from localStorage", error);
    }
  }, []);

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

  // Helper para obtener la fecha local en formato YYYY-MM-DD
  const getLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };

  const handleCloseModal = () => setShowModal(null);
  const handleShowModal = (modalName) => setShowModal(modalName);

  const handleCloseSideMenu = () => setShowSideMenu(false);
  const handleOpenSideMenu = () => setShowSideMenu(true);

  const handleAddAccount = (account) => {
    setAccounts([...accounts, account]);
    handleCloseModal();
  };

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === transaction.accountId) {
        const newBalance = acc.type === 'Tarjeta de Crédito' 
          ? acc.currentBalance + transaction.amount
          : acc.currentBalance - transaction.amount;
        return { ...acc, currentBalance: newBalance };
      }
      return acc;
    });
    setAccounts(updatedAccounts);
    handleCloseModal();
  };

  const handleAddIncome = (income) => {
    setAccounts(accounts.map(acc => 
      acc.id === income.accountId 
        ? { ...acc, currentBalance: acc.currentBalance + income.amount } 
        : acc
    ));
    const newTransaction = {
      id: Date.now(),
      accountId: income.accountId,
      description: income.description,
      amount: income.amount,
      category: 'Ingreso',
      date: income.date,
      type: 'income'
    };
    setTransactions([...transactions, newTransaction]);
    handleCloseModal();
  };

  const handleAddTransfer = (transfer) => {
    const fromAccount = accounts.find(acc => acc.id === transfer.from);
    const toAccount = accounts.find(acc => acc.id === transfer.to);

    if (!fromAccount || !toAccount) {
      alert("Error al procesar la transferencia. Cuentas no encontradas.");
      return;
    }

    const amountInOriginCurrency = transfer.amount;
    let amountInDestinationCurrency = transfer.amount;

    // Verificar si es una transferencia entre diferentes monedas
    if (fromAccount.currency !== toAccount.currency && transfer.exchangeRate) {
      amountInDestinationCurrency = amountInOriginCurrency * transfer.exchangeRate;
    } else if (fromAccount.currency !== toAccount.currency && !transfer.exchangeRate) {
      alert("Error: Se requiere un tipo de cambio para transferencias entre diferentes monedas.");
      return;
    }

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === fromAccount.id) {
        return { ...acc, currentBalance: acc.currentBalance - amountInOriginCurrency };
      }
      if (acc.id === toAccount.id) {
        // For debt payments, the balance of the destination account should decrease
        return { ...acc, currentBalance: acc.currentBalance - amountInDestinationCurrency };
      }
      return acc;
    });

    setAccounts(updatedAccounts);

    const newTransaction = {
      id: Date.now(),
      fromAccountId: transfer.from, // Guardar ID de origen
      toAccountId: transfer.to,     // Guardar ID de destino
      description: `Pago desde ${fromAccount.name}`,
      amount: amountInDestinationCurrency, // Registrar el monto en la moneda de la cuenta de destino
      category: 'Pago de Deuda',
      date: new Date().toISOString().slice(0, 10),
      conversionDetails: fromAccount.currency !== toAccount.currency ? {
        fromAmount: amountInOriginCurrency,
        fromCurrency: fromAccount.currency,
        toCurrency: toAccount.currency,
        exchangeRate: transfer.exchangeRate
      } : null
    };
    setTransactions([...transactions, newTransaction]);
    handleCloseModal();
  };

  const handleAddInternalTransfer = (transfer) => {
    const fromAccount = accounts.find(acc => acc.id === transfer.from);
    const toAccount = accounts.find(acc => acc.id === transfer.to);

    if (!fromAccount || !toAccount) {
      alert("Error al procesar la transferencia interna. Cuentas no encontradas.");
      return;
    }

    const amountInOriginCurrency = transfer.amount;
    let amountInDestinationCurrency = transfer.amount;

    // Verificar si es una transferencia entre diferentes monedas
    if (fromAccount.currency !== toAccount.currency && transfer.exchangeRate) {
      amountInDestinationCurrency = amountInOriginCurrency * transfer.exchangeRate;
    } else if (fromAccount.currency !== toAccount.currency && !transfer.exchangeRate) {
      alert("Error: Se requiere un tipo de cambio para transferencias entre diferentes monedas.");
      return;
    }

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === fromAccount.id) {
        return { ...acc, currentBalance: acc.currentBalance - amountInOriginCurrency };
      }
      if (acc.id === toAccount.id) {
        return { ...acc, currentBalance: acc.currentBalance + amountInDestinationCurrency };
      }
      return acc;
    });

    setAccounts(updatedAccounts);

    const newTransaction = {
      id: Date.now(),
      fromAccountId: transfer.from, // Guardar ID de origen
      toAccountId: transfer.to,     // Guardar ID de destino
      description: `Transferencia interna de ${fromAccount.name} a ${toAccount.name}`,
      amount: amountInDestinationCurrency, // Registrar el monto en la moneda de la cuenta de destino
      category: 'Transferencia Interna',
      date: transfer.date,
      type: 'internalTransfer', // Tipo especial para transferencias internas
      conversionDetails: fromAccount.currency !== toAccount.currency ? {
        fromAmount: amountInOriginCurrency,
        fromCurrency: fromAccount.currency,
        toCurrency: toAccount.currency,
        exchangeRate: transfer.exchangeRate
      } : null
    };
    setTransactions([...transactions, newTransaction]);
    handleCloseModal();
  };

  const handleRestoreData = (restoredAccounts, restoredTransactions) => {
    setAccounts(restoredAccounts);
    setTransactions(restoredTransactions);
  };

  const handleDeleteTransaction = (id) => {
    const txToDelete = transactions.find(tx => tx.id === id);
    if (!txToDelete) return;

    let updatedAccounts = accounts;

    // Case 1: It's a transfer or debt payment involving two accounts
    if (txToDelete.fromAccountId && txToDelete.toAccountId) {
      const fromAccount = accounts.find(acc => acc.id === txToDelete.fromAccountId);
      const toAccount = accounts.find(acc => acc.id === txToDelete.toAccountId);
      if (!fromAccount || !toAccount) return;

      const amountInDestCurrency = txToDelete.amount;
      const amountInOriginCurrency = txToDelete.conversionDetails
        ? txToDelete.conversionDetails.fromAmount
        : amountInDestCurrency;

      updatedAccounts = accounts.map(acc => {
        // Add money back to the source account
        if (acc.id === fromAccount.id) {
          return { ...acc, currentBalance: acc.currentBalance + amountInOriginCurrency };
        }
        // Revert the destination account
        if (acc.id === toAccount.id) {
          let newBalance;
          if (txToDelete.type === 'internalTransfer') {
            // Subtract money from the destination of an internal transfer
            newBalance = acc.currentBalance - amountInDestCurrency;
          } else { // Is a 'Pago de Deuda'
            // Add the amount back to the debt (increase debt)
            newBalance = acc.currentBalance + amountInDestCurrency;
          }
          return { ...acc, currentBalance: newBalance };
        }
        return acc;
      });
    }
    // Case 2: Legacy or single-account transaction
    else if (txToDelete.accountId) {
      updatedAccounts = accounts.map(acc => {
        if (acc.id === txToDelete.accountId) {
          let newBalance;
          // Reverting an income by subtracting the amount
          if (txToDelete.type === 'income') {
            newBalance = acc.currentBalance - txToDelete.amount;
          } 
          // Reverting an expense
          else {
            // For credit card, reverting an expense means reducing the debt
            if (acc.type === 'Tarjeta de Crédito') {
              newBalance = acc.currentBalance - txToDelete.amount;
            }
            // For debit/cash, reverting an expense means adding the money back
            else {
              newBalance = acc.currentBalance + txToDelete.amount;
            }
          }
          return { ...acc, currentBalance: newBalance };
        }
        return acc;
      });
    }

    setAccounts(updatedAccounts);
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const handleUpdateTransaction = (updatedTx) => {
    const originalTx = transactions.find(tx => tx.id === updatedTx.id);
    if (!originalTx) return;
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === originalTx.accountId) {
        const balanceAfterRevert = acc.type === 'Tarjeta de Crédito'
          ? acc.currentBalance - originalTx.amount
          : acc.currentBalance + originalTx.amount;
        const newBalance = acc.type === 'Tarjeta de Crédito'
          ? balanceAfterRevert + updatedTx.amount
          : balanceAfterRevert - updatedTx.amount;
        return { ...acc, currentBalance: newBalance };
      }
      return acc;
    });
    setAccounts(updatedAccounts);
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
    setAccounts(accounts.map(acc => 
      acc.id === updatedAccount.id ? updatedAccount : acc
    ));
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

  const handleApplyFilter = (start, end) => setDateFilter({ start, end });
  const handleClearFilter = () => setDateFilter({ start: null, end: null });

  const displayedTransactions = useMemo(() => {
    if (dateFilter.start && dateFilter.end) {
      return transactions.filter(tx => tx.date >= dateFilter.start && tx.date <= dateFilter.end);
    }
    return transactions;
  }, [transactions, dateFilter]);

  return (
    <div className="container mt-4">
      <Header onOpenSideMenu={handleOpenSideMenu} />
      <SideMenu 
        show={showSideMenu}
        onHide={handleCloseSideMenu}
        onApplyFilter={handleApplyFilter} 
        onClearFilter={handleClearFilter}
        onShowModal={handleShowModal} 
      />

      <div className="row">
        <div className="col-12">
          <SummaryDashboard transactions={transactions} accounts={accounts} dateFilter={dateFilter} />
          <AccountList accounts={accounts} onEdit={handleEditAccountClick} />
          <TransactionList transactions={displayedTransactions} accounts={accounts} onEdit={handleEditClick} onDelete={handleDeleteTransaction} getLocalDateString={getLocalDateString} />
        </div>
      </div>

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

      {/* Modals for adding data */}
      <Modal show={showModal === 'account'} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAccountForm onAddAccount={handleAddAccount} />
        </Modal.Body>
      </Modal>

      <Modal show={showModal === 'expense'} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Gasto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddExpenseForm accounts={accounts} onAddTransaction={handleAddTransaction} getLocalDateString={getLocalDateString} />
        </Modal.Body>
      </Modal>

      <Modal show={showModal === 'income'} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddIncomeForm accounts={accounts} onAddIncome={handleAddIncome} getLocalDateString={getLocalDateString} />
        </Modal.Body>
      </Modal>

      <Modal show={showModal === 'transfer'} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Realizar Pago o Transferencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTransferForm accounts={accounts} onAddTransfer={handleAddTransfer} />
        </Modal.Body>
      </Modal>

      <Modal show={showModal === 'internalTransfer'} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Realizar Transferencia Interna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddInternalTransferForm accounts={accounts} onAddInternalTransfer={handleAddInternalTransfer} getLocalDateString={getLocalDateString} />
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default App;
