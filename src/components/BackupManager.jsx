import React from 'react';
import * as XLSX from 'xlsx';

function BackupManager({ accounts, transactions, onRestore }) {

  const handleExport = () => {
    if (accounts.length === 0 && transactions.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // 1. Crear hojas de cálculo a partir de los datos
    const accountsSheet = XLSX.utils.json_to_sheet(accounts);
    const transactionsSheet = XLSX.utils.json_to_sheet(transactions);

    // 2. Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // 3. Añadir las hojas al libro con nombres específicos
    XLSX.utils.book_append_sheet(workbook, accountsSheet, 'Cuentas');
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transacciones');

    // 4. Generar el archivo y descargarlo
    XLSX.writeFile(workbook, 'CopiaDeSeguridad_Finanzas.xlsx');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Leer datos de las hojas
        const accountsSheet = workbook.Sheets['Cuentas'];
        const transactionsSheet = workbook.Sheets['Transacciones'];

        if (!accountsSheet || !transactionsSheet) {
            alert('El archivo de Excel no tiene el formato esperado. Asegúrate de que contenga las hojas "Cuentas" y "Transacciones".');
            return;
        }

        const restoredAccounts = XLSX.utils.sheet_to_json(accountsSheet);
        const restoredTransactions = XLSX.utils.sheet_to_json(transactionsSheet);

        // Confirmar antes de sobrescribir
        if (window.confirm('¿Estás seguro de que quieres restaurar los datos? La información actual se sobrescribirá.')) {
          onRestore(restoredAccounts, restoredTransactions);
          alert('¡Datos restaurados con éxito!');
        }

      } catch (error) {
        console.error("Error al importar el archivo", error);
        alert('Hubo un error al leer el archivo. Asegúrate de que sea un archivo de Excel válido.');
      } finally {
        // Limpiar el input para poder seleccionar el mismo archivo de nuevo
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2 className="card-title">Copia de Seguridad</h2>
        <p className="card-text">Guarda todos tus datos en un archivo de Excel o restaura una copia de seguridad anterior.</p>
        <div className="d-grid gap-2 d-md-flex">
            <button onClick={handleExport} className="btn btn-info me-md-2 mb-2 mb-md-0">
                Exportar a Excel
            </button>
            <label className="btn btn-secondary">
                Importar desde Excel
                <input type="file" hidden accept=".xlsx, .xls" onChange={handleImport} />
            </label>
        </div>
      </div>
    </div>
  );
}

export default BackupManager;
