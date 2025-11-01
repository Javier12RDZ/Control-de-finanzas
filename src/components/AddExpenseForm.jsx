import { useState } from 'react';

// Lista de categorías predefinidas
const categories = [
  'Comida',
  'Transporte',
  'Vivienda',
  'Salud',
  'Entretenimiento',
  'Ropa y Accesorios',
  'Educación',
  'Deudas',
  'Ahorro/Inversión',
  'Otros',
];

function AddExpenseForm({ accounts, onAddTransaction }) {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [category, setCategory] = useState(categories[0]); // Categoría por defecto
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Fecha por defecto: hoy

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAccount || !expenseDescription.trim() || !expenseAmount.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      accountId: parseInt(selectedAccount),
      description: expenseDescription,
      amount: parseFloat(expenseAmount),
      category: category,
      date: date,
    };

    onAddTransaction(newTransaction);

    // Limpiar formulario
    setExpenseDescription('');
    setExpenseAmount('');
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Agregar Gasto</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="accountSelect" className="form-label">Seleccionar Cuenta</label>
            <select
              id="accountSelect"
              className="form-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="" disabled>Elige una cuenta...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="expenseDescription" className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              id="expenseDescription"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="Ej: Café, pasaje, etc."
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expenseAmount" className="form-label">Monto</label>
              <input
                type="number"
                className="form-control"
                id="expenseAmount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="categorySelect" className="form-label">Categoría</label>
              <select
                id="categorySelect"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
           <div className="mb-3">
              <label htmlFor="expenseDate" className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                id="expenseDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          <button type="submit" className="btn btn-danger">Agregar Gasto</button>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseForm;