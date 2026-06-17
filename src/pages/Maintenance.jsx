import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Leaf, Scissors, Calendar, User, Plus, Check } from 'lucide-react';

const typeMap = { watering: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' }, fertilizing: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' }, pruning: { label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' } };

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
    if (success) { setMessage('添加成功！'); setShowAddModal(false); setSelectedTree(''); setMaintNote(''); } else { setMessage('添加失败，该苗木认养期可能已结束'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const getTreeName = (treeId) => treesData.find(t => t.id === treeId)?.name || '未知';

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>养护记录</h1>
        {role === 'greenkeeper' && (
          <button onClick={() => setShowAddModal(true)} className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
            <Plus className='w-4 h-4' />
            记录养护
          </button>
        )}
      </div>
      <div className='flex gap-2 mb-4'>
        {['all', 'watering', 'fertilizing', 'pruning'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={'px-3 py-1.5 rounded-lg text-sm transition-colors ' + (filterType === type ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}
          >
            {type === 'all' ? '全部' : typeMap[type].label}
          </button>
        ))}
      </div>
      <div className='space-y-3'>
        {sorted.map(m => {
          const typeInfo = typeMap[m.type];
          const Icon = typeInfo.icon;
          return (
            <div key={m.id} className='bg-white rounded-xl shadow-sm p-4 flex items-center gap-4'>
              <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + typeInfo.color}>
                <Icon className='w-5 h-5' />
              </div>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-800'>{typeInfo.label}</span>
                  <span className='text-sm text-gray-500'>· {getTreeName(m.treeId)}</span>
                </div>
                <p className='text-sm text-gray-600 mt-1'>{m.note}</p>
                <div className='flex items-center gap-4 mt-2 text-xs text-gray-400'>
                  <span className='flex items-center gap-1'><Calendar className='w-3 h-3' />{m.date}</span>
                  <span className='flex items-center gap-1'><User className='w-3 h-3' />{m.operatorName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showAddModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>记录养护</h2>
            {message && <p className='mb-3 text-sm text-green-600'>{message}</p>}
            <div className='mb-4'>
              <label className='block text-sm text-gray-600 mb-1'>选择苗木</label>
              <select value={selectedTree} onChange={e => setSelectedTree(e.target.value)} className='w-full px-3 py-2 border rounded-lg'>
                <option value=''>请选择</option>
                {healthyTrees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className='mb-4'>
              <label className='block text-sm text-gray-600 mb-1'>养护类型</label>
              <div className='flex gap-2'>
                {Object.entries(typeMap).map(([key, val]) => (
                  <button key={key} onClick={() => setMaintType(key)} className={'flex-1 py-2 rounded-lg text-sm ' + (maintType === key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='mb-4'>
              <label className='block text-sm text-gray-600 mb-1'>备注</label>
              <textarea value={maintNote} onChange={e => setMaintNote(e.target.value)} className='w-full px-3 py-2 border rounded-lg h-24' placeholder='请输入养护备注...'></textarea>
            </div>
            <div className='flex gap-2'>
              <button onClick={() => setShowAddModal(false)} className='flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50'>取消</button>
              <button onClick={handleAdd} className='flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
