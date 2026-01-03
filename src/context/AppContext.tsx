import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Caddie, ListNumber, AttendanceRecord, ListSettings, Turn, AppState, ListOrder } from '../types';

const STORAGE_KEY = 'caddiePro_state';

interface AppContextType {
  state: AppState;
  isAdmin: boolean;
  addCaddie: (name: string, list: ListNumber) => void;
  editCaddie: (id: string, name: string, list: ListNumber) => void;
  deleteCaddie: (id: string) => void;
  markSalioACargar: (caddieId: string) => void;
  markRetorno: (caddieId: string) => void;
  updateAttendance: (caddieId: string, status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso') => void;
  setListSettings: (settings: ListSettings[]) => void;
  setListOrder: (listNumber: ListNumber, order: ListOrder) => void;
  setListRange: (listNumber: ListNumber, rangeStart?: number, rangeEnd?: number) => void;
  getListCaddies: (list: ListNumber) => Caddie[];
  exportToCSV: () => void;
  resetDaily: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    caddies: [],
    turns: [],
    attendance: [],
    listSettings: [
      { listNumber: 1, callTime: '06:00', order: 'ascendente' },
      { listNumber: 2, callTime: '08:00', order: 'ascendente' },
      { listNumber: 3, callTime: '10:00', order: 'ascendente' },
    ],
    currentDate: new Date().toISOString().split('T')[0],
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('caddiePro_isAdmin');
      return stored === '1';
    } catch {
      return false;
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // persist admin flag
  useEffect(() => {
    try {
      localStorage.setItem('caddiePro_isAdmin', isAdmin ? '1' : '0');
    } catch {
      // ignore
    }
  }, [isAdmin]);

  // Basic client-side admin login (client-only). Change this password as needed.
  const ADMIN_PASSWORD = 'admin123';

  const loginAdmin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const addCaddie = (name: string, list: ListNumber) => {
    const newCaddie: Caddie = {
      id: `caddie_${Date.now()}`,
      name,
      list,
      status: 'Disponible',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      caddies: [...prev.caddies, newCaddie],
    }));
  };

  const editCaddie = (id: string, name: string, list: ListNumber) => {
    setState(prev => ({
      ...prev,
      caddies: prev.caddies.map(c =>
        c.id === id ? { ...c, name, list } : c
      ),
    }));
  };

  const deleteCaddie = (id: string) => {
    setState(prev => ({
      ...prev,
      caddies: prev.caddies.filter(c => c.id !== id),
    }));
  };

  const markSalioACargar = (caddieId: string) => {
    const caddie = state.caddies.find(c => c.id === caddieId);
    if (!caddie) return;

    const newTurn: Turn = {
      id: `turn_${Date.now()}`,
      caddieId,
      caddieName: caddie.name,
      listNumber: caddie.list,
      startTime: new Date().toISOString(),
      completed: false,
    };

    setState(prev => ({
      ...prev,
      caddies: prev.caddies.map(c =>
        c.id === caddieId ? { ...c, status: 'En campo' } : c
      ),
      turns: [...prev.turns, newTurn],
    }));
  };

  const markRetorno = (caddieId: string) => {
    const caddie = state.caddies.find(c => c.id === caddieId);
    if (!caddie || caddie.status !== 'En campo') return;

    const relevantTurns = state.turns.filter(
      t => t.caddieId === caddieId && !t.completed && t.listNumber === caddie.list
    );

    setState(prev => ({
      ...prev,
      caddies: prev.caddies.map(c =>
        c.id === caddieId ? { ...c, status: 'Disponible' } : c
      ),
      turns: prev.turns.map(t =>
        relevantTurns.some(rt => rt.id === t.id)
          ? { ...t, endTime: new Date().toISOString(), completed: true }
          : t
      ),
    }));
  };

  const updateAttendance = (caddieId: string, status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso') => {
    const caddie = state.caddies.find(c => c.id === caddieId);
    if (!caddie) return;

    let caddieStatus: 'Disponible' | 'En campo' | 'Ausente' = 'Disponible';
    if (status === 'No vino' || (status === 'Llegó tarde' && caddie.status === 'En campo')) {
      caddieStatus = 'Ausente';
    } else if (status === 'Llegó tarde') {
      // Move to end of list
      caddieStatus = 'Disponible';
    }

    const newRecord: AttendanceRecord = {
      id: `attendance_${Date.now()}`,
      caddieId,
      caddieName: caddie.name,
      listNumber: caddie.list,
      date: state.currentDate,
      status,
      callTime: new Date().toISOString(),
      turnsCount: state.turns.filter(t => t.caddieId === caddieId && t.completed).length,
    };

    setState(prev => ({
      ...prev,
      caddies: prev.caddies.map(c =>
        c.id === caddieId ? { ...c, status: caddieStatus } : c
      ),
      attendance: [...prev.attendance, newRecord],
    }));
  };

  const setListSettings = (settings: ListSettings[]) => {
    setState(prev => ({
      ...prev,
      listSettings: settings,
    }));
  };

  const setListOrder = (listNumber: ListNumber, order: ListOrder) => {
    setState(prev => ({
      ...prev,
      listSettings: prev.listSettings.map(s =>
        s.listNumber === listNumber ? { ...s, order } : s
      ),
    }));
  };

  const setListRange = (listNumber: ListNumber, rangeStart?: number, rangeEnd?: number) => {
    setState(prev => ({
      ...prev,
      listSettings: prev.listSettings.map(s =>
        s.listNumber === listNumber ? { ...s, rangeStart, rangeEnd } : s
      ),
    }));
  };

  const getListCaddies = (list: ListNumber): Caddie[] => {
    const listSettings = state.listSettings.find(s => s.listNumber === list);
    let caddies = state.caddies.filter(c => c.list === list && c.status !== 'Ausente');

    if (listSettings && listSettings.rangeStart !== undefined && listSettings.rangeEnd !== undefined) {
      const rangeStart = listSettings.rangeStart - 1;
      const rangeEnd = listSettings.rangeEnd - 1;
      caddies = caddies.filter((_, index) => index >= rangeStart && index <= rangeEnd);
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

  const exportToCSV = () => {
    const headers = ['Fecha', 'Nombre Caddie', 'Lista', 'Hora Entrada', 'Estado', 'Turnos Completados', 'Hora Salida'];
    const rows = state.attendance.map(record => [
      record.date,
      record.caddieName,
      record.listNumber,
      record.callTime.split('T')[1].substring(0, 5),
      record.status,
      record.turnsCount,
      record.endTime ? record.endTime.split('T')[1].substring(0, 5) : 'En curso',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${state.currentDate}.csv`;
    a.click();
  };

  const resetDaily = () => {
    const newDate = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      currentDate: newDate,
      turns: [],
      attendance: [],
      caddies: prev.caddies.map(c => ({ ...c, status: 'Disponible' })),
    }));
  };

  const value: AppContextType = {
    state,
    isAdmin,
    addCaddie,
    editCaddie,
    deleteCaddie,
    markSalioACargar,
    markRetorno,
    updateAttendance,
    setListSettings,
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
