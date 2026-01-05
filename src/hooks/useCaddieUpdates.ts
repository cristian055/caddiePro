import { useEffect } from 'react';
import { wsService } from '../services/websocket';
import type { CaddieUpdate, CaddieAddedData, CaddieDeletedData } from '../services/websocket';

export interface UseCaddieUpdatesOptions {
  onStatusChanged?: (update: CaddieUpdate) => void;
  onCaddieAdded?: (data: CaddieAddedData) => void;
  onCaddieUpdated?: (data: CaddieUpdate) => void;
  onCaddieDeleted?: (data: CaddieDeletedData) => void;
}

/**
 * Hook para suscribirse a actualizaciones de caddies en tiempo real via WebSocket.
 * Todas las suscripciones se limpian automáticamente al desmontar.
 */
export function useCaddieUpdates(options: UseCaddieUpdatesOptions) {
  const { onStatusChanged, onCaddieAdded, onCaddieUpdated, onCaddieDeleted } = options;

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    // Suscribirse a cada evento si hay un callback definido
    if (onStatusChanged) {
      cleanupFns.push(wsService.onCaddieStatusChanged(onStatusChanged));
    }

    if (onCaddieAdded) {
      cleanupFns.push(wsService.onCaddieAdded(onCaddieAdded));
    }

    if (onCaddieUpdated) {
      cleanupFns.push(wsService.onCaddieUpdated(onCaddieUpdated));
    }

    if (onCaddieDeleted) {
      cleanupFns.push(wsService.onCaddieDeleted(onCaddieDeleted));
    }

    // Limpiar todas las suscripciones al desmontar
    return () => {
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [onStatusChanged, onCaddieAdded, onCaddieUpdated, onCaddieDeleted]);
}
