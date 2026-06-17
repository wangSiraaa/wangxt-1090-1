const fs = require('fs');
const path = require('path');

function genStatistics() {
  return `import { useApp } from '../context/AppContext';
import { TrendingUp, Heart, Droplets, Users, TreeDeciduous, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Statistics() {
  const { treesData, adoptionsData, maintenancesData, remindersData, usersData } = useApp();

  const totalTrees = treesData.length;
  const healthyTrees = treesData.filter(t => t.status === 'healthy').length;
  const wiltedTrees = treesData.filter(t => t.status === 'wilted').length;
  const survivalRate = totalTrees > 0 ? ((healthyTrees / totalTrees) * 100).toFixed(1) : 0;
  const adoptedCount = adoptionsData.filter(a => a.status === 'active').length;
  const totalMaintenances = maintenancesData.length;
  const unreadReminders = remindersData.filter(r => !r.read).length;
  const residentCount = usersData.filter(u => u.role === 'resident').length;
  const greenkeeperCount = usersData.filter(u => u.role === 'greenkeeper').length;

  const statCards = [
    { title: '苗木总数', value: totalTrees, icon: TreeDeciduous, color: 'bg-green-500', bg: 'bg-green-50' },
    { title: '健康苗木', value: healthyTrees, icon: CheckCircle, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { title: '枯萎苗木', value: wiltedTrees, icon: AlertTriangle, color: 'bg-amber-500', bg: 'bg-amber-50' },
    { title: '成活率', value: survivalRate + '%', icon: TrendingUp, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { title: '有效认养', value: adoptedCount, icon: Heart, color: 'bg-pink-500', bg: 'bg-pink-50' },
    { title: '养护次数', value: totalMaintenances, icon: Droplets, color: 'bg-cyan-500', bg: 'bg-cyan-50' },
    { title: '居民数', value: residentCount, icon: Users, color: 'bg-purple-500', bg: 'bg-purple-50' },
    { title: '未读提醒', value: unreadReminders, icon: Clock, color: 'bg-red-500', bg: 'bg-red-50' },
  ];

  const recentMaintenances = [...maintenancesData].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const getTreeName = (treeId) => treesData.find(t => t.id === treeId)?.name || '未知';
  const typeLabels = { watering: '浇水', fertilizing: '施肥', pruning: '修剪' };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">数据统计</h1>
        <p className="text-gray-500">社区苗木认养整体情况一览</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center text-white " + card.color}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">苗木状态分布</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">健康苗木</span>
                <span className="text-emerald-600 font-medium">{healthyTrees} 棵 ( {survivalRate}% )</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: survivalRate + '%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">枯萎苗木</span>
                <span className="text-amber-600 font-medium">{wiltedTrees} 棵 ( {totalTrees > 0 ? ((wiltedTrees / totalTrees) * 100).toFixed(1) : 0}% )</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-amber-500 h-3 rounded-full transition-all" style={{ width: totalTrees > 0 ? ((wiltedTrees / totalTrees) * 100) + '%' : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">最近养护记录</h2>
          <div className="space-y-3">
            {recentMaintenances.length === 0 ? (
              <p className="text-gray-400 text-center py-4">暂无养护记录</p>
            ) : (
              recentMaintenances.map(m => (
                <div key={m.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className={"w-2 h-2 rounded-full " + (m.type === 'watering' ? 'bg-blue-500' : m.type === 'fertilizing' ? 'bg-green-500' : 'bg-amber-500')}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{getTreeName(m.treeId)} - {typeLabels[m.type]}</p>
                    <p className="text-xs text-gray-400">{m.date} · {m.greenkeeperName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

function genMaintenance() {
  return `import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Leaf, Scissors, Calendar, User, Plus, Check } from 'lucide-react';

const typeMap = { 
  watering: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' }, 
  fertilizing: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' }, 
  pruning: { label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' } 
};

export default function Maintenance() {
  const navigate = useNavigate();
  const { maintenancesData, treesData, role, addMaintenance, currentUser } = useApp();
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTree, setSelectedTree] = useState('');
  const [maintType, setMaintType] = useState('watering');
  const [maintNote, setMaintNote] = useState('');
  const [message, setMessage] = useState('');

  const healthyTrees = treesData.filter(t => t.status === 'healthy');
  const filtered = filterType === 'all' ? maintenancesData : maintenancesData.filter(m => m.type === filterType);
  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));

  const handleAdd = () => {
    if (!selectedTree || !maintNote.trim()) return;
    const success = addMaintenance(selectedTree, maintType, maintNote);
    if (success) {
      setMessage('添加成功！');
      setShowAddModal(false);
      setSelectedTree('');
      setMaintNote('');
    } else {
      setMessage('添加失败，该苗木认养期可能已结束');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const getTreeName = (treeId) => treesData.find(t => t.id === treeId)?.name || '未知';

  return (
    <div>
      {message && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {message}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">养护记录</h1>
        {role === 'greenkeeper' && (
          <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加记录
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2">
        <button onClick={() => setFilterType('all')} className={"px-4 py-2 rounded-lg transition-colors " + (filterType === 'all' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100')}>全部</button>
        {Object.entries(typeMap).map(([key, val]) => (
          <button key={key} onClick={() => setFilterType(key)} className={"px-4 py-2 rounded-lg transition-colors flex items-center gap-2 " + (filterType === key ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100')}>
            <val.icon className="w-4 h-4" />
            {val.label}
          </button>
        ))}
      </div>
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">暂无养护记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(m => {
            const type = typeMap[m.type] || typeMap.watering;
            const Icon = type.icon;
            return (
              <div key={m.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={"w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 " + type.color}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 cursor-pointer hover:text-green-600" onClick={() => navigate('/app/tree/' + m.treeId)}>{getTreeName(m.treeId)} - {type.label}</h3>
                      <span className="text-sm text-gray-400">{m.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {m.greenkeeperName}
                      </div>
                    </div>
                    <p className="text-gray-600">{m.note}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">添加养护记录</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择苗木</label>
              <select value={selectedTree} onChange={(e) => setSelectedTree(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">请选择苗木</option>
                {healthyTrees.map(t => (
                  <option key={t.id} value={t.id}>{t.name} - {t.location}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">养护类型</label>
              <div className="flex gap-2">
                {Object.entries(typeMap).map(([key, val]) => {
                  const Icon = val.icon;
                  return (
                    <button key={key} onClick={() => setMaintType(key)} className={"flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors " + (maintType === key ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}>
                      <Icon className="w-6 h-6 text-gray-600" />
                      <span className="text-sm">{val.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">备注说明</label>
              <textarea
                value={maintNote}
                onChange={(e) => setMaintNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="请输入养护备注..."
              ></textarea>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
              <button onClick={handleAdd} disabled={!selectedTree || !maintNote.trim()} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">确认添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
}

// 写入文件
fs.writeFileSync(path.join(__dirname, 'src/pages/Statistics.jsx'), genStatistics());
console.log('Statistics.jsx generated');

fs.writeFileSync(path.join(__dirname, 'src/pages/Maintenance.jsx'), genMaintenance());
console.log('Maintenance.jsx generated');

console.log('All files generated successfully!');
