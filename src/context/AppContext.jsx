import { createContext, useContext, useState } from 'react';
import { trees as initialTrees, adoptions as initialAdoptions, maintenances as initialMaintenances, reminders as initialReminders, users } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [role, setRole] = useState('resident');
  const [currentUser, setCurrentUser] = useState(users.residents[0]);
  const [treesData, setTreesData] = useState(initialTrees);
  const [adoptionsData, setAdoptionsData] = useState(initialAdoptions);
  const [maintenancesData, setMaintenancesData] = useState(initialMaintenances);
  const [remindersData, setRemindersData] = useState(initialReminders);

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'resident') setCurrentUser(users.residents[0]);
    else if (newRole === 'greenkeeper') setCurrentUser(users.greenkeepers[0]);
    else if (newRole === 'committee') setCurrentUser(users.committee[0]);
  };

  const adoptTree = (treeId) => {
    const tree = treesData.find(t => t.id === treeId);
    if (!tree || tree.status !== 'healthy') return false;
    const existing = adoptionsData.find(a => a.treeId === treeId && a.status === 'active');
    if (existing) return false;
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
    const newAdoption = { id: 'a' + Date.now(), treeId, residentId: currentUser.id, residentName: currentUser.name, startDate: today, endDate, status: 'active', adoptDate: today };
    setAdoptionsData([...adoptionsData, newAdoption]);
    return true;
  };

  const cancelAdoption = (adoptionId) => {
    setAdoptionsData(adoptionsData.map(a => a.id === adoptionId ? { ...a, status: 'cancelled' } : a));
  };

  const addMaintenance = (treeId, type, note) => {
    const activeAdoption = adoptionsData.find(a => a.treeId === treeId && a.status === 'active');
    const today = new Date();
    if (activeAdoption && new Date(activeAdoption.endDate) < today) return false;
    const newMaintenance = { id: 'm' + Date.now(), treeId, greenkeeperId: currentUser.id, greenkeeperName: currentUser.name, type, note, date: today.toISOString().split('T')[0] };
    setMaintenancesData([...maintenancesData, newMaintenance]);
    return true;
  };

  const markReminderRead = (reminderId) => {
    setRemindersData(remindersData.map(r => r.id === reminderId ? { ...r, status: 'read' } : r));
  };

  const getActiveAdoptionForTree = (treeId) => adoptionsData.find(a => a.treeId === treeId && a.status === 'active');
  const getMaintenancesForTree = (treeId) => maintenancesData.filter(m => m.treeId === treeId).sort((a,b) => new Date(b.date) - new Date(a.date));
  const getMyAdoptions = () => role === 'resident' ? adoptionsData.filter(a => a.residentId === currentUser.id) : [];
  const getUnreadReminders = () => remindersData.filter(r => r.status === 'unread').length;

  const value = { role, currentUser, treesData, adoptionsData, maintenancesData, remindersData, switchRole, adoptTree, cancelAdoption, addMaintenance, markReminderRead, getActiveAdoptionForTree, getMaintenancesForTree, getMyAdoptions, getUnreadReminders };

  return <AppContext.Provider value={value}> {children} </AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
