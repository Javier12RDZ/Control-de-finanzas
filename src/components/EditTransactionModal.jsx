import { useState, useEffect } from 'react';

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

function EditTransactionModal({ transaction, onUpdate, onCancel }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTransaction = {
      ...transaction,
      description,
      amount: parseFloat(amount),
      category,
      date,
    };
    onUpdate(updatedTransaction);
  };

  if (!transaction) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Transacción</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
               <div className="mb-3">
                <label htmlFor="editDescription" className="form-label">Descripción</label>
                <input id="editDescription" type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="editAmount" className="form-label">Monto</label>
                <input id="editAmount" type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="editCategory" className="form-label">Categoría</label>
                <select id="editCategory" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editDate" className="form-label">Fecha</label>
                <input id="editDate" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;
