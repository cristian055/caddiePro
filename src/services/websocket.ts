import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const WS_RECONNECT_ATTEMPTS = 5;
const WS_RECONNECT_DELAY = 3000;

// Tipos de eventos de WebSocket
export type CaddieUpdate = {
  caddieId: string;
  name: string;
  status: string;
  listNumber: number;
  timestamp: string;
};

export type CaddieAddedData = {
  caddieId: string;
  name: string;
  listNumber: number;
  status: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export type CaddieDeletedData = {
  caddieId: string;
  timestamp: string;
};

// Tipos de eventos soportados
export type WebSocketEvent = 
  | 'caddie:status_changed'
  | 'caddie:added'
  | 'caddie:updated'
  | 'caddie:deleted';

type EventCallback<T = unknown> = (data: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private connectionCallbacks: Set<(isConnected: boolean) => void> = new Set();
  private isConnecting = false;

  connect(token: string): void {
    // Evitar conexiones duplicadas
    if (this.socket?.connected || this.isConnecting) {
      console.log('[WS] Ya conectado o conectando, ignorando');
      return;
    }

    this.isConnecting = true;
    console.log('[WS] Conectando a:', WS_URL);

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: WS_RECONNECT_ATTEMPTS,
      reconnectionDelay: WS_RECONNECT_DELAY,
      autoConnect: true,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WS] Conectado:', this.socket?.id);
      this.isConnecting = false;
      this.notifyConnectionChange(true);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WS] Error de conexión:', error.message);
      this.isConnecting = false;
      this.notifyConnectionChange(false);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WS] Desconectado:', reason);
      this.notifyConnectionChange(false);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[WS] Reconectado después de', attemptNumber, 'intentos');
      this.notifyConnectionChange(true);
    });

    // Registrar handlers para todos los eventos de caddie
    const caddieEvents: WebSocketEvent[] = [
      'caddie:status_changed',
      'caddie:added', 
      'caddie:updated',
      'caddie:deleted'
    ];

    caddieEvents.forEach(event => {
      this.socket?.on(event, (data: unknown) => {
        console.log(`[WS] Evento recibido: ${event}`, data);
        this.notifyListeners(event, data);
      });
    });
  }

  private notifyConnectionChange(isConnected: boolean): void {
    this.connectionCallbacks.forEach(cb => cb(isConnected));
  }

  private notifyListeners(event: string, rawData: unknown): void {
    const listeners = this.listeners.get(event);
    if (!listeners || listeners.size === 0) {
      console.log(`[WS] No hay listeners para ${event}`);
      return;
    }

    // Normalizar datos - algunos backends envuelven en { data, event, timestamp }
    const data = (rawData as { data?: unknown })?.data ?? rawData;
    
    console.log(`[WS] Notificando ${listeners.size} listeners para ${event}`, data);
    listeners.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[WS] Error en listener de ${event}:`, err);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('[WS] Desconectando...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      console.log('[WS] Desconectado');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Registrar listener para un evento específico
  on<T = unknown>(event: WebSocketEvent, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    const typedCallback = callback as EventCallback;
    this.listeners.get(event)!.add(typedCallback);
    console.log(`[WS] Listener registrado para ${event}, total: ${this.listeners.get(event)!.size}`);

    // Retornar función de limpieza
    return () => {
      this.off(event, typedCallback);
    };
  }

  // Remover listener específico
  off(event: string, callback: EventCallback): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      console.log(`[WS] Listener removido de ${event}, restantes: ${listeners.size}`);
    }
  }

  // Suscribirse a cambios de conexión
  onConnectionChange(callback: (isConnected: boolean) => void): () => void {
    this.connectionCallbacks.add(callback);
    // Notificar estado actual inmediatamente
    callback(this.isConnected());
    
    // Retornar función de limpieza
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  // Métodos de conveniencia para eventos específicos
  onCaddieStatusChanged(callback: EventCallback<CaddieUpdate>): () => void {
    return this.on('caddie:status_changed', callback);
  }

  onCaddieAdded(callback: EventCallback<CaddieAddedData>): () => void {
    return this.on('caddie:added', callback);
  }

  onCaddieUpdated(callback: EventCallback<CaddieUpdate>): () => void {
    return this.on('caddie:updated', callback);
  }

  onCaddieDeleted(callback: EventCallback<CaddieDeletedData>): () => void {
    return this.on('caddie:deleted', callback);
  }
}

// Singleton exportado
export const wsService = new WebSocketService();
