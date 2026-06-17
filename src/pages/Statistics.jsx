import { useApp } from '../context/AppContext';
import {
  TreeDeciduous, Heart, Droplets, Users, MapPin, AlertTriangle,
  Shield, RefreshCw, TrendingUp, CheckCircle, XCircle, Clock
} from 'lucide-react';

export default function Statistics() {
  const { treesData, adoptionsData, maintenancesData, transfersData, remindersData } = useApp();

  const total = treesData.length;
  const healthy = treesData.filter(t => t.status === 'healthy').length;
  const withered = treesData.filter(t => t.status === 'withered').length;
  const activeAdoptions = adoptionsData.filter(a => a.status === 'active');
  const expiredAdoptions = adoptionsData.filter(a => a.status === 'expired' || a.isReadOnly);
  const healthRate = total > 0 ? ((healthy / total) * 100).toFixed(1) : 0;

  const survivalRates = adoptionsData
    .filter(a => a.survivalRate)
    .map(a => parseFloat(a.survivalRate));
  const avgSurvivalRate = survivalRates.length > 0
    ? (survivalRates.reduce((a, b) => a + b, 0) / survivalRates.length).toFixed(1)
    : '100.0';

  const abnormalCount = adoptionsData.filter(a => a.abnormalReason).length;

  const areaMap = {};
  treesData.forEach(t => {
    const area = t.responsibleArea || '未分配';
    if (!areaMap[area]) areaMap[area] = { total: 0, healthy: 0, withered: 0 };
    areaMap[area].total++;
    if (t.status === 'healthy') areaMap[area].healthy++;
    else areaMap[area].withered++;
  });

  const activeTransfers = transfersData.filter(t => t.status === 'active').length;
  const returnedTransfers = transfersData.filter(t => t.status === 'returned').length;

  const witherReminders = remindersData.filter(r => r.type === 'wither_warning');
  const unreadReminders = remindersData.filter(r => r.status === 'unread').length;

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>数据统计与追溯</h1>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white mb-3'>
            <TreeDeciduous className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{total}</p>
          <p className='text-sm text-gray-500'>苗木总数</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white mb-3'>
            <Heart className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{activeAdoptions.length}</p>
          <p className='text-sm text-gray-500'>有效认养</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-3'>
            <Droplets className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{maintenancesData.length}</p>
          <p className='text-sm text-gray-500'>养护记录</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white mb-3'>
            <TrendingUp className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{healthRate}%</p>
          <p className='text-sm text-gray-500'>健康率</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Shield className='w-5 h-5 text-green-600' />
            认养与追溯概览
          </h2>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
              <span className='text-gray-700'>进行中认养</span>
              <span className='font-bold text-green-600'>{activeAdoptions.length}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
              <span className='text-gray-700'>已归档（只读可追溯）</span>
              <span className='font-bold text-gray-600'>{expiredAdoptions.length}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
              <span className='text-gray-700'>平均成活率</span>
              <span className='font-bold text-blue-600'>{avgSurvivalRate}%</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-amber-50 rounded-lg'>
              <span className='text-gray-700'>存在异常的认养</span>
              <span className='font-bold text-amber-600'>{abnormalCount}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-cyan-50 rounded-lg'>
              <span className='text-gray-700'>临时转养（进行中/已归还）</span>
              <span className='font-bold text-cyan-600'>{activeTransfers} / {returnedTransfers}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
            枯萎预警统计
          </h2>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 bg-red-50 rounded-lg'>
              <span className='text-gray-700'>枯萎苗木</span>
              <span className='font-bold text-red-600'>{withered}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
              <span className='text-gray-700'>枯萎预警数</span>
              <span className='font-bold text-orange-600'>{witherReminders.length}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-amber-50 rounded-lg'>
              <span className='text-gray-700'>未读预警</span>
              <span className='font-bold text-amber-600'>{unreadReminders}</span>
            </div>
            {witherReminders.length > 0 && (
              <div className='mt-2'>
                <p className='text-sm font-medium text-gray-600 mb-2'>预警苗木详情：</p>
                <div className='space-y-2'>
                  {witherReminders.map(r => (
                    <div key={r.id} className='p-2 bg-white border border-red-200 rounded-lg'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-800'>{r.treeName}</span>
                        <span className='text-xs text-red-600'>逾期{r.daysOverdue}天</span>
                      </div>
                      {r.witherDetails && (
                        <div className='mt-1 text-xs text-gray-500'>
                          <span>片区：{r.witherDetails.responsibleArea}</span>
                          <span className='mx-2'>|</span>
                          <span>养护人：{r.witherDetails.recentMaintainers?.join('、') || '无'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm p-6'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
          <MapPin className='w-5 h-5 text-blue-600' />
          责任片区覆盖
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Object.entries(areaMap).map(([area, data]) => (
            <div key={area} className='p-4 border rounded-lg'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='font-medium text-gray-800 text-sm'>{area}</h3>
                <span className='text-xs text-gray-400'>{data.total} 棵</span>
              </div>
              <div className='flex gap-2'>
                <div className='flex-1'>
                  <div className='flex items-center gap-1 text-xs text-green-600 mb-1'>
                    <CheckCircle className='w-3 h-3' />
                    健康 {data.healthy}
                  </div>
                  <div className='h-2 bg-gray-200 rounded-full'>
                    <div
                      className='h-2 bg-green-500 rounded-full'
                      style={{ width: data.total > 0 ? (data.healthy / data.total * 100) + '%' : '0%' }}
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-1 text-xs text-red-500 mb-1'>
                    <XCircle className='w-3 h-3' />
                    枯萎 {data.withered}
                  </div>
                  <div className='h-2 bg-gray-200 rounded-full'>
                    <div
                      className='h-2 bg-red-500 rounded-full'
                      style={{ width: data.total > 0 ? (data.withered / data.total * 100) + '%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {expiredAdoptions.length > 0 && (
        <div className='mt-6 bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Clock className='w-5 h-5 text-gray-600' />
            已归档认养追溯
          </h2>
          <div className='space-y-3'>
            {expiredAdoptions.map(a => {
              const tree = treesData.find(t => t.id === a.treeId);
              return (
                <div key={a.id} className='p-4 bg-gray-50 rounded-lg border'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-gray-800'>{tree?.name || '未知'}</span>
                      <span className='px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded'>已归档</span>
                    </div>
                    <span className='text-sm text-gray-500'>{a.startDate} ~ {a.endDate}</span>
                  </div>
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='text-gray-600'>认养人：{a.residentName}</span>
                    <span className='text-green-600'>成活率：{a.survivalRate || '未记录'}</span>
                    <span className='text-gray-500'>养护记录：{a.careTrack?.length || 0} 条</span>
                    <span className='text-blue-600'>转养：{a.transferHistory?.length || 0} 次</span>
                    {a.abnormalReason && <span className='text-amber-600'>异常：{a.abnormalReason}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
