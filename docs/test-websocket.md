# WebSocket Connection Test

## Prerequisitos

1. Backend server running with WebSocket enabled
2. Frontend server running with `npm run dev`
3. Token válido en localStorage

## Pasos para Probar

### 1. Abrir Consola del Navegador

Presiona `F12` y ve a la pestaña "Console"

### 2. Navegar a Turnos

Ve a la página principal (`/`) donde se muestra `Turnos Actuales`

### 3. Verificar Conexión

Debes ver estos logs en consola:
```
[WS] Conectado: xxxxx-socket-id
```

El indicador debe mostrar **"Conectado en tiempo real"** en verde.

### 4. Ver Eventos del Backend

En la consola del backend, verifica que estás enviando eventos con el formato correcto:

**Evento esperado:**
```json
{
  "event": "caddie:status_changed",
  "data": {
    "caddieId": "uuid-123",
    "name": "Alejandro",
    "status": "En campo",
    "listNumber": 1,
    "timestamp": "2026-01-05T15:00:00.000Z"
  }
}
```

**IMPORTANTE:** El evento debe llamarse `caddie:status_changed` (no `caddie_status_changed` con underscore).

### 5. Prueba de Actualización en Tiempo Real

1. Abre **dos pestañas del navegador**:
   - Pestaña 1: `/` (Vista de Turnos - vista de caddies)
   - Pestaña 2: `/lists` (Dashboard de administración)

2. En la Pestaña 2 (Admin):
   - Busca un caddie con estado "Disponible"
   - Haz clic en el botón "Salió a Cargar"
   - El caddie debe cambiar a estado "En campo"

3. En la Pestaña 1 (Caddies):
   - **Deberías ver inmediatamente** (en menos de 100ms) el nombre del caddie en la sección "EN TURNO"
   - En la consola, debes ver:
     ```
     [WS] Actualización recibida: {caddieId: "...", name: "Alejandro", status: "En campo", listNumber: 1, timestamp: "..."}
     [WS] Caddie ID: uuid-...
     [WS] Nuevo estado: En campo
     ```

### 6. Verificar Estado React

Si los logs de WebSocket aparecen pero la UI no se actualiza, agrega esto temporalmente al componente:

```typescript
// Agregar después de getListCaddies
console.log('Caddies en lista:', getListCaddies(1));
console.log('Caddie En campo:', getListCaddies(1).find(c => c.status === 'En campo'));
```

### 7. Depuración de Errores Comunes

**Error: No se ven los logs `[WS]`**
- Verifica que el backend está corriendo
- Verifica que `VITE_WS_URL` en `.env` es correcta
- Verifica el Network tab → WS → Estado de conexión

**Error: Conexión falla con 401**
- Token inválido o expirado
- Haz logout y login de nuevo

**Error: Estado de conexión siempre en rojo**
- Backend no tiene WebSocket activado
- URL incorrecta en `VITE_WS_URL`

**Error: UI no se actualiza aunque logs aparecen**
- Posible problema con actualización de estado React
- Verifica que `updateCaddieStatusLocal` está siendo llamada
- Verifica que `getListCaddies` devuelve el caddie actualizado

**Error: Logs muestran datos incorrectos**
- Verifica el nombre del evento en el backend
- Debe ser exactamente `caddie:status_changed`
- Verifica la estructura del payload

### 8. Test con Socket.IO Debug Mode

Para ver más detalles, modifica temporalmente la conexión en `websocket.ts`:

```typescript
this.socket = io(WS_URL, {
  auth: { token },
  transports: ['websocket', 'polling'],
  reconnectionAttempts: WS_RECONNECT_ATTEMPTS,
  reconnectionDelay: WS_RECONNECT_DELAY,
  debug: true, // Agregar esta línea
});
```

### 9. Verificar Payload del Evento

En el callback del componente, agrega logging detallado:

```typescript
const handleCaddieUpdate = useCallback((update: CaddieUpdate) => {
  console.log('=== WebSocket Event Received ===');
  console.log('Caddie ID:', update.caddieId);
  console.log('Caddie Name:', update.name);
  console.log('New Status:', update.status);
  console.log('List Number:', update.listNumber);
  console.log('Timestamp:', update.timestamp);
  console.log('===============================');
  
  updateCaddieStatusLocal(update.caddieId, update.status as 'Disponible' | 'En campo' | 'Ausente');
}, [updateCaddieStatusLocal]);
```

### 10. Verificar Actualización de Estado

Después de llamar `updateCaddieStatusLocal`, agrega:

```typescript
// Verificar que el estado se actualizó
setTimeout(() => {
  const list1Caddies = getListCaddies(1);
  const inField = list1Caddies.find(c => c.status === 'En campo');
  console.log('Caddies después de update:', list1Caddies);
  console.log('Caddie En campo:', inField);
}, 100);
```

## Resultados Esperados

✅ Conexión establecida (indicador verde)
✅ Logs `[WS]` aparecen en consola
✅ Cambios de estado se reflejan en menos de 100ms
✅ No hay necesidad de recargar página
✅ Múltiples clientes ven actualizaciones simultáneamente

## Si No Funciona

1. Verifica el nombre del evento en backend (debe ser `caddie:status_changed`)
2. Verifica que estás emitiendo a la sala correcta (`list-1`, `list-2`, `list-3`)
3. Verifica el formato del payload JSON
4. Verifica logs de consola del navegador
5. Verifica logs de consola del backend
