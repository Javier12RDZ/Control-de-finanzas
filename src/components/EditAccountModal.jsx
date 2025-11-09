import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditAccountModal({ account, onUpdate, onCancel }) {
  const [formState, setFormState] = useState({ name: '', bank: '', balance: '', currentBalance: '' });

  useEffect(() => {
    if (account) {
      setFormState({
        name: account.name || '',
        bank: account.bank || '',
        balance: account.type === 'Tarjeta de Crédito' ? account.balance : account.currentBalance,
        currentBalance: account.type === 'Tarjeta de Crédito' ? account.currentBalance : ''
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let updatedAccountData = {
      ...account,
      name: formState.name,
      bank: formState.bank,
    };

    if (account.type === 'Tarjeta de Crédito') {
      updatedAccountData.balance = parseFloat(formState.balance) || 0;
      updatedAccountData.currentBalance = parseFloat(formState.currentBalance) || 0;
    } else {
      // For other accounts, the main input field controls the currentBalance
      const newBalance = parseFloat(formState.balance) || 0;
      updatedAccountData.balance = newBalance;
      updatedAccountData.currentBalance = newBalance;
    }
    
    onUpdate(updatedAccountData);
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
                {account?.type === 'Tarjeta de Crédito' ? 'Límite de Crédito' : 'Saldo Actual'}
              </label>
              <input name="balance" id="balance" type="number" className="form-control" value={formState.balance} onChange={handleChange} />
            </div>
            {account?.type === 'Tarjeta de Crédito' && (
              <div className="mb-3">
                <label htmlFor="currentBalance" className="form-label">Deuda Actual</label>
                <input name="currentBalance" id="currentBalance" type="number" className="form-control" value={formState.currentBalance} onChange={handleChange} />
              </div>
            )}
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
