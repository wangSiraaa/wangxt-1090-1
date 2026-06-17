import { useApp } from '../context/AppContext';
import { Bell, Clock, AlertTriangle, CheckCircle, Leaf, X } from 'lucide-react';
const typeConfig = { maintenance_reminder: { label: '养护提醒', icon: Leaf, color: 'text-amber-600 bg-amber-50 border-amber-200' }, warning: { label: '警告', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' }, info: { label: '通知', icon: Bell, color: 'text-blue-600 bg-blue-50 border-blue-200' } };

export default function Reminders() {
  const { remindersData, markReminderRead, treesData } = useApp();
  const sorted = [...remindersData].sort((a,b) => new Date(b.date) - new Date(a.date));
  const getTreeName = (treeId) => treeId ? treesData.find(t => t.id === treeId)?.name : '';
  const unreadCount = remindersData.filter(r => !r.read).length;
  const readCount = remindersData.filter(r => r.read).length;
  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>消息提醒</h1>
          <p className='text-gray-500'>共 {remindersData.length} 条消息，{unreadCount} 条未读</p>
        </div>
      </div>
      <div className='flex gap-4 mb-6'>
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3'>
          <Bell className='w-8 h-8 text-amber-500' />
          <div>
            <p className='text-2xl font-bold text-amber-700'>{unreadCount}</p>
            <p className='text-sm text-amber-600'>未读消息</p>
          </div>
        </div>
        <div className='bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3'>
          <CheckCircle className='w-8 h-8 text-green-500' />
          <div>
            <p className='text-2xl font-bold text-green-700'>{readCount}</p>
            <p className='text-sm text-green-600'>已读消息</p>
          </div>
        </div>
      </div>
      {sorted.length === 0 ? (
        <div className='text-center py-16'>
          <Bell className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-400 text-lg'>暂无消息提醒</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {sorted.map(reminder => {
            const config = typeConfig[reminder.type] || typeConfig.info;
            const Icon = config.icon;
            return (
              <div key={reminder.id} className={'bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ' + (reminder.read ? 'border-gray-300 opacity-70' : 'border-amber-500')}>
                <div className='p-5'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 {config.color}'>
                      <Icon className='w-6 h-6' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h3 className='font-semibold text-gray-800'>{reminder.title}</h3>
                        {!reminder.read && (
                          <span className='w-2 h-2 bg-red-500 rounded-full flex-shrink-0'></span>
                        )}
                      </div>
                      {reminder.treeId && (
                        <p className='text-sm text-green-600 mb-2'>苗木：{getTreeName(reminder.treeId)}</p>
                      )}
                      <p className='text-gray-600 mb-2'>{reminder.content}</p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1 text-sm text-gray-400'>
                          <Clock className='w-4 h-4' />
                          {reminder.date}
                        </div>
                        {!reminder.read && (
                          <button onClick={() => markReminderRead(reminder.id)} className='text-sm text-green-600 hover:text-green-700 flex items-center gap-1'>
                            <CheckCircle className='w-4 h-4' />
                            标为已读
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}