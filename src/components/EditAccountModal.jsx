import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditAccountModal({ account, onUpdate, onCancel }) {
  const [formState, setFormState] = useState({ name: '', bank: '', balance: '' });

  useEffect(() => {
    if (account) {
      const balanceValue = account.type === 'Tarjeta de Crédito' ? account.balance : account.currentBalance;
      setFormState({
        name: account.name || '',
        bank: account.bank || '',
        balance: balanceValue || ''
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
      balance: parseFloat(formState.balance) || 0
    };
    onUpdate(updatedAccount);
  };

  return (
    <Modal show={!!account} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cuenta</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
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
                {account?.type === 'Tarjeta de Crédito' ? 'Límite de Crédito' : 'Balance'}
              </label>
              <input name="balance" id="balance" type="number" className="form-control" value={formState.balance} onChange={handleChange} />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar Cambios</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default EditAccountModal;

