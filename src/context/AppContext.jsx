import { createContext, useContext, useState } from 'react';
import {
  trees as initialTrees,
  adoptions as initialAdoptions,
  maintenances as initialMaintenances,
  reminders as initialReminders,
  users,
  speciesInfo,
  seasonalPlans as initialSeasonalPlans,
  transfers as initialTransfers,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [role, setRole] = useState('resident');
  const [currentUser, setCurrentUser] = useState(users.residents[0]);
  const [treesData, setTreesData] = useState(initialTrees);
  const [adoptionsData, setAdoptionsData] = useState(initialAdoptions);
  const [maintenancesData, setMaintenancesData] = useState(initialMaintenances);
  const [remindersData, setRemindersData] = useState(initialReminders);
  const [seasonalPlansData, setSeasonalPlansData] = useState(initialSeasonalPlans);
  const [transfersData, setTransfersData] = useState(initialTransfers);

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'resident') setCurrentUser(users.residents[0]);
    else if (newRole === 'greenkeeper') setCurrentUser(users.greenkeepers[0]);
    else if (newRole === 'committee') setCurrentUser(users.committee[0]);
  };

  const getSpeciesInfo = (species) => speciesInfo[species] || null;

  const adoptTree = (treeId) => {
    const tree = treesData.find(t => t.id === treeId);
    if (!tree || tree.status !== 'healthy') return false;
    const existing = adoptionsData.find(a => a.treeId === treeId && a.status === 'active');
    if (existing) return false;
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
    const newAdoption = {
      id: 'a' + Date.now(),
      treeId,
      residentId: currentUser.id,
      residentName: currentUser.name,
      startDate: today,
      endDate,
      status: 'active',
      adoptDate: today,
      isReadOnly: false,
      survivalRate: '100%',
      abnormalReason: null,
      transferHistory: [],
      careTrack: [],
    };
    setAdoptionsData([...adoptionsData, newAdoption]);
    return true;
  };

  const cancelAdoption = (adoptionId) => {
    setAdoptionsData(adoptionsData.map(a =>
      a.id === adoptionId ? { ...a, status: 'cancelled' } : a
    ));
  };

  const addMaintenance = (treeId, type, note) => {
    const today = new Date();
    const treeAdoptions = adoptionsData.filter(a => a.treeId === treeId);
    const activeAdoption = treeAdoptions.find(a => a.status === 'active');
    const latestAdoption = treeAdoptions.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];
    if (latestAdoption && !activeAdoption && new Date(latestAdoption.endDate) < today) return false;
    if (activeAdoption && new Date(activeAdoption.endDate) < today) return false;
    const newMaintenance = {
      id: 'm' + Date.now(),
      treeId,
      type,
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      note,
      date: today.toISOString().split('T')[0],
    };
    setMaintenancesData([...maintenancesData, newMaintenance]);
    if (activeAdoption) {
      setAdoptionsData(adoptionsData.map(a =>
        a.id === activeAdoption.id
          ? {
              ...a,
              careTrack: [
                ...a.careTrack,
                {
                  date: newMaintenance.date,
                  type,
                  operator: currentUser.name,
                  note,
                },
              ],
            }
          : a
      ));
    }
    return true;
  };

  const markReminderRead = (reminderId) => {
    setRemindersData(remindersData.map(r =>
      r.id === reminderId ? { ...r, status: 'read' } : r
    ));
  };

  const expireAdoption = (adoptionId) => {
    setAdoptionsData(adoptionsData.map(a =>
      a.id === adoptionId
        ? { ...a, status: 'expired', isReadOnly: true }
        : a
    ));
  };

  const checkAndExpireAdoptions = () => {
    const today = new Date();
    setAdoptionsData(adoptionsData.map(a => {
      if (a.status === 'active' && new Date(a.endDate) < today) {
        return { ...a, status: 'expired', isReadOnly: true };
      }
      return a;
    }));
  };

  const judgeSeasonalAction = (planId, actionId, status, note) => {
    const today = new Date().toISOString().split('T')[0];
    setSeasonalPlansData(seasonalPlansData.map(p =>
      p.id === planId
        ? {
            ...p,
            actions: p.actions.map(a =>
              a.id === actionId
                ? { ...a, status, note: note || a.note, judgedBy: currentUser.name, judgedDate: today }
                : a
            ),
          }
        : p
    ));
    return true;
  };

  const createSeasonalPlan = (treeId, season, plan, actions) => {
    const today = new Date().toISOString().split('T')[0];
    const newPlan = {
      id: 'sp' + Date.now(),
      treeId,
      season,
      year: new Date().getFullYear(),
      plan,
      actions: actions.map((a, idx) => ({
        id: 'sa' + Date.now() + idx,
        ...a,
      })),
      createdBy: currentUser.id,
      createdName: currentUser.name,
      createdDate: today,
    };
    setSeasonalPlansData([...seasonalPlansData, newPlan]);
    return true;
  };

  const updateSeasonalPlanAction = (planId, actionId, updates) => {
    setSeasonalPlansData(seasonalPlansData.map(p =>
      p.id === planId
        ? {
            ...p,
            actions: p.actions.map(a =>
              a.id === actionId ? { ...a, ...updates } : a
            ),
          }
        : p
    ));
  };

  const updateSeasonalPlanActionStatus = (planId, actionId, status, note, date) => {
    const today = new Date().toISOString().split('T')[0];
    setSeasonalPlansData(seasonalPlansData.map(p =>
      p.id === planId
        ? {
            ...p,
            actions: p.actions.map(a =>
              a.id === actionId
                ? {
                    ...a,
                    status,
                    note: note || a.note,
                    date: date || (status === 'confirmed' || status === 'done' ? today : a.date),
                    judgedBy: currentUser.name,
                    judgedDate: today,
                  }
                : a
            ),
          }
        : p
    ));
    return true;
  };

  const createTransfer = (adoptionId, toResidentId, toResidentName, startDate, endDate, reason) => {
    const adoption = adoptionsData.find(a => a.id === adoptionId);
    if (!adoption) return false;
    const newTransfer = {
      id: 'tf' + Date.now(),
      adoptionId,
      fromResidentId: adoption.residentId,
      fromResidentName: adoption.residentName,
      toResidentId,
      toResidentName,
      startDate,
      endDate,
      reason,
      status: 'active',
    };
    setTransfersData([...transfersData, newTransfer]);
    setAdoptionsData(adoptionsData.map(a =>
      a.id === adoptionId
        ? {
            ...a,
            transferHistory: [
              ...a.transferHistory,
              {
                fromResident: adoption.residentName,
                toResident: toResidentName,
                startDate,
                endDate,
                reason,
              },
            ],
          }
        : a
    ));
    return true;
  };

  const returnTransfer = (transferId) => {
    setTransfersData(transfersData.map(t =>
      t.id === transferId ? { ...t, status: 'returned' } : t
    ));
  };

  const getActiveAdoptionForTree = (treeId) =>
    adoptionsData.find(a => a.treeId === treeId && a.status === 'active');

  const getMaintenancesForTree = (treeId) =>
    maintenancesData.filter(m => m.treeId === treeId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getLastWateringForTree = (treeId) => {
    const waterings = maintenancesData.filter(
      m => m.treeId === treeId && (m.type === 'watering' || m.type === 'water')
    );
    if (waterings.length === 0) return null;
    return waterings.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const getMyAdoptions = () =>
    role === 'resident'
      ? adoptionsData.filter(a => a.residentId === currentUser.id)
      : [];

  const getUnreadReminders = () =>
    remindersData.filter(r => r.status === 'unread').length;

  const getSeasonalPlansForTree = (treeId) =>
    seasonalPlansData.filter(p => p.treeId === treeId)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  const getTransfersForAdoption = (adoptionId) =>
    transfersData.filter(t => t.adoptionId === adoptionId)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const getWitherReminders = () =>
    remindersData.filter(r => r.type === 'wither_warning');

  const getSeasonName = (season) => {
    const map = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
    return map[season] || season;
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const value = {
    role,
    currentUser,
    treesData,
    adoptionsData,
    maintenancesData,
    remindersData,
    seasonalPlansData,
    transfersData,
    speciesInfo,
    switchRole,
    adoptTree,
    cancelAdoption,
    expireAdoption,
    checkAndExpireAdoptions,
    addMaintenance,
    markReminderRead,
    createSeasonalPlan,
    updateSeasonalPlanAction,
    updateSeasonalPlanActionStatus,
    judgeSeasonalAction,
    createTransfer,
    returnTransfer,
    getSpeciesInfo,
    getActiveAdoptionForTree,
    getMaintenancesForTree,
    getLastWateringForTree,
    getMyAdoptions,
    getUnreadReminders,
    getSeasonalPlansForTree,
    getTransfersForAdoption,
    getWitherReminders,
    getSeasonName,
    getCurrentSeason,
    users,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
