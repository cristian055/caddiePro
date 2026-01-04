import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Caddie, ListNumber, AppState, ListOrder } from '../types';
import { authApi, caddiesApi, turnsApi, attendanceApi, listSettingsApi, reportsApi } from '../services/api';

interface AppContextType {
  state: AppState;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addCaddie: (name: string, list: ListNumber) => Promise<void>;
  editCaddie: (id: string, name: string, list: ListNumber) => Promise<void>;
  deleteCaddie: (id: string) => Promise<void>;
  markSalioACargar: (caddieId: string) => Promise<void>;
  markRetorno: (caddieId: string) => Promise<void>;
  updateAttendance: (caddieId: string, status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso') => Promise<void>;
  setListOrder: (listNumber: ListNumber, order: ListOrder) => Promise<void>;
  setListRange: (listNumber: ListNumber, rangeStart?: number, rangeEnd?: number) => Promise<void>;
  getListCaddies: (list: ListNumber) => Caddie[];
  exportToCSV: () => Promise<void>;
  resetDaily: () => Promise<void>;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = (): AppState => ({
  caddies: [],
  turns: [],
  attendance: [],
  listSettings: [
    { listNumber: 1, callTime: '06:00', order: 'ascendente', createdAt: '', updatedAt: '' },
    { listNumber: 2, callTime: '08:00', order: 'ascendente', createdAt: '', updatedAt: '' },
    { listNumber: 3, callTime: '10:00', order: 'ascendente', createdAt: '', updatedAt: '' },
  ],
  currentDate: new Date().toISOString().split('T')[0],
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [caddies, turns, attendance, listSettings] = await Promise.all([
        caddiesApi.getAll(),
        turnsApi.getAll(),
        attendanceApi.getAll(),
        listSettingsApi.getAll(),
      ]);

      setState({
        caddies,
        turns,
        attendance,
        listSettings,
        currentDate: new Date().toISOString().split('T')[0],
      });

      const isAuthValid = await authApi.verify();
      setIsAdmin(isAuthValid.valid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(password);
      setIsAdmin(response.admin);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await authApi.logout();
      setIsAdmin(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
    }
  };

  const addCaddie = async (name: string, list: ListNumber) => {
    try {
      const newCaddie = await caddiesApi.create({ name, listNumber: list, status: 'Disponible' });
      setState(prev => ({
        ...prev,
        caddies: [...prev.caddies, newCaddie],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar caddie');
      throw err;
    }
  };

  const editCaddie = async (id: string, name: string, list: ListNumber) => {
    try {
      const updatedCaddie = await caddiesApi.update(id, { name, listNumber: list });
      setState(prev => ({
        ...prev,
        caddies: prev.caddies.map(c => c.id === id ? updatedCaddie : c),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al editar caddie');
      throw err;
    }
  };

  const deleteCaddie = async (id: string) => {
    try {
      await caddiesApi.delete(id);
      setState(prev => ({
        ...prev,
        caddies: prev.caddies.filter(c => c.id !== id),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar caddie');
      throw err;
    }
  };

  const markSalioACargar = async (caddieId: string) => {
    try {
      const caddie = state.caddies.find(c => c.id === caddieId);
      if (!caddie) throw new Error('Caddie no encontrado');

      const newTurn = await turnsApi.create({
        caddieId,
        caddieName: caddie.name,
        listNumber: caddie.listNumber,
      });

      setState(prev => ({
        ...prev,
        caddies: prev.caddies.map(c =>
          c.id === caddieId ? { ...c, status: 'En campo' as const } : c
        ),
        turns: [...prev.turns, newTurn],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar salió a cargar');
      throw err;
    }
  };

  const markRetorno = async (caddieId: string) => {
    try {
      const caddie = state.caddies.find(c => c.id === caddieId);
      if (!caddie || caddie.status !== 'En campo') throw new Error('Caddie no en campo');

      const relevantTurn = state.turns.find(
        t => t.caddieId === caddieId && !t.completed && t.listNumber === caddie.listNumber
      );

      if (!relevantTurn) throw new Error('Turno no encontrado');

      const updatedTurn = await turnsApi.update(relevantTurn.id, {
        endTime: new Date().toISOString(),
        completed: true,
      });

      setState(prev => ({
        ...prev,
        caddies: prev.caddies.map(c =>
          c.id === caddieId ? { ...c, status: 'Disponible' as const } : c
        ),
        turns: prev.turns.map(t => t.id === updatedTurn.id ? updatedTurn : t),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar retorno');
      throw err;
    }
  };

  const updateAttendance = async (caddieId: string, status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso') => {
    try {
      const caddie = state.caddies.find(c => c.id === caddieId);
      if (!caddie) throw new Error('Caddie no encontrado');

      const newRecord = await attendanceApi.create({
        caddieId,
        caddieName: caddie.name,
        listNumber: caddie.listNumber,
        date: state.currentDate,
        status,
      });

      let caddieStatus: 'Disponible' | 'En campo' | 'Ausente' = 'Disponible';
      if (status === 'No vino' || (status === 'Llegó tarde' && caddie.status === 'En campo')) {
        caddieStatus = 'Ausente';
      }

      setState(prev => ({
        ...prev,
        caddies: prev.caddies.map(c =>
          c.id === caddieId ? { ...c, status: caddieStatus } : c
        ),
        attendance: [...prev.attendance, newRecord],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar asistencia');
      throw err;
    }
  };

  const setListOrder = async (listNumber: ListNumber, order: ListOrder) => {
    try {
      const updatedSettings = await listSettingsApi.updateOrder(listNumber, order);
      setState(prev => ({
        ...prev,
        listSettings: prev.listSettings.map(s =>
          s.listNumber === listNumber ? { ...s, ...updatedSettings } : s
        ),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar orden');
      throw err;
    }
  };

  const setListRange = async (listNumber: ListNumber, rangeStart?: number, rangeEnd?: number) => {
    try {
      const updatedSettings = await listSettingsApi.updateRange(listNumber, rangeStart, rangeEnd);
      setState(prev => ({
        ...prev,
        listSettings: prev.listSettings.map(s =>
          s.listNumber === listNumber ? { ...s, ...updatedSettings } : s
        ),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rango');
      throw err;
    }
  };

  const getListCaddies = (list: ListNumber): Caddie[] => {
    const listSettings = state.listSettings.find(s => s.listNumber === list);
    let caddies = state.caddies.filter(c => c.listNumber === list && c.status !== 'Ausente');

    if (listSettings && listSettings.rangeStart !== undefined && listSettings.rangeEnd !== undefined) {
      const rangeStartIndex = listSettings.rangeStart - 1;
      const rangeEndIndex = listSettings.rangeEnd - 1;
      caddies = caddies.filter((_, index) => index >= rangeStartIndex && index <= rangeEndIndex);
    }

    if (listSettings?.order === 'descendente') {
      caddies = [...caddies].reverse();
    }

    return caddies.sort((a, b) => {
      if (a.status === 'Disponible' && b.status !== 'Disponible') return -1;
      if (a.status !== 'Disponible' && b.status === 'Disponible') return 1;
      return 0;
    });
  };

  const exportToCSV = async () => {
    try {
      await reportsApi.downloadCsv(state.currentDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar CSV');
      throw err;
    }
  };

  const resetDaily = async () => {
    try {
      const newDate = new Date().toISOString().split('T')[0];
      setState(prev => ({
        ...prev,
        currentDate: newDate,
        turns: [],
        attendance: [],
        caddies: prev.caddies.map(c => ({ ...c, status: 'Disponible' as const })),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reiniciar día');
      throw err;
    }
  };

  const value: AppContextType = {
    state,
    isAdmin,
    isLoading,
    error,
    refreshData,
    addCaddie,
    editCaddie,
    deleteCaddie,
    markSalioACargar,
    markRetorno,
    updateAttendance,
    setListOrder,
    setListRange,
    getListCaddies,
    exportToCSV,
    resetDaily,
    loginAdmin,
    logoutAdmin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
