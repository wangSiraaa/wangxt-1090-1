import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, Calendar, MapPin, XCircle } from 'lucide-react';

export default function MyAdoptions() {
  const navigate = useNavigate();
  const { getMyAdoptions, treesData, cancelAdoption, role } = useApp();
  const myAdoptions = getMyAdoptions();

  const getTree = (treeId) => treesData.find(t => t.id === treeId);
  const getStatusInfo = (status) => {
    if (status === 'active') return { text: '有效', color: 'bg-green-100 text-green-700' };
    if (status === 'expired') return { text: '已到期', color: 'bg-gray-100 text-gray-500' };
    return { text: '已取消', color: 'bg-red-100 text-red-600' };
  };

  const handleCancel = (adoptionId) => {
    if (confirm('确定要取消认养吗？')) { cancelAdoption(adoptionId); }
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>我的认养</h1>
        <p className='text-gray-500'>共 {myAdoptions.length} 条认养记录</p>
      </div>
      {myAdoptions.length === 0 ? (
        <div className='text-center py-16'>
          <Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-400 text-lg mb-4'>您还没有认养任何苗木</p>
          <button onClick={() => navigate('/app')} className='text-green-600 hover:text-green-700 font-medium'>去苗木列表看看</button>
        </div>
      ) : (
        <div className='space-y-4'>
          {myAdoptions.map(adoption => {
            const tree = getTree(adoption.treeId);
            const statusInfo = getStatusInfo(adoption.status);
            const expired = isExpired(adoption.endDate);
            if (!tree) return null;
            return (
              <div key={adoption.id} className='bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                <div className='flex'>
                  <div className='w-32 h-32 flex-shrink-0'>
                    <img src={tree.image} alt={tree.name} className='w-full h-full object-cover cursor-pointer' onClick={() => navigate('/app/tree/' + tree.id)} />
                  </div>
                  <div className='flex-1 p-4 flex flex-col justify-between'>
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-800 text-lg cursor-pointer hover:text-green-600' onClick={() => navigate('/app/tree/' + tree.id)}>{tree.name}</h3>
                        <span className='px-2 py-1 rounded-full text-xs font-medium {statusInfo.color}'>{statusInfo.text}</span>
                      </div>
                      <p className='text-sm text-green-600 mb-2'>{tree.species}</p>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <MapPin className='w-4 h-4' />
                          {tree.location}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-4 h-4' />
                          {adoption.startDate} ~ {adoption.endDate}
                        </div>
                      </div>
                    </div>
                    {role === 'resident' && adoption.status === 'active' && !expired && (
                      <button onClick={() => handleCancel(adoption.id)} className='self-start flex items-center gap-1 text-red-500 hover:text-red-600 text-sm mt-2'>
                        <XCircle className='w-4 h-4' />
                        取消认养
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}