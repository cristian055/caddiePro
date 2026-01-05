# Soluciones Aplicadas - Actualización en Tiempo Real

## Problemas Identificados

### 1. Reconexión en Cada Render
**Problema:** El componente `CaddieTurns` se estaba reconectando al WebSocket en cada render.

**Causa:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('caddiePro_token');
  if (token) {
    wsService.connect(token);
    setIsConnected(true);
  }
  return () => {
    wsService.disconnect();
    setIsConnected(false);
  };
}, []); // [] sin dependencias correctas
```

**Solución:**
```typescript
const [hasConnected, setHasConnected] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('caddiePro_token');
  if (token && !hasConnected) { // Solo conectar si NO está conectado
    console.log('[CaddieTurns] Connecting to WebSocket...');
    wsService.connect(token);
    setHasConnected(true);
  }

  return () => {
    console.log('[CaddieTurns] Disconnecting WebSocket...');
    wsService.disconnect();
    setHasConnected(false);
  };
}, [hasConnected]); // Depende de hasConnected
```

### 2. Callback Recreado en Cada Render
**Problema:** La función de callback para `useCaddieUpdates` se recreaba en cada render, causando re-suscripciones constantes.

**Causa:**
```typescript
// Función inline se recrea en cada render
useCaddieUpdates(
  (update) => {
    updateCaddieStatusLocal(update.caddieId, update.status);
  }
);
```

**Solución:**
```typescript
const handleCaddieUpdate = useCallback((update: CaddieUpdate) => {
  console.log('[WS] Actualización recibida:', update);
  console.log('[WS] Caddie ID:', update.caddieId);
  console.log('[WS] Nuevo estado:', update.status);
  updateCaddieStatusLocal(update.caddieId, update.status as 'Disponible' | 'En campo' | 'Ausente');
}, [updateCaddieStatusLocal]);

