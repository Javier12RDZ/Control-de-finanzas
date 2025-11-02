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

### 2. Gestión de Transacciones
*   **Registro de Gastos:** Formulario para añadir gastos con descripción, monto, categoría y fecha.
*   **Registro de Ingresos:** Nuevo formulario para registrar ingresos con descripción, monto y fecha.
*   **Edición de Transacciones:** Funcionalidad para modificar los detalles de cualquier transacción.
*   **Eliminación de Transacciones:** Opción para borrar transacciones del historial.
*   **Visualización:** Diferenciación visual (color) entre ingresos y gastos en el historial de transacciones.

### 3. Gestión de Deudas y Pagos
*   **Pagos/Transferencias:** Formulario dedicado para realizar pagos desde cuentas de débito/efectivo hacia tarjetas de crédito o préstamos personales.
*   **Actualización de Balances:** La lógica de la aplicación actualiza automáticamente los balances de las cuentas al registrar gastos, ingresos o realizar pagos, manejando correctamente la deuda en tarjetas y préstamos.

### 4. Resúmenes y Reportes
*   **Panel de Resumen General:** Muestra métricas clave:
    *   Total en Cuentas (suma de saldos de débito/efectivo).
    *   Deuda Total (suma de saldos pendientes de tarjetas de crédito y préstamos).
    *   Gastos de Hoy.
    *   Gastos de la Semana.
    *   Ingresos de la Semana.
*   **Menú Lateral (Off-canvas):** Desplegable desde la esquina superior izquierda.
*   **Filtro por Rango de Fechas:** Dentro del menú lateral, permite seleccionar un periodo para generar un reporte.
*   **Reporte por Periodo:** Muestra los ingresos y gastos totales para el rango de fechas seleccionado.

### 5. Aspectos Técnicos
*   **Tecnologías:** React (Vite), Bootstrap (CSS y JS vía CDN).
*   **Estado:** Gestión de estado con `useState` y `useEffect` de React. Persistencia de datos en `localStorage`.
*   **Despliegue:** Configurado para despliegue en GitHub Pages (`npm run deploy`).

## Notas Importantes y Solución de Problemas
*   **Pantalla en Blanco/Errores:** Si la aplicación muestra una pantalla en blanco o errores inesperados, es probable que los datos guardados en el `localStorage` del navegador sean de una versión anterior con una estructura incompatible.
    *   **Solución:** Abrir las Herramientas de Desarrollador (F12), ir a la pestaña "Aplicación" (o "Application"), buscar "Almacenamiento local" (o "Local Storage"), seleccionar la URL de la aplicación y limpiar todos los datos (`Clear all`). Luego, recargar la página.
*   **Despliegue de Cambios:** Para actualizar la versión en GitHub Pages con las últimas modificaciones:
    1.  `git add .`
    2.  `git commit -m "Mensaje descriptivo de los cambios"`
    3.  `git push`
    4.  `npm run deploy`