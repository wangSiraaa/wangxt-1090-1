import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell, Clock, AlertTriangle, CheckCircle, Leaf, X,
  Users, MapPin, FileText, History, Droplets
} from 'lucide-react';

const typeConfig = {
  maintenance_reminder: {
    label: '养护提醒',
    icon: Leaf,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  maintenance_overdue: {
    label: '养护逾期',
    icon: Clock,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  wither_warning: {
    label: '枯萎预警',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  warning: {
    label: '警告',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  info: {
    label: '通知',
    icon: Bell,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
};

const getMaintTypeInfo = (type) => {
  const map = {
    water: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    watering: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    fertilize: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
    fertilizing: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
    prune: { label: '修剪', icon: Leaf, color: 'text-amber-500 bg-amber-50' },
    pruning: { label: '修剪', icon: Leaf, color: 'text-amber-500 bg-amber-50' },
  };
  return map[type] || { label: type, icon: Droplets, color: 'text-gray-500 bg-gray-50' };
};

export default function Reminders() {
  const navigate = useNavigate();
  const { remindersData, markReminderRead, treesData, role } = useApp();
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const sorted = [...remindersData].sort((a, b) => {
    const dateA = new Date(a.createdDate || a.date);
    const dateB = new Date(b.createdDate || b.date);
    return dateB - dateA;
  });

  const filtered = filterType === 'all' ? sorted : sorted.filter(r => r.type === filterType);
  const getTreeName = (treeId) => (treeId ? treesData.find((t) => t.id === treeId)?.name : '');
  const unreadCount = remindersData.filter((r) => r.status === 'unread').length;
  const readCount = remindersData.filter((r) => r.status === 'read').length;
  const witherCount = remindersData.filter((r) => r.type === 'wither_warning').length;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">消息提醒</h1>
          <p className="text-gray-500">
            共 {remindersData.length} 条消息，{unreadCount} 条未读
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Bell className="w-8 h-8 text-amber-500" />
          <div>
            <p className="text-2xl font-bold text-amber-700">{unreadCount}</p>
            <p className="text-sm text-amber-600">未读消息</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-700">{readCount}</p>
            <p className="text-sm text-green-600">已读消息</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-700">{witherCount}</p>
            <p className="text-sm text-red-600">枯萎预警</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: '全部' },
          { key: 'wither_warning', label: '枯萎预警' },
          { key: 'maintenance_overdue', label: '养护逾期' },
          { key: 'maintenance_reminder', label: '养护提醒' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={
              'px-4 py-2 rounded-lg text-sm transition-colors ' +
              (filterType === f.key
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">暂无消息提醒</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reminder) => {
            const config = typeConfig[reminder.type] || typeConfig.info;
            const Icon = config.icon;
            const isRead = reminder.status === 'read';
            const isExpanded = expandedId === reminder.id;
            const isWither = reminder.type === 'wither_warning';

            return (
              <div
                key={reminder.id}
                className={
                  'bg-white rounded-xl shadow-sm overflow-hidden border-l-4 transition-all ' +
                  (isRead ? 'border-gray-300 opacity-75' : isWither ? 'border-red-500' : 'border-amber-500')
                }
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ' +
                        config.color
                      }
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">
                            {reminder.title || reminder.treeName || config.label}
                          </h3>
                          <span
                            className={
                              'px-2 py-0.5 rounded text-xs ' +
                              (isWither
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600')
                            }
                          >
                            {config.label}
                          </span>
                          {!isRead && (
                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {reminder.treeId && (
                            <button
                              onClick={() => navigate('/app/tree/' + reminder.treeId)}
                              className="text-xs text-green-600 hover:text-green-700"
                            >
                              查看苗木 →
                            </button>
                          )}
                          {!isRead && (
                            <button
                              onClick={() => markReminderRead(reminder.id)}
                              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              标为已读
                            </button>
                          )}
                        </div>
                      </div>
                      {reminder.treeId && (
                        <p className="text-sm text-green-600 mb-2">
                          苗木：{getTreeName(reminder.treeId)}
                        </p>
                      )}
                      <p className="text-gray-600 mb-2">
                        {reminder.content || reminder.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {reminder.date || reminder.createdDate}
                        </div>
                        {isWither && reminder.witherDetails && (
                          <button
                            onClick={() => toggleExpand(reminder.id)}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <History className="w-4 h-4" />
                            {isExpanded ? '收起追溯' : '展开追溯详情'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && isWither && reminder.witherDetails && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 space-y-4">
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          最近两周养护人
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {reminder.witherDetails.recentMaintainers?.length > 0 ? (
                            reminder.witherDetails.recentMaintainers.map((name, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                              >
                                {name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">无记录</span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          责任片区
                        </p>
                        <p className="text-gray-700">
                          {reminder.witherDetails.responsibleArea || '未指定'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        建议补救措施
                      </p>
                      <p className="text-gray-700">{reminder.witherDetails.remediation}</p>
                    </div>

                    {reminder.witherDetails.lastTwoWeeksRecords &&
                      reminder.witherDetails.lastTwoWeeksRecords.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                            <History className="w-4 h-4" />
                            最近两周养护记录
                          </p>
                          <div className="space-y-2">
                            {reminder.witherDetails.lastTwoWeeksRecords.map((record, idx) => {
                              const typeInfo = getMaintTypeInfo(record.type);
                              const RecIcon = typeInfo.icon;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div
                                    className={
                                      'w-8 h-8 rounded-full flex items-center justify-center ' +
                                      typeInfo.color
                                    }
                                  >
                                    <RecIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-gray-700 text-sm">
                                        {typeInfo.label} · {record.operator}
                                      </span>
                                      <span className="text-xs text-gray-400">{record.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5">{record.note}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {reminder.daysOverdue && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <span className="text-red-700 font-medium">
                          已逾期 {reminder.daysOverdue} 天未处理
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
