import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TreePine, Home, Heart, Droplets, BarChart3, Bell, User, LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, currentUser, getUnreadReminders } = useApp();

  const roleName = {
    resident: '居民',
    greenkeeper: '绿化员',
    committee: '居委会',
  };

  const residentNav = [
    { path: '/app', name: '苗木列表', icon: TreePine },
    { path: '/app/my-adoptions', name: '我的认养', icon: Heart },
    { path: '/app/reminders', name: '消息提醒', icon: Bell },
  ];

  const greenkeeperNav = [
    { path: '/app', name: '苗木列表', icon: TreePine },
    { path: '/app/maintenance', name: '养护记录', icon: Droplets },
    { path: '/app/reminders', name: '消息提醒', icon: Bell },
  ];

  const committeeNav = [
    { path: '/app', name: '苗木列表', icon: TreePine },
    { path: '/app/statistics', name: '数据统计', icon: BarChart3 },
    { path: '/app/reminders', name: '消息提醒', icon: Bell },
  ];

  const navItems = role === 'resident' ? residentNav : role === 'greenkeeper' ? greenkeeperNav : committeeNav;

  const handleLogout = () => {
    navigate('/');
  };

  const unread = getUnreadReminders();

  return (
    <div className='flex h-screen bg-gray-50'>
      <aside className='w-64 bg-white shadow-lg flex flex-col'>
        <div className='p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600'>
          <div className='flex items-center gap-3'>
            <TreePine className='w-8 h-8 text-white' />
            <h1 className='text-xl font-bold text-white'>苗木认养</h1>
          </div>
        </div>
        <nav className='flex-1 p-4 space-y-1'>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const hasBadge = item.name === '消息提醒' && unread > 0;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors " + (isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50')}
              >
                <Icon className='w-5 h-5' />
                <span className='flex-1 text-left'>{item.name}</span>
                {hasBadge && <span className='bg-red-500 text-white text-xs px-2 py-0.5 rounded-full'>{unread}</span>}
              </button>
            );
          })}
        </nav>
        <div className='p-4 border-t'>
          <button onClick={handleLogout} className='w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors'>
            <LogOut className='w-5 h-5' />
            <span>切换身份</span>
          </button>
        </div>
      </aside>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='bg-white shadow-sm px-6 py-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-800'>{roleName[role]}端</h2>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-medium'>{currentUser.avatar}</div>
              <span className='text-gray-700'>{currentUser.name}</span>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}