import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TreePine, MapPin, Calendar, Heart, AlertTriangle } from 'lucide-react';

export default function TreeList() {
  const navigate = useNavigate();
  const { treesData, role, getActiveAdoptionForTree } = useApp();

  const getStatusInfo = (status) => {
    if (status === 'healthy') return { text: '健康', color: 'bg-green-100 text-green-700' };
    return { text: '枯萎', color: 'bg-gray-200 text-gray-500' };
  };

  const isAdopted = (treeId) => {
    return !!getActiveAdoptionForTree(treeId);
  };

  const canAdopt = (tree) => {
    return role === 'resident' && tree.status === 'healthy' && !isAdopted(tree.id);
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>苗木列表</h1>
        <p className='text-gray-500'>共 {treesData.length} 棵苗木</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {treesData.map(tree => {
          const statusInfo = getStatusInfo(tree.status);
          const adopted = isAdopted(tree.id);
          const adoption = getActiveAdoptionForTree(tree.id);
          return (
            <div
              key={tree.id}
              className={'bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border ' + (tree.status === 'withered' ? 'border-gray-200 opacity-75' : 'border-transparent')}
              onClick={() => navigate('/app/tree/' + tree.id)}
            >
              <div className='relative h-40 bg-gray-100'>
                <img src={tree.image} alt={tree.name} className='w-full h-full object-cover' />
                <div className='absolute top-3 right-3'>
                  <span className={'px-2 py-1 rounded-full text-xs font-medium ' + statusInfo.color}>{statusInfo.text}</span>
                </div>
                {adopted && <div className='absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1'>
                  <Heart className='w-3 h-3 fill-current' />
                  已认养
                </div>}
              </div>
              <div className='p-4'>
                <h3 className='font-semibold text-gray-800 text-lg mb-1'>{tree.name}</h3>
                <p className='text-sm text-green-600 mb-3'>{tree.species}</p>
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                  <MapPin className='w-4 h-4' />
                  {tree.location}
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Calendar className='w-4 h-4' />
                  {tree.age} 年树龄
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}