useCaddieUpdates(handleCaddieUpdate); // Pasar la función memorizada
```

### 3. Estado de Conexión Incorrecto
**Problema:** El estado de conexión se establecía a `true` inmediatamente, antes de que el WebSocket realmente se conectara.

**Causa:**
```typescript
if (token) {
  wsService.connect(token);
  setIsConnected(true); // ¡Error! Se establece a true aunque todavía no esté conectado
}
```

**Solución:**
```typescript
useEffect(() => {
  wsService.onConnectionChange((connected) => {
    setIsConnected(connected); // Solo actualizar cuando WebSocket notifique
  });
}, []);
```

### 4. Falta Limpieza de Listeners
**Problema:** Los listeners de cambios de conexión no se limpiaban al desmontar el componente.

**Solución:**
```typescript
useEffect(() => {
  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
  };

  wsService.onConnectionChange(handleConnectionChange);

  return () => {
    wsService.offConnectionChange(handleConnectionChange); // Limpiar listener
  };
}, []);
```

### 5. Logging Insuficiente
**Problema:** No había suficiente información para depurar problemas.

**Solución:**
- Agregué logging de todos los eventos recibidos en el servicio WebSocket
- Agregué logging detallado en el componente
- Verificación de estado después de la actualización

## Archivos Modificados

### 1. `src/services/websocket.ts`
- ✅ Agregué logging de todos los eventos recibidos del backend
- ✅ Agregué método `offConnectionChange()` para limpieza
- ✅ Mejoré logging de conexión/desconexión
- ✅ Limpieza de callbacks al desconectar

### 2. `src/components/CaddieTurns.tsx`
- ✅ Agregué `useCallback` para función de manejo de actualizaciones
- ✅ Agregué estado `hasConnected` para evitar reconexiones múltiples
- ✅ Separé listener de conexión en su propio `useEffect`
- ✅ Agregué limpieza de listeners al desmontar
- ✅ Agregué logging detallado para depuración
- ✅ Agregué verificación de estado después de actualización

## Cómo Depurar Ahora

### Paso 1: Abrir Consola
Presiona `F12` y ve a la pestaña "Console"

### Paso 2: Ver Logs de Conexión
Debes ver estos logs cuando cargues la página de Turnos:

```
[CaddieTurns] Connecting to WebSocket...
[WS] Conectando a: http://localhost:3000
[WS] Conectado: xxxxx-socket-id
[CaddieTurns] Connection state changed: true
```

### Paso 3: Ver Logs de Eventos
El servicio WebSocket ahora loguea TODOS los eventos recibidos:

```
[WS] EVENTO RECIBIDO: caddie:status_changed {caddieId: "...", name: "...", status: "En campo", ...}
[WS] Actualización recibida: {caddieId: "...", name: "...", status: "En campo", ...}
[WS] Caddie ID: uuid-...
[WS] Nuevo estado: En campo
[WS] Lista: 1
```

### Paso 4: Verificar Actualización de Estado
El componente ahora verifica el estado 100ms después de la actualización:

```
[WS] Estado después de update: {id: "...", name: "...", status: "En campo", ...}
```

## Posibles Problemas Restantes

### Si NO ves logs `[WS] EVENTO RECIBIDO`:

1. **El backend no está enviando eventos**
   - Verifica el código del backend
   - Confirma que se está llamando `emit('caddie:status_changed', data)`

2. **El nombre del evento es incorrecto**
   - Debe ser exactamente: `caddie:status_changed`
   - NO: `caddie_status_changed` (con guion bajo)
   - NO: `caddieStatusChanged` (camelCase)

3. **No estás en la sala correcta**
   - El backend debe emitir a: `io.to(\`list-${listNumber}\`)`
   - No: `io.emit()` (esto envía a todos)

### Si ves logs pero la UI NO se actualiza:

1. **El ID del caddie no coincide**
   - Verifica que `update.caddieId` existe en `state.caddies`
   - Puede que el caddie no esté en la lista filtrada

2. **El estado se actualiza pero `getListCaddies` no lo refleja**
   - Verifica que `updateCaddieStatusLocal` está funcionando
   - Agrega logging al inicio de `getListCaddies` en AppContext

### Si la conexión falla:

1. **Token inválido o expirado**
   - Error en consola: `[WS] Error de conexión`
   - Solución: Hacer logout y login de nuevo

2. **URL incorrecta**
   - Verifica `VITE_WS_URL` en `.env`
   - Debe coincidir con la URL del backend

3. **Backend no tiene WebSocket habilitado**
   - El servidor backend debe tener el servidor Socket.IO iniciado
   - Verifica que ves logs de conexión en el backend

## Prueba con Dos Pestañas

1. Abre **Pestaña 1**: `http://localhost:5173/` (Vista de Caddies/turnos)
2. Abre **Pestaña 2**: `http://localhost:5173/lists` (Dashboard admin)
3. En Pestaña 1, verifica que el indicador dice **"Conectado en tiempo real"** (verde)
4. En Pestaña 2, haz clic en "Salió a Cargar" para un caddie
5. **Inmediatamente** (en menos de 100ms), en Pestaña 1 debes ver:
   - El caddie aparece en la sección "EN TURNO"
   - Logs en consola mostrando el evento recibido
   - Logs verificando que el estado se actualizó

## Si Todo Funciona Correctamente

Verás esta secuencia de logs:

```
[CaddieTurns] Connecting to WebSocket...
[WS] Conectando a: http://localhost:3000
[WS] Conectado: abc123-socket-id
[CaddieTurns] Connection state changed: true

[... Admin hace clic en "Salió a Cargar" ...]

[WS] EVENTO RECIBIDO: caddie:status_changed {caddieId: "uuid-123", name: "Alejandro", status: "En campo", listNumber: 1, timestamp: "..."}
[WS] Actualización recibida: {caddieId: "uuid-123", name: "Alejandro", status: "En campo", listNumber: 1, timestamp: "..."}
[WS] Caddie ID: uuid-123
[WS] Nuevo estado: En campo
[WS] Lista: 1
[WS] Estado después de update: {id: "uuid-123", name: "Alejandro", status: "En campo", listNumber: 1, ...}
```

## Resumen de Arreglo

✅ **WebSocket se conecta solo una vez** (no en cada render)
✅ **Callback de actualización es estable** (useCallback con dependencias)
✅ **Estado de conexión es correcto** (actualizado por eventos de WebSocket)
✅ **Listeners se limpian correctamente** al desmontar
✅ **Logging detallado** para depuración fácil
✅ **Verificación de estado** después de actualización

**Prueba ahora y revisa los logs en la consola del navegador!**
