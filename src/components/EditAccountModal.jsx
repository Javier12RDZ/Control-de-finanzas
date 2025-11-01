import { useState, useEffect } from 'react';

function EditAccountModal({ account, onUpdate, onCancel }) {
  const [formState, setFormState] = useState({ name: '', bank: '', balance: '' });

  useEffect(() => {
    if (account) {
      setFormState({
        name: account.name || '',
        bank: account.bank || '',
        balance: account.balance || ''
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedAccount = {
      ...account,
      ...formState,
      balance: parseFloat(formState.balance)
    };
    onUpdate(updatedAccount);
  };

  if (!account) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cuenta</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre de la Cuenta</label>
                <input name="name" id="name" type="text" className="form-control" value={formState.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="bank" className="form-label">Banco (Opcional)</label>
                <input name="bank" id="bank" type="text" className="form-control" value={formState.bank} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="balance" className="form-label">
                  {account.type === 'Tarjeta de Crédito' ? 'Límite de Crédito' : 'Balance'}
                </label>
                <input name="balance" id="balance" type="number" className="form-control" value={formState.balance} onChange={handleChange} />
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

export default EditAccountModal;
