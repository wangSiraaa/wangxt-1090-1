import { useApp } from '../context/AppContext';
import { TreeDeciduous, Heart, Droplets, Users } from 'lucide-react';

export default function Statistics() {
  const { treesData, adoptionsData, maintenancesData, usersData } = useApp();
  const total = treesData.length;
  const healthy = treesData.filter(t => t.status === 'healthy').length;
  const adopted = adoptionsData.filter(a => a.status === 'active').length;
  const rate = total > 0 ? ((healthy / total) * 100).toFixed(1) : 0;
  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>数据统计</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
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
          <p className='text-2xl font-bold text-gray-800'>{healthy}</p>
          <p className='text-sm text-gray-500'>健康苗木</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white mb-3'>
            <Heart className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{adopted}</p>
          <p className='text-sm text-gray-500'>有效认养</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm p-5'>
          <div className='w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-3'>
            <Droplets className='w-5 h-5' />
          </div>
          <p className='text-2xl font-bold text-gray-800'>{rate}%</p>
          <p className='text-sm text-gray-500'>成活率</p>
        </div>
      </div>
    </div>
  );
}
