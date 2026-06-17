import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, MapPin, Calendar, Heart, Droplets, Leaf, Scissors,
  AlertTriangle, Check, Info, Sprout, Sun, Thermometer, Users,
  FileText, History, Shield, Clock, RefreshCw, TreeDeciduous, X
} from 'lucide-react';

const maintenanceTypes = [
  { key: 'watering', label: '浇水', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
  { key: 'fertilizing', label: '施肥', icon: Leaf, color: 'text-green-500 bg-green-50' },
  { key: 'pruning', label: '修剪', icon: Scissors, color: 'text-amber-500 bg-amber-50' },
];

const getMaintenanceTypeInfo = (type) => {
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

const actionStatusMap = {
  pending: { text: '待评估', color: 'bg-amber-100 text-amber-700' },
  planned: { text: '已计划', color: 'bg-blue-100 text-blue-700' },
  confirmed: { text: '已确认', color: 'bg-green-100 text-green-700' },
  not_needed: { text: '无需处理', color: 'bg-gray-100 text-gray-500' },
  done: { text: '已完成', color: 'bg-emerald-100 text-emerald-700' },
};

export default function TreeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    treesData, role, adoptTree, getActiveAdoptionForTree, getMaintenancesForTree,
    addMaintenance, currentUser, getSpeciesInfo, getLastWateringForTree,
    getSeasonalPlansForTree, getSeasonName, remindersData,
  } = useApp();

  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adoptStep, setAdoptStep] = useState(1);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintType, setMaintType] = useState('watering');
  const [maintNote, setMaintNote] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const tree = treesData.find(t => t.id === id);
  const adoption = getActiveAdoptionForTree(id);
  const maintenances = getMaintenancesForTree(id);
  const speciesInfo = getSpeciesInfo(tree?.species);
  const lastWatering = getLastWateringForTree(id);
  const seasonalPlans = getSeasonalPlansForTree(id);
  const witherReminder = remindersData.find(r => r.treeId === id && r.type === 'wither_warning');

  if (!tree) return <div className='text-center py-12'>未找到该苗木</div>;

  const isAdoptionExpired = adoption && new Date(adoption.endDate) < new Date();
  const isReadOnly = adoption?.isReadOnly;
  const canAdopt = role === 'resident' && tree.status === 'healthy' && !adoption;
  const canMaintain = role === 'greenkeeper' && tree.status === 'healthy' && !isReadOnly;

  const handleAdopt = () => {
    const success = adoptTree(id);
    if (success) {
      setMessage('认养成功！请关注养护计划与季节养护要点。');
      setShowAdoptModal(false);
      setAdoptStep(1);
    } else {
      setMessage('认养失败，请稍后重试');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddMaintenance = () => {
    if (!maintNote.trim()) return;
    const success = addMaintenance(id, maintType, maintNote);
    if (success) {
      setMessage('养护记录添加成功！');
      setShowMaintModal(false);
      setMaintNote('');
    } else {
      setMessage('认养期已结束，无法添加养护记录');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { key: 'info', label: '基础信息', icon: Info },
    { key: 'species', label: '品种与土壤', icon: Sprout },
    { key: 'maintenance', label: '养护记录', icon: Droplets },
    { key: 'seasonal', label: '季节养护', icon: Sun },
    { key: 'track', label: '养护轨迹', icon: History },
    { key: 'warning', label: '预警追溯', icon: AlertTriangle },
  ];

  return (
    <div>
      {message && (
        <div className='fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse'>
          <Check className='w-5 h-5' />
          {message}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors'
      >
        <ArrowLeft className='w-5 h-5' />
        返回列表
      </button>

      {isReadOnly && (
        <div className='mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-3'>
          <Shield className='w-5 h-5 text-gray-500' />
          <span className='text-gray-700'>该认养记录已归档，数据为只读模式，可查看完整养护轨迹。</span>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='relative h-64 bg-gray-100'>
              <img src={tree.image} alt={tree.name} className='w-full h-full object-cover' />
              <div className='absolute top-4 right-4 flex gap-2'>
                <span className={
                  'px-3 py-1 rounded-full text-sm font-medium ' +
                  (tree.status === 'healthy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                }>
                  {tree.status === 'healthy' ? '健康' : '枯萎'}
                </span>
                {witherReminder && (
                  <span className='px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white flex items-center gap-1'>
                    <AlertTriangle className='w-4 h-4' />
                    预警中
                  </span>
                )}
              </div>
            </div>
            <div className='p-6'>
              <div className='flex items-start justify-between mb-2'>
                <div>
                  <h1 className='text-2xl font-bold text-gray-800 mb-1'>{tree.name}</h1>
                  <p className='text-green-600 font-medium'>{tree.species}</p>
                </div>
                {tree.responsibleArea && (
                  <div className='text-right'>
                    <p className='text-xs text-gray-400'>责任片区</p>
                    <p className='text-sm font-medium text-gray-700'>{tree.responsibleArea}</p>
                  </div>
                )}
              </div>
              <p className='text-gray-600 mb-6'>{tree.description}</p>

              <div className='grid grid-cols-4 gap-4'>
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
                    <TreeDeciduous className='w-5 h-5 text-amber-600' />
                  </div>
                  <p className='text-xs text-gray-500'>栽种日期</p>
                  <p className='text-sm font-medium text-gray-800'>{tree.plantedDate}</p>
                </div>
                <div className='text-center'>
                  <div className='w-10 h-10 mx-auto mb-2 rounded-full bg-cyan-50 flex items-center justify-center'>
                    <Droplets className='w-5 h-5 text-cyan-600' />
                  </div>
                  <p className='text-xs text-gray-500'>最近补水</p>
                  <p className='text-sm font-medium text-gray-800'>
                    {lastWatering ? lastWatering.date : tree.lastWateringDate || '暂无记录'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-sm'>
            <div className='border-b px-6 py-3 flex gap-2 overflow-x-auto'>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ' +
                      (activeTab === tab.key ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-500 hover:bg-gray-50')
                    }
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className='p-6'>
              {activeTab === 'info' && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800'>苗木档案</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-500 mb-1'>苗木编号</p>
                      <p className='font-medium text-gray-800'>{tree.id.toUpperCase()}</p>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-500 mb-1'>树种</p>
                      <p className='font-medium text-gray-800'>{tree.species}</p>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-500 mb-1'>土壤适配度</p>
                      <p className='font-medium text-gray-800'>{tree.soilCompatibility || speciesInfo?.soilCompatibility || '良好'}</p>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-500 mb-1'>浇水周期</p>
                      <p className='font-medium text-gray-800'>每 {speciesInfo?.waterCycle || '5-7'} 天一次</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'species' && speciesInfo && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                      <Sprout className='w-5 h-5 text-green-600' />
                      品种特性
                    </h3>
                    <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>适宜土壤</p>
                          <p className='font-medium text-gray-800'>{speciesInfo.soilTypes?.join('、')}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>浇水周期</p>
                          <p className='font-medium text-gray-800'>约 {speciesInfo.waterCycle} 天/次</p>
                        </div>
                      </div>
                      <div className='mt-3 pt-3 border-t border-green-200'>
                        <p className='text-sm text-gray-500 mb-1'>土壤适配说明</p>
                        <p className='text-gray-700'>{speciesInfo.soilCompatibility}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                      <Sun className='w-5 h-5 text-amber-600' />
                      四季养护要点
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      {Object.entries(speciesInfo.seasonCare || {}).map(([season, care]) => (
                        <div key={season} className='p-4 bg-amber-50 rounded-lg border border-amber-200'>
                          <p className='text-sm font-medium text-amber-700 mb-1'>
                            {getSeasonName(season)}
                          </p>
                          <p className='text-gray-700 text-sm'>{care}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                      <Clock className='w-5 h-5 text-blue-600' />
                      最近补水记录
                    </h3>
                    {lastWatering ? (
                      <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-sm text-gray-500'>补水日期</p>
                            <p className='font-medium text-gray-800'>{lastWatering.date}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>操作人</p>
                            <p className='font-medium text-gray-800'>{lastWatering.operatorName || lastWatering.greenkeeperName}</p>
                          </div>
                        </div>
                        {lastWatering.note && (
                          <div className='mt-3 pt-3 border-t border-blue-200'>
                            <p className='text-sm text-gray-500 mb-1'>备注</p>
                            <p className='text-gray-700 text-sm'>{lastWatering.note}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className='text-gray-400 text-center py-4'>暂无补水记录</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-gray-800'>养护记录</h3>
                    {canMaintain && !isReadOnly && (
                      <button
                        onClick={() => setShowMaintModal(true)}
                        className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors'
                      >
                        添加养护
                      </button>
                    )}
                  </div>
                  {maintenances.length === 0 ? (
                    <p className='text-gray-400 text-center py-8'>暂无养护记录</p>
                  ) : (
                    <div className='space-y-3'>
                      {maintenances.map(m => {
                        const typeInfo = getMaintenanceTypeInfo(m.type);
                        const Icon = typeInfo.icon;
                        return (
                          <div key={m.id} className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                            <div className={'w-10 h-10 rounded-full flex items-center justify-center ' + typeInfo.color}>
                              <Icon className='w-5 h-5' />
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <p className='font-medium text-gray-800'>
                                  {typeInfo.label} - {m.operatorName || m.greenkeeperName}
                                </p>
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
              )}

              {activeTab === 'seasonal' && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800'>季节养护计划</h3>
                  {seasonalPlans.length === 0 ? (
                    <p className='text-gray-400 text-center py-8'>暂无季节养护计划</p>
                  ) : (
                    <div className='space-y-4'>
                      {seasonalPlans.map(plan => (
                        <div key={plan.id} className='p-5 bg-gray-50 rounded-lg border border-gray-200'>
                          <div className='flex items-center justify-between mb-3'>
                            <div>
                              <span className='inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full mr-2'>
                                {plan.year}年{getSeasonName(plan.season)}
                              </span>
                              <span className='text-sm text-gray-500'>
                                制定人：{plan.createdName} · {plan.createdDate}
                              </span>
                            </div>
                          </div>
                          <p className='text-gray-700 mb-4'>{plan.plan}</p>
                          <div className='space-y-2'>
                            <p className='text-sm font-medium text-gray-600'>节点判断：</p>
                            {plan.actions.map(action => (
                              <div key={action.id} className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                                <div className='flex items-center gap-3'>
                                  {action.type === 'relocation' && <RefreshCw className='w-4 h-4 text-blue-500' />}
                                  {action.type === 'replanting' && <Sprout className='w-4 h-4 text-green-500' />}
                                  {action.type === 'nursery' && <TreeDeciduous className='w-4 h-4 text-amber-500' />}
                                  <span className='font-medium text-gray-800'>{action.label}</span>
                                  {action.date && <span className='text-sm text-gray-500'>计划日期：{action.date}</span>}
                                </div>
                                <span className={'px-2 py-1 rounded text-xs ' + actionStatusMap[action.status]?.color}>
                                  {actionStatusMap[action.status]?.text || action.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'track' && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800'>养护轨迹追溯</h3>
                  {adoption && adoption.careTrack && adoption.careTrack.length > 0 ? (
                    <>
                      {adoption.survivalRate && (
                        <div className='p-4 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between'>
                          <span className='text-gray-600'>成活率</span>
                          <span className='text-xl font-bold text-green-600'>{adoption.survivalRate}</span>
                        </div>
                      )}
                      {adoption.abnormalReason && (
                        <div className='p-4 bg-amber-50 rounded-lg border border-amber-200'>
                          <p className='text-sm text-amber-600 mb-1'>异常原因</p>
                          <p className='text-gray-700'>{adoption.abnormalReason}</p>
                        </div>
                      )}
                      {adoption.transferHistory && adoption.transferHistory.length > 0 && (
                        <div>
                          <p className='text-sm font-medium text-gray-600 mb-2'>临时转养记录：</p>
                          <div className='space-y-2'>
                            {adoption.transferHistory.map((th, idx) => (
                              <div key={idx} className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                                <div className='flex items-center gap-2 mb-1'>
                                  <RefreshCw className='w-4 h-4 text-blue-500' />
                                  <span className='text-sm font-medium text-gray-700'>
                                    {th.fromResident} → {th.toResident}
                                  </span>
                                </div>
                                <p className='text-xs text-gray-500'>{th.startDate} ~ {th.endDate}</p>
                                <p className='text-sm text-gray-600 mt-1'>原因：{th.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-gray-600'>养护轨迹：</p>
                        {adoption.careTrack.map((record, idx) => {
                          const typeInfo = getMaintenanceTypeInfo(record.type);
                          const Icon = typeInfo.icon;
                          return (
                            <div key={idx} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                              <div className={'w-8 h-8 rounded-full flex items-center justify-center ' + typeInfo.color}>
                                <Icon className='w-4 h-4' />
                              </div>
                              <div className='flex-1'>
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
                    </>
                  ) : (
                    <p className='text-gray-400 text-center py-8'>暂无养护轨迹数据</p>
                  )}
                </div>
              )}

              {activeTab === 'warning' && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800'>枯萎预警与追溯</h3>
                  {witherReminder ? (
                    <div className='space-y-4'>
                      <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <AlertTriangle className='w-6 h-6 text-red-500 flex-shrink-0 mt-0.5' />
                          <div>
                            <p className='font-semibold text-red-700 mb-1'>{witherReminder.message}</p>
                            <p className='text-sm text-red-600'>预警时间：{witherReminder.createdDate} · 已逾期 {witherReminder.daysOverdue} 天</p>
                          </div>
                        </div>
                      </div>

                      {witherReminder.witherDetails && (
                        <>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='p-4 bg-amber-50 border border-amber-200 rounded-lg'>
                              <p className='text-sm font-medium text-amber-700 mb-2 flex items-center gap-2'>
                                <Users className='w-4 h-4' />
                                最近两周养护人
                              </p>
                              <div className='flex flex-wrap gap-2'>
                                {witherReminder.witherDetails.recentMaintainers?.map((name, idx) => (
                                  <span key={idx} className='px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm'>
                                    {name}
                                  </span>
                                )) || <span className='text-gray-500 text-sm'>无记录</span>}
                              </div>
                            </div>
                            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                              <p className='text-sm font-medium text-blue-700 mb-2 flex items-center gap-2'>
                                <MapPin className='w-4 h-4' />
                                责任片区
                              </p>
                              <p className='text-gray-700'>{witherReminder.witherDetails.responsibleArea || tree.responsibleArea || '未指定'}</p>
                            </div>
                          </div>

                          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                            <p className='text-sm font-medium text-green-700 mb-2 flex items-center gap-2'>
                              <FileText className='w-4 h-4' />
                              建议补救措施
                            </p>
                            <p className='text-gray-700'>{witherReminder.witherDetails.remediation}</p>
                          </div>

                          {witherReminder.witherDetails.lastTwoWeeksRecords && witherReminder.witherDetails.lastTwoWeeksRecords.length > 0 && (
                            <div>
                              <p className='text-sm font-medium text-gray-600 mb-2'>最近两周养护记录：</p>
                              <div className='space-y-2'>
                                {witherReminder.witherDetails.lastTwoWeeksRecords.map((record, idx) => {
                                  const typeInfo = getMaintenanceTypeInfo(record.type);
                                  const Icon = typeInfo.icon;
                                  return (
                                    <div key={idx} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                                      <div className={'w-8 h-8 rounded-full flex items-center justify-center ' + typeInfo.color}>
                                        <Icon className='w-4 h-4' />
                                      </div>
                                      <div className='flex-1'>
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
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <Check className='w-12 h-12 text-green-400 mx-auto mb-3' />
                      <p className='text-gray-500'>该苗木暂无枯萎预警，状态良好</p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                  <span className='text-gray-500'>认养日期</span>
                  <span className='font-medium text-gray-800'>{adoption.adoptDate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>开始日期</span>
                  <span className='font-medium text-gray-800'>{adoption.startDate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>结束日期</span>
                  <span className={'font-medium ' + (isAdoptionExpired ? 'text-red-500' : 'text-gray-800')}>
                    {adoption.endDate}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>状态</span>
                  <span className={
                    'font-medium px-2 py-0.5 rounded text-sm ' +
                    (isAdoptionExpired ? 'bg-gray-100 text-gray-500' : adoption.isReadOnly ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600')
                  }>
                    {adoption.isReadOnly ? '已归档（只读）' : isAdoptionExpired ? '已到期' : '有效'}
                  </span>
                </div>
                {adoption.survivalRate && (
                  <div className='flex justify-between pt-2 border-t'>
                    <span className='text-gray-500'>成活率</span>
                    <span className='font-medium text-green-600'>{adoption.survivalRate}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-400 mb-3'>暂无人认养</p>
                {canAdopt && (
                  <button
                    onClick={() => setShowAdoptModal(true)}
                    className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto'
                  >
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
            {isReadOnly && (
              <div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2'>
                <Shield className='w-5 h-5 text-gray-500' />
                <span className='text-sm text-gray-600'>认养期已结束，记录只读可追溯</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdoptModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 w-full max-w-lg shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                {adoptStep === 1 ? '认养前须知' : '确认认养'}
              </h3>
              <button
                onClick={() => { setShowAdoptModal(false); setAdoptStep(1); }}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='flex items-center gap-2 mb-6'>
              <div className={'flex-1 h-1.5 rounded-full ' + (adoptStep >= 1 ? 'bg-green-500' : 'bg-gray-200')} />
              <div className={'flex-1 h-1.5 rounded-full ' + (adoptStep >= 2 ? 'bg-green-500' : 'bg-gray-200')} />
            </div>

            {adoptStep === 1 && (
              <div className='space-y-4'>
                <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                  <p className='text-sm font-medium text-green-700 mb-3 flex items-center gap-2'>
                    <Sprout className='w-4 h-4' />
                    树苗品种信息
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <p className='text-xs text-gray-500'>品种</p>
                      <p className='font-medium text-gray-800'>{tree.species}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>适宜土壤</p>
                      <p className='font-medium text-gray-800'>{speciesInfo?.soilTypes?.join('、') || '通用'}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>浇水周期</p>
                      <p className='font-medium text-gray-800'>约 {speciesInfo?.waterCycle || '7'} 天/次</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>树龄</p>
                      <p className='font-medium text-gray-800'>{tree.age} 年</p>
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-amber-50 rounded-lg border border-amber-200'>
                  <p className='text-sm font-medium text-amber-700 mb-2 flex items-center gap-2'>
                    <Thermometer className='w-4 h-4' />
                    土壤适配度
                  </p>
                  <p className='text-gray-700 text-sm'>{tree.soilCompatibility || speciesInfo?.soilCompatibility || '良好'}</p>
                  {speciesInfo?.seasonCare && (
                    <div className='mt-3 pt-3 border-t border-amber-200 grid grid-cols-2 gap-2'>
                      {Object.entries(speciesInfo.seasonCare).map(([season, care]) => (
                        <div key={season} className='text-xs'>
                          <span className='font-medium text-amber-700'>{getSeasonName(season)}：</span>
                          <span className='text-gray-600'>{care}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <p className='text-sm font-medium text-blue-700 mb-2 flex items-center gap-2'>
                    <Droplets className='w-4 h-4' />
                    最近补水记录
                  </p>
                  {lastWatering ? (
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-xs text-gray-500'>补水日期</p>
                        <p className='font-medium text-gray-800'>{lastWatering.date}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-500'>操作人</p>
                        <p className='font-medium text-gray-800'>{lastWatering.operatorName || lastWatering.greenkeeperName}</p>
                      </div>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-sm'>
                      {tree.lastWateringDate ? `记录日期：${tree.lastWateringDate}` : '暂无补水记录，认养后需优先安排浇水'}
                    </p>
                  )}
                  {lastWatering?.note && (
                    <p className='text-xs text-gray-500 mt-2 pt-2 border-t border-blue-200'>备注：{lastWatering.note}</p>
                  )}
                </div>

                <div className='flex gap-3 justify-end pt-2'>
                  <button
                    onClick={() => { setShowAdoptModal(false); setAdoptStep(1); }}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    取消
                  </button>
                  <button
                    onClick={() => setAdoptStep(2)}
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    我已了解，下一步
                  </button>
                </div>
              </div>
            )}

            {adoptStep === 2 && (
              <div className='space-y-4'>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-gray-700 mb-3'>您即将认养 <span className='font-semibold text-green-700'>{tree.name}</span>，认养期为 90 天。</p>
                  <ul className='text-sm text-gray-600 space-y-1.5'>
                    <li className='flex items-start gap-2'>
                      <Check className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                      <span>认养期间需关注浇水周期与季节养护要点</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Check className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                      <span>如需外出可临时转养给他人</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Check className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                      <span>认养期结束后记录自动归档为只读，但完整养护轨迹可随时追溯</span>
                    </li>
                  </ul>
                </div>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => setAdoptStep(1)}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    返回上一步
                  </button>
                  <button
                    onClick={handleAdopt}
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2'
                  >
                    <Heart className='w-4 h-4' />
                    确认认养
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showMaintModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>添加养护记录</h3>
              <button onClick={() => setShowMaintModal(false)} className='text-gray-400 hover:text-gray-600'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>养护类型</label>
              <div className='flex gap-2'>
                {maintenanceTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.key}
                      onClick={() => setMaintType(type.key)}
                      className={
                        'flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ' +
                        (maintType === type.key ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')
                      }
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
              />
            </div>
            {isAdoptionExpired && (
              <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <p className='text-sm text-amber-700'>注意：认养期已结束，无法添加养护记录。</p>
              </div>
            )}
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowMaintModal(false)}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
              >
                取消
              </button>
              <button
                onClick={handleAddMaintenance}
                disabled={isAdoptionExpired || !maintNote.trim()}
                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
