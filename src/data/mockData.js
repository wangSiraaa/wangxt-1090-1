const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const trees = [
  {
    id: 't1',
    name: '樱花树',
    species: '樱花',
    age: 3,
    location: '小区东门花坛',
    status: 'healthy',
    plantedDate: '2023-03-15',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop',
    description: '春季开花，花色粉红，观赏价值高'
  },
  {
    id: 't2',
    name: '桂花树',
    species: '桂花',
    age: 5,
    location: '中心花园北侧',
    status: 'healthy',
    plantedDate: '2022-09-10',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    description: '秋季开花，花香浓郁'
  },
  {
    id: 't3',
    name: '银杏树',
    species: '银杏',
    age: 8,
    location: '健身广场旁',
    status: 'healthy',
    plantedDate: '2020-04-20',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=300&fit=crop',
    description: '秋季叶色金黄，古老树种'
  },
  {
    id: 't4',
    name: '梧桐树',
    species: '梧桐',
    age: 4,
    location: '南门主干道',
    status: 'withered',
    plantedDate: '2021-05-12',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop',
    description: '因虫害枯萎，待处理'
  },
  {
    id: 't5',
    name: '玉兰花',
    species: '玉兰',
    age: 2,
    location: '1号楼前',
    status: 'healthy',
    plantedDate: '2024-03-08',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    description: '早春开花，花大而美'
  },
  {
    id: 't6',
    name: '紫薇',
    species: '紫薇',
    age: 6,
    location: '儿童乐园旁',
    status: 'healthy',
    plantedDate: '2021-07-15',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    description: '花期长，花色艳丽'
  },
  {
    id: 't7',
    name: '松树',
    species: '黑松',
    age: 10,
    location: '北门入口',
    status: 'healthy',
    plantedDate: '2019-01-20',
    image: 'https://images.unsplash.com/photo-1420881983048-004a6a220399?w=400&h=300&fit=crop',
    description: '常绿乔木，四季常青'
  },
  {
    id: 't8',
    name: '柳树',
    species: '垂柳',
    age: 7,
    location: '人工湖边',
    status: 'withered',
    plantedDate: '2020-02-28',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
    description: '因干旱枯萎，计划更换'
  }
];

export const adoptions = [
  {
    id: 'a1',
    treeId: 't1',
    residentId: 'r1',
    residentName: '张大爷',
    startDate: '2025-01-15',
    endDate: formatDate(addDays(today, 30)),
    status: 'active'
  },
  {
    id: 'a2',
    treeId: 't2',
    residentId: 'r2',
    residentName: '李阿姨',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    status: 'active'
  },
  {
    id: 'a3',
    treeId: 't3',
    residentId: 'r3',
    residentName: '王小明',
    startDate: formatDate(addDays(today, -60)),
    endDate: formatDate(addDays(today, -1)),
    status: 'expired'
  },
  {
    id: 'a4',
    treeId: 't5',
    residentId: 'r4',
    residentName: '赵奶奶',
    startDate: '2025-03-10',
    endDate: formatDate(addDays(today, 90)),
    status: 'active'
  }
];

export const maintenances = [
  {
    id: 'm1',
    treeId: 't1',
    type: 'water',
    operatorId: 'g1',
    operatorName: '绿化员刘师傅',
    date: formatDate(addDays(today, -3)),
    note: '天气干燥，浇透水'
  },
  {
    id: 'm2',
    treeId: 't1',
    type: 'fertilize',
    operatorId: 'g1',
    operatorName: '绿化员刘师傅',
    date: formatDate(addDays(today, -10)),
    note: '施有机肥'
  },
  {
    id: 'm3',
    treeId: 't2',
    type: 'water',
    operatorId: 'g2',
    operatorName: '绿化员陈师傅',
    date: formatDate(addDays(today, -5)),
    note: '正常浇水'
  },
  {
    id: 'm4',
    treeId: 't3',
    type: 'water',
    operatorId: 'g1',
    operatorName: '绿化员刘师傅',
    date: formatDate(addDays(today, -20)),
    note: '定期浇水'
  },
  {
    id: 'm5',
    treeId: 't5',
    type: 'water',
    operatorId: 'g2',
    operatorName: '绿化员陈师傅',
    date: formatDate(addDays(today, -2)),
    note: '幼苗期注意保湿'
  },
  {
    id: 'm6',
    treeId: 't5',
    type: 'fertilize',
    operatorId: 'g2',
    operatorName: '绿化员陈师傅',
    date: formatDate(addDays(today, -8)),
    note: '施复合肥促进生长'
  },
  {
    id: 'm7',
    treeId: 't6',
    type: 'water',
    operatorId: 'g1',
    operatorName: '绿化员刘师傅',
    date: formatDate(addDays(today, -18)),
    note: '花期浇水'
  },
  {
    id: 'm8',
    treeId: 't7',
    type: 'water',
    operatorId: 'g1',
    operatorName: '绿化员刘师傅',
    date: formatDate(addDays(today, -1)),
    note: '日常养护'
  }
];

export const reminders = [
  {
    id: 'r1',
    treeId: 't3',
    treeName: '银杏树',
    type: 'maintenance_overdue',
    message: '该苗木已连续19天未养护，请尽快安排养护',
    daysOverdue: 19,
    createdDate: formatDate(addDays(today, -5)),
    status: 'unread'
  },
  {
    id: 'r2',
    treeId: 't6',
    treeName: '紫薇',
    type: 'maintenance_overdue',
    message: '该苗木已连续17天未养护，请尽快安排养护',
    daysOverdue: 17,
    createdDate: formatDate(addDays(today, -3)),
    status: 'unread'
  }
];

export const residents = [
  { id: 'r1', name: '张大爷', phone: '138****1234', address: '3号楼2单元501' },
  { id: 'r2', name: '李阿姨', phone: '139****5678', address: '5号楼1单元302' },
  { id: 'r3', name: '王小明', phone: '137****9012', address: '1号楼3单元101' },
  { id: 'r4', name: '赵奶奶', phone: '136****3456', address: '7号楼2单元403' }
];

export const greenkeepers = [
  { id: 'g1', name: '刘师傅', phone: '135****7890', status: 'onDuty' },
  { id: 'g2', name: '陈师傅', phone: '134****2345', status: 'onDuty' }
];

export const committeeMembers = [
  { id: 'c1', name: '王主任', role: '居委会主任' },
  { id: 'c2', name: '李委员', role: '绿化委员' }
];

export const roles = [
  { id: 'resident', name: '居民', description: '认养苗木、查看养护记录' },
  { id: 'greenkeeper', name: '绿化员', description: '记录浇水施肥、查看提醒' },
  { id: 'committee', name: '居委会', description: '查看成活率、监督管理' }
];
