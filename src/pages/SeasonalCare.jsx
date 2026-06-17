import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Sun, RefreshCw, Sprout, TreeDeciduous, Calendar, Check, X,
  Clock, AlertTriangle, ChevronDown, ChevronUp, Plus, FileText,
  Users, MapPin
} from 'lucide-react';

const actionLabels = {
  relocation: { label: '迁盆', icon: RefreshCw, color: 'text-blue-600 bg-blue-50' },
  replanting: { label: '补种', icon: Sprout, color: 'text-green-600 bg-green-50' },
  nursery: { label: '转入苗圃', icon: TreeDeciduous, color: 'text-amber-600 bg-amber-50' },
};

const statusLabels = {
  pending: { text: '待评估', color: 'bg-amber-100 text-amber-700' },
  planned: { text: '已计划', color: 'bg-blue-100 text-blue-700' },
  confirmed: { text: '已确认', color: 'bg-green-100 text-green-700' },
  not_needed: { text: '无需处理', color: 'bg-gray-100 text-gray-500' },
  done: { text: '已完成', color: 'bg-emerald-100 text-emerald-700' },
};

const judgeOptions = [
  { value: 'confirmed', label: '确认执行', color: 'bg-green-500 hover:bg-green-600 text-white' },
  { value: 'planned', label: '计划安排', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { value: 'not_needed', label: '无需处理', color: 'bg-gray-500 hover:bg-gray-600 text-white' },
  { value: 'done', label: '标记完成', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
];

export default function SeasonalCare() {
  const navigate = useNavigate();
  const {
    seasonalPlansData, treesData, role, judgeSeasonalAction,
    createSeasonalPlan, getSeasonName, getCurrentSeason, getSpeciesInfo,
    maintenancesData, remindersData,
  } = useApp();

  const [expandedPlan, setExpandedPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTree, setSelectedTree] = useState('');
  const [newSeason, setNewSeason] = useState(getCurrentSeason());
  const [newPlan, setNewPlan] = useState('');
  const [judgingAction, setJudgingAction] = useState(null);
  const [judgeNote, setJudgeNote] = useState('');
  const [message, setMessage] = useState('');

  const sortedPlans = [...seasonalPlansData].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  const getTreeName = (treeId) => treesData.find(t => t.id === treeId)?.name || '未知';
  const getTree = (treeId) => treesData.find(t => t.id === treeId);

  const handleJudge = (planId, actionId, status) => {
    judgeSeasonalAction(planId, actionId, status, judgeNote);
    setJudgingAction(null);
    setJudgeNote('');
    setMessage('节点判断已更新');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreate = () => {
    if (!selectedTree || !newPlan.trim()) return;
    const actions = [
      { type: 'relocation', label: '迁盆', status: 'pending', note: '' },
      { type: 'replanting', label: '补种', status: 'pending', note: '' },
      { type: 'nursery', label: '转入苗圃', status: 'pending', note: '' },
    ];
    createSeasonalPlan(selectedTree, newSeason, newPlan, actions);
    setShowCreateModal(false);
    setSelectedTree('');
    setNewPlan('');
    setMessage('季节养护计划已创建');
    setTimeout(() => setMessage(''), 3000);
  };

  const pendingCount = seasonalPlansData.reduce((acc, p) =>
    acc + p.actions.filter(a => a.status === 'pending').length, 0);
  const witherCount = remindersData.filter(r => r.type === 'wither_warning').length;

  return (
    <div>
      {message && (
        <div className='fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50'>
          <Check className='w-5 h-5' />
          {message}
        </div>
      )}

      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>季节养护与节点判断</h1>
        {role === 'committee' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
          >
            <Plus className='w-4 h-4' />
            新建计划
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3'>
          <Clock className='w-8 h-8 text-amber-500' />
          <div>
            <p className='text-2xl font-bold text-amber-700'>{pendingCount}</p>
            <p className='text-sm text-amber-600'>待判断节点</p>
          </div>
        </div>
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3'>
          <AlertTriangle className='w-8 h-8 text-red-500' />
          <div>
            <p className='text-2xl font-bold text-red-700'>{witherCount}</p>
            <p className='text-sm text-red-600'>枯萎预警</p>
          </div>
        </div>
        <div className='bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3'>
          <Sun className='w-8 h-8 text-green-500' />
          <div>
            <p className='text-2xl font-bold text-green-700'>{seasonalPlansData.length}</p>
            <p className='text-sm text-green-600'>养护计划</p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {sortedPlans.map(plan => {
          const tree = getTree(plan.treeId);
          const isExpanded = expandedPlan === plan.id;
          const pendingActions = plan.actions.filter(a => a.status === 'pending');
          const hasPending = pendingActions.length > 0;

          return (
            <div key={plan.id} className={'bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ' + (hasPending ? 'border-amber-500' : 'border-green-500')}>
              <div className='p-5'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0'>
                      <Sun className='w-6 h-6 text-amber-600' />
                    </div>
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-semibold text-gray-800'>
                          {getTreeName(plan.treeId)}
                        </h3>
                        <span className='px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full'>
                          {plan.year}年{getSeasonName(plan.season)}
                        </span>
                        {hasPending && (
                          <span className='px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1'>
                            <AlertTriangle className='w-3 h-3' />
                            {pendingActions.length}项待判
                          </span>
                        )}
                      </div>
                      <p className='text-gray-600 text-sm mb-1'>{plan.plan}</p>
                      <div className='flex items-center gap-3 text-xs text-gray-400'>
                        <span>制定人：{plan.createdName}</span>
                        <span>{plan.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                    className='text-green-600 hover:text-green-700'
                  >
                    {isExpanded ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
                  </button>
                </div>

                <div className='mt-3 flex gap-2'>
                  {plan.actions.map(action => {
                    const actionConfig = actionLabels[action.type];
                    const statusConfig = statusLabels[action.status];
                    const Icon = actionConfig?.icon || FileText;
                    return (
                      <div key={action.id} className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg'>
                        <Icon className='w-4 h-4 text-gray-500' />
                        <span className='text-sm text-gray-700'>{actionConfig?.label || action.label}</span>
                        <span className={'px-1.5 py-0.5 rounded text-xs ' + (statusConfig?.color || '')}>
                          {statusConfig?.text || action.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isExpanded && (
                <div className='border-t bg-gray-50 p-5 space-y-4'>
                  {tree && (
                    <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                      <p className='text-sm font-medium text-blue-700 mb-1'>苗木信息</p>
                      <div className='flex items-center gap-4 text-sm text-gray-600'>
                        <span>品种：{tree.species}</span>
                        <span>位置：{tree.location}</span>
                        <span>状态：{tree.status === 'healthy' ? '健康' : '枯萎'}</span>
                      </div>
                      <div className='flex items-center gap-1 text-sm text-gray-500 mt-1'>
                        <MapPin className='w-3 h-3' />
                        责任片区：{tree.responsibleArea || '未指定'}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className='text-sm font-medium text-gray-700 mb-3'>节点判断详情</p>
                    <div className='space-y-3'>
                      {plan.actions.map(action => {
                        const actionConfig = actionLabels[action.type];
                        const ActionIcon = actionConfig?.icon || FileText;
                        const isPending = action.status === 'pending';
                        const isJudging = judgingAction === action.id;

                        return (
                          <div key={action.id} className={'p-4 bg-white rounded-lg border ' + (isPending ? 'border-amber-300' : 'border-gray-200')}>
                            <div className='flex items-start gap-3'>
                              <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + (actionConfig?.color || 'bg-gray-50')}>
                                <ActionIcon className='w-5 h-5' />
                              </div>
                              <div className='flex-1'>
                                <div className='flex items-center justify-between mb-1'>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-medium text-gray-800'>{actionConfig?.label || action.label}</span>
                                    <span className={'px-2 py-0.5 rounded text-xs ' + (statusLabels[action.status]?.color || '')}>
                                      {statusLabels[action.status]?.text || action.status}
                                    </span>
                                  </div>
                                  {action.judgedBy && (
                                    <span className='text-xs text-gray-400'>
                                      {action.judgedBy} · {action.judgedDate}
                                    </span>
                                  )}
                                </div>
                                <p className='text-sm text-gray-600 mb-2'>{action.note || '暂无备注'}</p>
                                {action.date && <p className='text-xs text-gray-400 mb-2'>计划日期：{action.date}</p>}

                                {role === 'committee' && isPending && !isJudging && (
                                  <div className='flex gap-2 mt-2'>
                                    {judgeOptions.map(opt => (
                                      <button
                                        key={opt.value}
                                        onClick={() => {
                                          if (opt.value === 'not_needed' || opt.value === 'done') {
                                            handleJudge(plan.id, action.id, opt.value);
                                          } else {
                                            setJudgingAction(action.id);
                                            setJudgeNote('');
                                          }
                                        }}
                                        className={'px-3 py-1.5 rounded-lg text-xs ' + opt.color}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {isJudging && (
                                  <div className='mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-3'>
                                    <div>
                                      <label className='block text-xs font-medium text-gray-700 mb-1'>判断说明</label>
                                      <textarea
                                        value={judgeNote}
                                        onChange={(e) => setJudgeNote(e.target.value)}
                                        className='w-full px-3 py-2 border rounded-lg text-sm h-16'
                                        placeholder='请输入判断说明...'
                                      />
                                    </div>
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() => { setJudgingAction(null); setJudgeNote(''); }}
                                        className='px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50'
                                      >
                                        取消
                                      </button>
                                      <button
                                        onClick={() => handleJudge(plan.id, action.id, judgingAction === action.id ? 'confirmed' : 'planned')}
                                        className='px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600'
                                      >
                                        确认提交
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {tree && (
                    <div>
                      <p className='text-sm font-medium text-gray-700 mb-2'>近期养护记录</p>
                      <div className='space-y-1'>
                        {maintenancesData
                          .filter(m => m.treeId === plan.treeId)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 3)
                          .map(m => (
                            <div key={m.id} className='flex items-center gap-2 p-2 bg-white rounded-lg text-sm'>
                              <span className='text-gray-400 text-xs'>{m.date}</span>
                              <span className='text-gray-700'>{m.type === 'water' || m.type === 'watering' ? '浇水' : m.type === 'fertilize' || m.type === 'fertilizing' ? '施肥' : '修剪'}</span>
                              <span className='text-gray-500'>- {m.operatorName}</span>
                              <span className='text-gray-400 text-xs ml-auto'>{m.note}</span>
                            </div>
                          ))
                        }
                        {maintenancesData.filter(m => m.treeId === plan.treeId).length === 0 && (
                          <p className='text-gray-400 text-sm text-center py-2'>暂无养护记录</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sortedPlans.length === 0 && (
          <div className='text-center py-16'>
            <Sun className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-400 text-lg'>暂无季节养护计划</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>新建季节养护计划</h3>
              <button onClick={() => setShowCreateModal(false)} className='text-gray-400 hover:text-gray-600'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>选择苗木</label>
                <select value={selectedTree} onChange={(e) => setSelectedTree(e.target.value)} className='w-full px-3 py-2 border rounded-lg text-sm'>
                  <option value=''>请选择苗木</option>
                  {treesData.map(t => <option key={t.id} value={t.id}>{t.name}（{t.species}）</option>)}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>季节</label>
                <select value={newSeason} onChange={(e) => setNewSeason(e.target.value)} className='w-full px-3 py-2 border rounded-lg text-sm'>
                  <option value='spring'>春季</option>
                  <option value='summer'>夏季</option>
                  <option value='autumn'>秋季</option>
                  <option value='winter'>冬季</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>养护计划描述</label>
                <textarea
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className='w-full px-3 py-2 border rounded-lg text-sm h-24'
                  placeholder='描述本季节的养护重点和计划...'
                />
              </div>
              <p className='text-xs text-gray-500'>
                系统将自动创建迁盆、补种、转入苗圃三个判断节点，供后续逐项评估。
              </p>
            </div>
            <div className='flex gap-3 justify-end mt-5'>
              <button onClick={() => setShowCreateModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'>取消</button>
              <button
                onClick={handleCreate}
                disabled={!selectedTree || !newPlan.trim()}
                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                创建计划
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
