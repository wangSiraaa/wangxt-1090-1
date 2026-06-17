import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart, Calendar, MapPin, XCircle, Shield, Droplets, Leaf, Scissors,
  RefreshCw, Clock, CheckCircle, AlertTriangle, Users, ChevronDown,
  ChevronUp, Sprout, TreeDeciduous, FileText, TrendingUp, X
} from 'lucide-react';

const getMaintTypeInfo = (type) => {
  const map = {
    water: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    watering: { label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    fertilize: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
    fertilizing: { label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
    prune: { label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' },
    pruning: { label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' },
  };
  return map[type] || { label: type, icon: Droplets, color: 'text-gray-500 bg-gray-50' };
};

export default function MyAdoptions() {
  const navigate = useNavigate();
  const {
    getMyAdoptions, treesData, cancelAdoption, role, createTransfer,
    getSpeciesInfo, getTransfersForAdoption, returnTransfer, currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState('active');
  const [expandedId, setExpandedId] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAdoptionId, setTransferAdoptionId] = useState(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferStart, setTransferStart] = useState('');
  const [transferEnd, setTransferEnd] = useState('');
  const [message, setMessage] = useState('');

  const myAdoptions = getMyAdoptions();
  const getTree = (treeId) => treesData.find(t => t.id === treeId);

  const activeAdoptions = myAdoptions.filter(a => a.status === 'active' && new Date(a.endDate) >= new Date());
  const expiredAdoptions = myAdoptions.filter(a => a.status === 'expired' || (a.status === 'active' && new Date(a.endDate) < new Date()));
  const displayed = activeTab === 'active' ? activeAdoptions : expiredAdoptions;

  const handleCancel = (adoptionId) => {
    if (confirm('确定要取消认养吗？')) { cancelAdoption(adoptionId); }
  };

  const handleTransfer = () => {
    if (!transferTo.trim() || !transferReason.trim() || !transferStart || !transferEnd) return;
    const residents = [
      { id: 'r2', name: '李阿姨' },
      { id: 'r3', name: '王小明' },
      { id: 'r4', name: '赵奶奶' },
    ].filter(r => r.id !== currentUser.id);
    const target = residents.find(r => r.name === transferTo.trim());
    if (!target) { setMessage('未找到该居民'); setTimeout(() => setMessage(''), 3000); return; }
    const success = createTransfer(transferAdoptionId, target.id, target.name, transferStart, transferEnd, transferReason);
    if (success) {
      setMessage('临时转养已创建！');
      setShowTransferModal(false);
      setTransferTo(''); setTransferReason(''); setTransferStart(''); setTransferEnd('');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {message && (
        <div className='fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2'>
          <CheckCircle className='w-5 h-5' />
          {message}
        </div>
      )}

      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>我的认养</h1>
        <p className='text-gray-500'>共 {myAdoptions.length} 条认养记录</p>
      </div>

      <div className='flex gap-2 mb-6'>
        <button
          onClick={() => setActiveTab('active')}
          className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
            (activeTab === 'active' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border')}
        >
          进行中（{activeAdoptions.length}）
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
            (activeTab === 'expired' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border')}
        >
          已归档（{expiredAdoptions.length}）
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className='text-center py-16'>
          <Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-400 text-lg mb-2'>
            {activeTab === 'active' ? '暂无进行中的认养' : '暂无已归档的认养记录'}
          </p>
          {activeTab === 'active' && (
            <button onClick={() => navigate('/app')} className='text-green-600 hover:text-green-700 font-medium'>
              去苗木列表看看
            </button>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          {displayed.map(adoption => {
            const tree = getTree(adoption.treeId);
            if (!tree) return null;
            const speciesInfo = getSpeciesInfo(tree.species);
            const isExpired = new Date(adoption.endDate) < new Date();
            const isReadOnly = adoption.isReadOnly || isExpired;
            const isExpanded = expandedId === adoption.id;
            const transfers = getTransfersForAdoption(adoption.id);

            return (
              <div key={adoption.id} className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-5'>
                  <div className='flex items-start gap-4'>
                    <div className='w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer' onClick={() => navigate('/app/tree/' + tree.id)}>
                      <img src={tree.image} alt={tree.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <h3
                            className='font-semibold text-gray-800 text-lg cursor-pointer hover:text-green-600'
                            onClick={() => navigate('/app/tree/' + tree.id)}
                          >
                            {tree.name}
                          </h3>
                          <span className={'px-2 py-0.5 rounded text-xs font-medium ' +
                            (isReadOnly ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600')}>
                            {isReadOnly ? '已归档' : '有效'}
                          </span>
                          {isReadOnly && <Shield className='w-4 h-4 text-gray-400' />}
                        </div>
                        {!isReadOnly && role === 'resident' && (
                          <button
                            onClick={() => handleCancel(adoption.id)}
                            className='text-red-500 hover:text-red-600 text-sm flex items-center gap-1'
                          >
                            <XCircle className='w-4 h-4' />
                            取消
                          </button>
                        )}
                      </div>

                      <div className='flex items-center gap-3 text-sm text-gray-500 mb-2'>
                        <span className='text-green-600 font-medium'>{tree.species}</span>
                        <span className='flex items-center gap-1'><MapPin className='w-3 h-3' />{tree.location}</span>
                      </div>

                      <div className='flex items-center gap-4 text-sm'>
                        <span className='flex items-center gap-1 text-gray-500'>
                          <Calendar className='w-3 h-3' />
                          {adoption.startDate} ~ {adoption.endDate}
                        </span>
                        {adoption.survivalRate && (
                          <span className='flex items-center gap-1 text-green-600 font-medium'>
                            <TrendingUp className='w-3 h-3' />
                            成活率 {adoption.survivalRate}
                          </span>
                        )}
                      </div>

                      {adoption.abnormalReason && (
                        <div className='mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2'>
                          <AlertTriangle className='w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5' />
                          <span className='text-sm text-amber-700'>{adoption.abnormalReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      {!isReadOnly && (
                        <button
                          onClick={() => {
                            setTransferAdoptionId(adoption.id);
                            setShowTransferModal(true);
                          }}
                          className='text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1'
                        >
                          <RefreshCw className='w-3 h-3' />
                          临时转养
                        </button>
                      )}
                      {isReadOnly && (
                        <span className='text-xs text-gray-400 flex items-center gap-1'>
                          <Shield className='w-3 h-3' />
                          认养期已结束，记录只读可追溯
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : adoption.id)}
                      className='text-sm text-green-600 hover:text-green-700 flex items-center gap-1'
                    >
                      {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
                      {isExpanded ? '收起详情' : '展开养护轨迹'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className='border-t bg-gray-50 p-5 space-y-4'>
                    {speciesInfo && (
                      <div>
                        <p className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                          <Sprout className='w-4 h-4 text-green-600' />
                          品种与季节养护
                        </p>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                          {Object.entries(speciesInfo.seasonCare || {}).map(([season, care]) => (
                            <div key={season} className='p-2 bg-white rounded-lg border text-xs'>
                              <p className='font-medium text-amber-700 mb-1'>
                                {season === 'spring' ? '春季' : season === 'summer' ? '夏季' : season === 'autumn' ? '秋季' : '冬季'}
                              </p>
                              <p className='text-gray-600'>{care}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {adoption.transferHistory && adoption.transferHistory.length > 0 && (
                      <div>
                        <p className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                          <RefreshCw className='w-4 h-4 text-blue-600' />
                          临时转养记录
                        </p>
                        <div className='space-y-2'>
                          {adoption.transferHistory.map((th, idx) => (
                            <div key={idx} className='p-3 bg-white rounded-lg border'>
                              <div className='flex items-center gap-2 mb-1'>
                                <span className='text-sm font-medium text-blue-700'>{th.fromResident} → {th.toResident}</span>
                              </div>
                              <p className='text-xs text-gray-500'>{th.startDate} ~ {th.endDate}</p>
                              <p className='text-xs text-gray-600 mt-1'>原因：{th.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-amber-600' />
                        养护轨迹（{adoption.careTrack?.length || 0} 条记录）
                      </p>
                      {adoption.careTrack && adoption.careTrack.length > 0 ? (
                        <div className='relative'>
                          <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-green-200' />
                          <div className='space-y-2'>
                            {adoption.careTrack.map((record, idx) => {
                              const typeInfo = getMaintTypeInfo(record.type);
                              const Icon = typeInfo.icon;
                              return (
                                <div key={idx} className='flex items-start gap-3 ml-0'>
                                  <div className={'w-8 h-8 rounded-full flex items-center justify-center z-10 ' + typeInfo.color}>
                                    <Icon className='w-4 h-4' />
                                  </div>
                                  <div className='flex-1 bg-white p-3 rounded-lg border'>
                                    <div className='flex items-center justify-between'>
                                      <span className='font-medium text-gray-700 text-sm'>
                                        {typeInfo.label} · {record.operator}
                                      </span>
                                      <span className='text-xs text-gray-400'>{record.date}</span>
                                    </div>
                                    <p className='text-sm text-gray-600 mt-0.5'>{record.note}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className='text-gray-400 text-sm text-center py-4'>暂无养护轨迹</p>
                      )}
                    </div>

                    {isReadOnly && (
                      <div className='p-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-2'>
                        <Shield className='w-4 h-4 text-gray-500' />
                        <span className='text-sm text-gray-600'>
                          认养期已结束，以上数据为只读归档。成活率：{adoption.survivalRate || '未记录'}
                          {adoption.abnormalReason && `，异常原因：${adoption.abnormalReason}`}
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

      {showTransferModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>临时转养</h3>
              <button onClick={() => setShowTransferModal(false)} className='text-gray-400 hover:text-gray-600'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              将您的认养临时转交给其他居民照料，转养期间由对方负责日常关注，养护记录仍会归入您的认养轨迹。
            </p>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>转养给（居民姓名）</label>
                <input
                  type='text'
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className='w-full px-3 py-2 border rounded-lg text-sm'
                  placeholder='例如：李阿姨'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>转养原因</label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className='w-full px-3 py-2 border rounded-lg text-sm h-20'
                  placeholder='例如：外出探亲两周'
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>开始日期</label>
                  <input
                    type='date'
                    value={transferStart}
                    onChange={(e) => setTransferStart(e.target.value)}
                    className='w-full px-3 py-2 border rounded-lg text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>结束日期</label>
                  <input
                    type='date'
                    value={transferEnd}
                    onChange={(e) => setTransferEnd(e.target.value)}
                    className='w-full px-3 py-2 border rounded-lg text-sm'
                  />
                </div>
              </div>
            </div>
            <div className='flex gap-3 justify-end mt-5'>
              <button
                onClick={() => setShowTransferModal(false)}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
              >
                取消
              </button>
              <button
                onClick={handleTransfer}
                disabled={!transferTo.trim() || !transferReason.trim() || !transferStart || !transferEnd}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                确认转养
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
