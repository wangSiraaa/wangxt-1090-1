import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, Calendar, Heart, Droplets, Leaf, Scissors, AlertTriangle, Check } from 'lucide-react';

const maintenanceTypes = [
  { key: 'watering', label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
  { key: 'fertilizing', label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
  { key: 'pruning', label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' },
];

export default function TreeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { treesData, role, adoptTree, getActiveAdoptionForTree, getMaintenancesForTree, addMaintenance, currentUser } = useApp();
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintType, setMaintType] = useState('watering');
  const [maintNote, setMaintNote] = useState('');
  const [message, setMessage] = useState('');

  const tree = treesData.find(t => t.id === id);
  const adoption = getActiveAdoptionForTree(id);
  const maintenances = getMaintenancesForTree(id);
  if (!tree) return <div className='text-center py-12'>未找到该苗木</div>;
  const handleAdopt = () => {
    const success = adoptTree(id);
    if (success) { setMessage('认养成功！'); setShowAdoptModal(false); } else { setMessage('认养失败，请稍后重试'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddMaintenance = () => {
    if (!maintNote.trim()) return;
    const success = addMaintenance(id, maintType, maintNote);
    if (success) { setMessage('养护记录添加成功！'); setShowMaintModal(false); setMaintNote(''); } else { setMessage('认养期已结束，无法添加养护记录'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const canAdopt = role === 'resident' && tree.status === 'healthy' && !adoption;
  const canMaintain = role === 'greenkeeper' && tree.status === 'healthy';
  const isAdoptionExpired = adoption && new Date(adoption.endDate) < new Date();
  return (
    <div>
      {message && (
        <div className='fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse'>
          <Check className='w-5 h-5' />
          {message}
        </div>
      )}
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors'>
        <ArrowLeft className='w-5 h-5' />
        返回列表
      </button>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='relative h-64 bg-gray-100'>
              <img src={tree.image} alt={tree.name} className='w-full h-full object-cover' />
              <div className='absolute top-4 right-4'>
                <span className={"px-3 py-1 rounded-full text-sm font-medium " + (tree.status === 'healthy' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white')}>{tree.status === 'healthy' ? '健康' : '枯萎' }</span>
              </div>
            </div>
            <div className='p-6'>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>{tree.name}</h1>
              <p className='text-green-600 font-medium mb-4'>{tree.species}</p>
              <p className='text-gray-600 mb-6'>{tree.description}</p>
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='w-10 h-10 mx-auto mb-2 rounded-full bg-green-50 flex items-center justify-center'>
                    <MapPin className='w-5 h-5 text-green-600' />
                  </div>
                  <p className='text-xs text-gray-500'>位置</p>
                  <p className='text-sm font-medium text-gray-800'>{tree.location}</p>
                </div>
                <div className='text-center'>
                  <div className='w-10 h-10 mx-auto mb-2 rounded-full bg-blue-50 flex items-center justify-center'>
                    <Calendar className='w-5 h-5 text-blue-600' />
                  </div>
                  <p className='text-xs text-gray-500'>树龄</p>
                  <p className='text-sm font-medium text-gray-800'>{tree.age} 年</p>
                </div>
                <div className='text-center'>
                  <div className='w-10 h-10 mx-auto mb-2 rounded-full bg-amber-50 flex items-center justify-center'>
                    <Calendar className='w-5 h-5 text-amber-600' />
                  </div>
                  <p className='text-xs text-gray-500'>栽种日期</p>
                  <p className='text-sm font-medium text-gray-800'>{tree.plantedDate}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-800'>养护记录</h2>
              {canMaintain && (
                <button onClick={() => setShowMaintModal(true)} className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                  添加养护
                </button>
              )}
            </div>
            {maintenances.length === 0 ? (
              <p className='text-gray-400 text-center py-8'>暂无养护记录</p>
            ) : (
              <div className='space-y-3'>
                {maintenances.slice(0,5).map(m => {
                  const type = maintenanceTypes.find(t => t.key === m.type);
                  const Icon = type?.icon || Droplets;
                  return (
                    <div key={m.id} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                      <div className={'w-10 h-10 rounded-full flex items-center justify-center ' + type?.color}>
                        <Icon className='w-5 h-5' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium text-gray-800'>{type?.label} - {m.greenkeeperName}</p>
                          <p className='text-sm text-gray-400'>{m.date}</p>
                        </div>
                        <p className='text-sm text-gray-600 mt-1'>{m.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className='space-y-6'>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>认养信息</h2>
            {adoption ? (
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>认养人</span>
                  <span className='font-medium text-gray-800'>{adoption.residentName}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>开始日期</span>
                  <span className='font-medium text-gray-800'>{adoption.startDate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>结束日期</span>
                  <span className={'font-medium ' + (isAdoptionExpired ? 'text-red-500' : 'text-gray-800')}>{adoption.endDate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>状态</span>
                  <span className={'font-medium px-2 py-0.5 rounded text-sm ' + (isAdoptionExpired ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600')}>{isAdoptionExpired ? '已到期' : '有效' }</span>
                </div>
              </div>
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-400 mb-3'>暂无人认养</p>
                {canAdopt && (
                  <button onClick={() => setShowAdoptModal(true)} className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto'>
                    <Heart className='w-4 h-4' />
                    立即认养
                  </button>
                )}
              </div>
            )}
            {tree.status === 'withered' && (
              <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-amber-500' />
                <span className='text-sm text-amber-700'>该苗木已枯萎，无法认养</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAdoptModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-96 shadow-xl'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>确认认养</h3>
            <p className='text-gray-600 mb-6'>您确定要认养 {tree.name} 吗？认养期为90天。</p>
            <div className='flex gap-3 justify-end'>
              <button onClick={() => setShowAdoptModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>取消</button>
              <button onClick={handleAdopt} className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>确认认养</button>
            </div>
          </div>
        </div>
      )}
      {showMaintModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-96 shadow-xl'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>添加养护记录</h3>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>养护类型</label>
              <div className='flex gap-2'>
                {maintenanceTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.key}
                      onClick={() => setMaintType(type.key)}
                      className={'flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ' + (maintType === type.key ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}
                    >
                      <Icon className='w-6 h-6 text-gray-600' />
                      <span className='text-sm'>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>备注说明</label>
              <textarea
                value={maintNote}
                onChange={(e) => setMaintNote(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                rows='3'
                placeholder='请输入养护备注...'
              ></textarea>
            </div>
            {isAdoptionExpired && (
              <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <p className='text-sm text-amber-700'>注意：认养期已结束，无法添加养护记录。</p>
              </div>
            )}
            <div className='flex gap-3 justify-end'>
              <button onClick={() => setShowMaintModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>取消</button>
              <button
                onClick={handleAddMaintenance}
                disabled={isAdoptionExpired || !maintNote.trim()}
                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
              >确认添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}