import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TreePine, Droplets, Building2 } from 'lucide-react';

const roles = [
  { id: 'resident', name: '居民', desc: '认养苗木，查看养护记录', icon: TreePine, color: 'bg-green-500' },
  { id: 'greenkeeper', name: '绿化员', desc: '记录浇水施肥，查看提醒', icon: Droplets, color: 'bg-blue-500' },
  { id: 'committee', name: '居委会', desc: '查看成活率，监督管理', icon: Building2, color: 'bg-amber-500' },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const { switchRole } = useApp();

  const handleSelect = (roleId) => {
    switchRole(roleId);
    navigate('/app');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-green-800 mb-3'>社区苗木认养系统</h1>
        <p className='text-green-600 text-lg'>请选择您的身份进入系统</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl'>
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleSelect(role.id)}
              className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center hover:-translate-y-1 border-2 border-transparent hover:border-green-300'
            >
              <div className='w-20 h-20 rounded-full {role.color} flex items-center justify-center mb-5'>
                <Icon className='w-10 h-10 text-white' />
              </div>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>{role.name}</h2>
              <p className='text-gray-500 text-center'>{role.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}