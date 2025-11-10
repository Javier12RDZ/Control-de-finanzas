# Resumen del Proyecto: Control de Finanzas Personales

Este documento resume las funcionalidades implementadas y modificadas en la aplicación "Control de Finanzas Personales" durante la sesión de trabajo con Gemini.

## Descripción General
Aplicación web desarrollada con React (Vite) y Bootstrap para la gestión personal de finanzas. Permite llevar un control detallado de cuentas, transacciones (gastos e ingresos), pagos de deudas y visualizar resúmenes financieros.

## Funcionalidades Clave Implementadas/Modificadas

### 1. Gestión de Cuentas
*   **Tipos de Cuenta:** Soporte para `Cuenta de Ahorro/Débito`, `Efectivo`, `Tarjeta de Crédito` y `Préstamo Personal`.
*   **Campo 'Banco':** Opción para especificar el banco al crear una cuenta.
*   **Edición de Cuentas:** Posibilidad de modificar el nombre, banco y el límite/monto inicial de las cuentas existentes.
*   **Crédito Disponible:** Cálculo y visualización del crédito disponible en tarjetas de crédito.
*   **Soporte Multi-moneda:** Las cuentas ahora pueden ser creadas en Pesos (MXN) o Dólares (USD).

### 2. Gestión de Transacciones
*   **Registro de Gastos:** Formulario para añadir gastos con descripción, monto, categoría y fecha.
*   **Registro de Ingresos:** Nuevo formulario para registrar ingresos con descripción, monto y fecha.
*   **Edición de Transacciones:** Funcionalidad para modificar los detalles de cualquier transacción.
*   **Eliminación de Transacciones:** Opción para borrar transacciones del historial.
*   **Visualización:** Diferenciación visual (color) entre ingresos y gastos en el historial de transacciones.
*   **Transferencias Internas:** Nueva funcionalidad para mover fondos entre cuentas propias (débito/efectivo) sin afectar los totales de gastos/ingresos.
    *   Soporte para transferencias en la misma moneda.
    *   Soporte para transferencias entre USD y MXN, solicitando el tipo de cambio.

### 3. Gestión de Deudas y Pagos
*   **Pagos/Transferencias:** Formulario dedicado para realizar pagos desde cuentas de débito/efectivo hacia tarjetas de crédito o préstamos personales.
    *   Soporte para pagos entre USD y MXN, solicitando el tipo de cambio.
*   **Actualización de Balances:** La lógica de la aplicación actualiza automáticamente los balances de las cuentas al registrar gastos, ingresos o realizar pagos, manejando correctamente la deuda en tarjetas y préstamos.

### 4. Resúmenes y Reportes
*   **Panel de Resumen General:** Muestra métricas clave:
    *   **Multi-moneda:** Los totales (Cuentas, Deuda, Gastos de Hoy/Semana, Ingresos de la Semana) se muestran agrupados por moneda (MXN, USD) de forma compacta.
    *   **Fechas Corregidas:** Los cálculos de "Gastos de Hoy" y "Gastos de la Semana" ahora se actualizan correctamente a la medianoche local, y la semana comienza el lunes.
*   **Menú Lateral (Off-canvas):** Desplegable desde la esquina superior izquierda.
*   **Filtro por Rango de Fechas:** Dentro del menú lateral, permite seleccionar un periodo para generar un reporte.
*   **Reporte por Periodo:** Muestra los ingresos y gastos totales para el rango de fechas seleccionado, agrupados por moneda.

### 5. Historial de Transacciones
*   **Filtrado:** Por defecto, solo muestra las transacciones del día actual. Incluye un botón para "Mostrar Todas las Transacciones".
*   **Ordenación:** Las transacciones se muestran de la más reciente a la más antigua.
*   **Fechas Corregidas:** Las fechas de las transacciones se muestran correctamente en la zona horaria local.
*   **Detalles de Conversión:** Las transacciones que involucran conversión de moneda muestran los detalles del tipo de cambio utilizado.

### 6. Aspectos Técnicos
*   **Tecnologías:** React (Vite), `react-bootstrap` (para componentes UI), Bootstrap (CSS).
*   **Estado:** Gestión de estado con `useState` y `useEffect` de React. Persistencia de datos en `localStorage`.
*   **Despliegue:** Configurado para despliegue en GitHub Pages (`npm run deploy`).

## Notas Importantes y Solución de Problemas
*   **Problema de Scroll Resuelto:** Se corrigió un bug persistente donde la pantalla se bloqueaba al cerrar modales, causado por un conflicto entre el Javascript nativo de Bootstrap y `react-bootstrap`. La solución implicó refactorizar el menú lateral para usar componentes de `react-bootstrap` y asegurar una única fuente de control para los componentes interactivos.
*   **Pantalla en Blanco/Errores:** Si la aplicación muestra una pantalla en blanco o errores inesperados, es probable que los datos guardados en el `localStorage` del navegador sean de una versión anterior con una estructura incompatible.
    *   **Solución:** Abrir las Herramientas de Desarrollador (F12), ir a la pestaña "Aplicación" (o "Application"), buscar "Almacenamiento local" (o "Local Storage"), seleccionar la URL de la aplicación y limpiar todos los datos (`Clear all`). Luego, recargar la página.
*   **Despliegue de Cambios:** Para actualizar la versión en GitHub Pages con las últimas modificaciones:
    1.  `git add .`
    2.  `git commit -m "Mensaje descriptivo de los cambios"`
    3.  `git push`
    4.  `npm run deploy`

---
## Sesión: 8 de Noviembre de 2025

### Cambios Realizados
*   **Corrección en Lógica de Pagos:** Se solucionó un error crítico donde al hacer un pago a una tarjeta de crédito o préstamo, el saldo de la deuda no se actualizaba.
*   **Mejora en Modelo de Datos de Transacciones:** Se modificó la estructura de las transacciones de "Pago de Deuda" y "Transferencia Interna" para incluir siempre la cuenta de origen y de destino (`fromAccountId`, `toAccountId`).
*   **Corrección en Eliminación de Transacciones:** Se reescribió la función de eliminar para que, gracias al nuevo modelo de datos, se puedan revertir correctamente los saldos de ambas cuentas al eliminar un pago o una transferencia.
*   **Corrección en Historial:** Se ajustó el componente del historial de transacciones para que pudiera mostrar correctamente los pagos y transferencias con la nueva estructura de datos.
*   **Nueva Función: Editar Deuda de Tarjetas de Crédito:** Se implementó la funcionalidad para editar directamente la "Deuda Actual" de una tarjeta de crédito desde el modal de edición de cuentas.
*   **Corrección en Panel de Resumen (Parcial):** Se robusteció la lógica del panel de resumen para que no falle al procesar los nuevos tipos de transacción.

### Tareas Pendientes
*   **Ajustar Cálculo de Gastos:** Modificar el `SummaryDashboard` para que los **pagos a deudas** (`Pago de Deuda`) se incluyan en los totales de "Gastos de Hoy" y "Gastos de la Semana", según el requerimiento del usuario. Las transferencias internas deben seguir excluidas de este cálculo.
