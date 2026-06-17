const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const speciesInfo = {
  '\u6a31\u82b1': { name: '\u6a31\u82b1', soilTypes: ['\u58e4\u571f', '\u6c99\u58e4\u571f'], soilCompatibility: '\u9002\u5408\u6392\u6c34\u826f\u597d\u7684\u58e4\u571f\u6216\u6c99\u58e4\u571f\uff0c\u5fcc\u79ef\u6c34', seasonCare: { spring: '\u82b1\u671f\u6ce8\u610f\u9632\u98ce\uff0c\u82b1\u540e\u8ffd\u80a5', summer: '\u6ce8\u610f\u6392\u6c34\u9632\u6d9d\uff0c\u9002\u5f53\u906e\u9634', autumn: '\u65bd\u57fa\u80a5\uff0c\u6e05\u9664\u843d\u53f6', winter: '\u9632\u5bd2\u4fdd\u6696\uff0c\u4fee\u526a\u75c5\u679d' }, waterCycle: 5 },
  '\u6842\u82b1': { name: '\u6842\u82b1', soilTypes: ['\u58e4\u571f', '\u5fae\u9178\u6027\u571f'], soilCompatibility: '\u559c\u80a5\u6c83\u5fae\u9178\u6027\u571f\u58e4\uff0c\u4e0d\u8010\u79ef\u6c34', seasonCare: { spring: '\u8ffd\u65bd\u6c2e\u80a5\uff0c\u4fc3\u8fdb\u65b0\u68a2\u751f\u957f', summer: '\u63a7\u6c34\u63a7\u80a5\uff0c\u4fc3\u82b1\u82bd\u5206\u5316', autumn: '\u82b1\u671f\u589e\u65bd\u78f7\u94be\u80a5', winter: '\u51cf\u5c11\u6d47\u6c34\uff0c\u9632\u51bb\u5bb3' }, waterCycle: 7 },
  '\u94f6\u674f': { name: '\u94f6\u674f', soilTypes: ['\u58e4\u571f', '\u6c99\u58e4\u571f', '\u9ec4\u58e4'], soilCompatibility: '\u9002\u5e94\u6027\u5e7f\uff0c\u4ee5\u58e4\u571f\u548c\u6c99\u58e4\u571f\u4e3a\u4f73\uff0c\u8010\u65f1', seasonCare: { spring: '\u840c\u82bd\u524d\u65bd\u80a5\uff0c\u6ce8\u610f\u9632\u866b', summer: '\u5145\u8db3\u6d47\u6c34\uff0c\u9632\u6cbb\u53f6\u67af\u75c5', autumn: '\u53f6\u8272\u8f6c\u9ec4\u540e\u51cf\u5c11\u6d47\u6c34', winter: '\u6e05\u7406\u843d\u53f6\uff0c\u6d82\u767d\u9632\u51bb' }, waterCycle: 10 },
  '\u68a7\u6850': { name: '\u68a7\u6850', soilTypes: ['\u58e4\u571f', '\u9ecf\u571f'], soilCompatibility: '\u559c\u6df1\u539a\u80a5\u6c83\u58e4\u571f\uff0c\u8010\u9ecf\u571f\uff0c\u4e0d\u8010\u6d9d', seasonCare: { spring: '\u840c\u82bd\u671f\u65bd\u80a5\uff0c\u6ce8\u610f\u869c\u866b', summer: '\u9ad8\u6e29\u671f\u589e\u52a0\u6d47\u6c34\u9891\u6b21', autumn: '\u843d\u53f6\u540e\u6e05\u7406\uff0c\u65bd\u8d8a\u51ac\u80a5', winter: '\u4fee\u526a\u6574\u5f62\uff0c\u9632\u5bd2' }, waterCycle: 6 },
  '\u7389\u5170': { name: '\u7389\u5170', soilTypes: ['\u58e4\u571f', '\u5fae\u9178\u6027\u571f'], soilCompatibility: '\u559c\u80a5\u6c83\u6e7f\u6da6\u5fae\u9178\u6027\u571f\u58e4\uff0c\u4e0d\u8010\u78b1', seasonCare: { spring: '\u82b1\u540e\u8ffd\u80a5\uff0c\u8865\u5145\u517b\u5206', summer: '\u9ad8\u6e29\u671f\u906e\u9634\u4fdd\u6e7f', autumn: '\u63a7\u6c34\u4fc3\u82b1\u82bd\u5206\u5316', winter: '\u9632\u5bd2\u9632\u51bb\uff0c\u5c11\u6d47\u6c34' }, waterCycle: 4 },
  '\u7d2b\u8587': { name: '\u7d2b\u8587', soilTypes: ['\u58e4\u571f', '\u6c99\u58e4\u571f', '\u77f3\u7070\u8d28\u571f'], soilCompatibility: '\u9002\u5e94\u6027\u5f3a\uff0c\u8010\u65f1\u8010\u7624\u8584\uff0c\u559c\u77f3\u7070\u8d28\u571f\u58e4', seasonCare: { spring: '\u840c\u82bd\u524d\u4fee\u526a\uff0c\u65bd\u57fa\u80a5', summer: '\u82b1\u671f\u8ffd\u65bd\u78f7\u94be\u80a5', autumn: '\u82b1\u540e\u4fee\u526a\u6b8b\u82b1\uff0c\u65bd\u8d8a\u51ac\u80a5', winter: '\u6e05\u7406\u67af\u679d\uff0c\u9632\u5bd2' }, waterCycle: 8 },
  '\u9ed1\u677e': { name: '\u9ed1\u677e', soilTypes: ['\u6c99\u58e4\u571f', '\u7825\u8d28\u571f'], soilCompatibility: '\u559c\u6392\u6c34\u826f\u597d\u7684\u6c99\u58e4\u571f\u6216\u7825\u8d28\u571f\uff0c\u8010\u65f1\u8010\u7624', seasonCare: { spring: '\u6458\u82bd\u4fc3\u5206\u679d\uff0c\u65bd\u8584\u80a5', summer: '\u9632\u7ea2\u8718\u86db\uff0c\u907f\u514d\u8fc7\u6e7f', autumn: '\u63a7\u5236\u6d47\u6c34\uff0c\u589e\u5f3a\u6297\u5bd2', winter: '\u9632\u96ea\u538b\u679d\uff0c\u5c11\u5e72\u9884' }, waterCycle: 12 },
  '\u5782\u67f3': { name: '\u5782\u67f3', soilTypes: ['\u58e4\u571f', '\u9ecf\u571f', '\u6e7f\u5730'], soilCompatibility: '\u559c\u6e7f\u6da6\u58e4\u571f\u6216\u9ecf\u571f\uff0c\u8010\u6c34\u6e7f', seasonCare: { spring: '\u840c\u82bd\u524d\u4fee\u526a\uff0c\u65bd\u57fa\u80a5', summer: '\u5145\u8db3\u4f9b\u6c34\uff0c\u9632\u6cbb\u5929\u725b', autumn: '\u51cf\u5c11\u6d47\u6c34\uff0c\u6e05\u9664\u843d\u53f6', winter: '\u4fee\u526a\u6574\u5f62\uff0c\u9632\u5bd2' }, waterCycle: 3 },
};

export const trees = [
  { id: 't1', name: '\u6a31\u82b1\u6811', species: '\u6a31\u82b1', age: 3, location: '\u5c0f\u533a\u4e1c\u95e8\u82b1\u575b', status: 'healthy', plantedDate: '2023-03-15', image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop', description: '\u6625\u5b63\u5f00\u82b1\uff0c\u82b1\u8272\u7c89\u7ea2\uff0c\u89c2\u8d4f\u4ef7\u503c\u9ad8', soilCompatibility: speciesInfo['\u6a31\u82b1'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -1)), responsibleArea: '\u4e1c\u95e8\u7247\u533a' },
  { id: 't2', name: '\u6842\u82b1\u6811', species: '\u6842\u82b1', age: 5, location: '\u4e2d\u5fc3\u82b1\u56ed\u5317\u4fa7', status: 'healthy', plantedDate: '2022-09-10', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', description: '\u79cb\u5b63\u5f00\u82b1\uff0c\u82b1\u9999\u6d53\u90c1', soilCompatibility: speciesInfo['\u6842\u82b1'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -5)), responsibleArea: '\u4e2d\u5fc3\u82b1\u56ed\u7247\u533a' },
  { id: 't3', name: '\u94f6\u674f\u6811', species: '\u94f6\u674f', age: 8, location: '\u5065\u8eab\u5e7f\u573a\u65c1', status: 'healthy', plantedDate: '2020-04-20', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=300&fit=crop', description: '\u79cb\u5b63\u53f6\u8272\u91d1\u9ec4\uff0c\u53e4\u8001\u6811\u79cd', soilCompatibility: speciesInfo['\u94f6\u674f'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -20)), responsibleArea: '\u5065\u8eab\u5e7f\u573a\u7247\u533a' },
  { id: 't4', name: '\u68a7\u6850\u6811', species: '\u68a7\u6850', age: 4, location: '\u5357\u95e8\u4e3b\u5e72\u9053', status: 'withered', plantedDate: '2021-05-12', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop', description: '\u56e0\u866b\u5bb3\u67af\u840e\uff0c\u5f85\u5904\u7406', soilCompatibility: speciesInfo['\u68a7\u6850'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -25)), responsibleArea: '\u5357\u95e8\u7247\u533a' },
  { id: 't5', name: '\u7389\u5170\u82b1', species: '\u7389\u5170', age: 2, location: '1\u53f7\u697c\u524d', status: 'healthy', plantedDate: '2024-03-08', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop', description: '\u65e9\u6625\u5f00\u82b1\uff0c\u82b1\u5927\u800c\u7f8e', soilCompatibility: speciesInfo['\u7389\u5170'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -2)), responsibleArea: '1\u53f7\u697c\u7247\u533a' },
  { id: 't6', name: '\u7d2b\u8587', species: '\u7d2b\u8587', age: 6, location: '\u513f\u7ae5\u4e50\u56ed\u65c1', status: 'healthy', plantedDate: '2021-07-15', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop', description: '\u82b1\u671f\u957f\uff0c\u82b1\u8272\u8273\u4e3d', soilCompatibility: speciesInfo['\u7d2b\u8587'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -18)), responsibleArea: '\u513f\u7ae5\u4e50\u56ed\u7247\u533a' },
  { id: 't7', name: '\u677e\u6811', species: '\u9ed1\u677e', age: 10, location: '\u5317\u95e8\u5165\u53e3', status: 'healthy', plantedDate: '2019-01-20', image: 'https://images.unsplash.com/photo-1420881983048-004a6a220399?w=400&h=300&fit=crop', description: '\u5e38\u7eff\u4e54\u6728\uff0c\u56db\u5b63\u5e38\u9752', soilCompatibility: speciesInfo['\u9ed1\u677e'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -1)), responsibleArea: '\u5317\u95e8\u7247\u533a' },
  { id: 't8', name: '\u67f3\u6811', species: '\u5782\u67f3', age: 7, location: '\u4eba\u5de5\u6e56\u8fb9', status: 'withered', plantedDate: '2020-02-28', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop', description: '\u56e0\u5e72\u65f1\u67af\u840e\uff0c\u8ba1\u5212\u66f4\u6362', soilCompatibility: speciesInfo['\u5782\u67f3'].soilCompatibility, lastWateringDate: formatDate(addDays(today, -30)), responsibleArea: '\u4eba\u5de5\u6e56\u7247\u533a' },
];

export const adoptions = [
  { id: 'a1', treeId: 't1', residentId: 'r1', residentName: '\u5f20\u5927\u7237', startDate: '2025-01-15', endDate: formatDate(addDays(today, 30)), status: 'active', adoptDate: '2025-01-15', isReadOnly: false, survivalRate: '100%', abnormalReason: null, transferHistory: [], careTrack: [
    { date: formatDate(addDays(today, -3)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u5929\u6c14\u5e72\u71e5\uff0c\u6d47\u900f\u6c34' },
    { date: formatDate(addDays(today, -10)), type: 'fertilizing', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u65bd\u6709\u673a\u80a5' },
    { date: formatDate(addDays(today, -20)), type: 'watering', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u6625\u5b63\u5e38\u89c4\u6d47\u6c34' },
  ]},
  { id: 'a2', treeId: 't2', residentId: 'r2', residentName: '\u674e\u963f\u59e8', startDate: '2025-02-01', endDate: '2025-12-31', status: 'active', adoptDate: '2025-02-01', isReadOnly: false, survivalRate: '100%', abnormalReason: null, transferHistory: [
    { fromResident: '\u674e\u963f\u59e8', toResident: '\u8d75\u5976\u5976', startDate: formatDate(addDays(today, -30)), endDate: formatDate(addDays(today, -15)), reason: '\u674e\u963f\u59e8\u5916\u51fa\u63a2\u4eb2\uff0c\u4e34\u65f6\u8f6c\u517b' },
  ], careTrack: [
    { date: formatDate(addDays(today, -5)), type: 'watering', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u6b63\u5e38\u6d47\u6c34' },
    { date: formatDate(addDays(today, -12)), type: 'fertilizing', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u65bd\u78f7\u94be\u80a5\u4fc3\u82b1\u82bd' },
    { date: formatDate(addDays(today, -25)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u8f6c\u517b\u671f\u95f4\u8865\u6c34' },
  ]},
  { id: 'a3', treeId: 't3', residentId: 'r3', residentName: '\u738b\u5c0f\u660e', startDate: formatDate(addDays(today, -60)), endDate: formatDate(addDays(today, -1)), status: 'expired', adoptDate: formatDate(addDays(today, -60)), isReadOnly: true, survivalRate: '85%', abnormalReason: '\u4e2d\u671f\u51fa\u73b0\u53f6\u67af\u75c5\uff0c\u5df2\u55b7\u836f\u63a7\u5236', transferHistory: [], careTrack: [
    { date: formatDate(addDays(today, -20)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u5b9a\u671f\u6d47\u6c34' },
    { date: formatDate(addDays(today, -35)), type: 'pruning', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u4fee\u526a\u75c5\u679d\uff0c\u55b7\u65bd\u6740\u83cc\u5242' },
    { date: formatDate(addDays(today, -45)), type: 'fertilizing', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u65bd\u590d\u5408\u80a5\u6062\u590d\u6811\u52bf' },
    { date: formatDate(addDays(today, -55)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u53d1\u73b0\u53f6\u67af\u75c7\u72b6\uff0c\u589e\u52a0\u6d47\u6c34' },
  ]},
  { id: 'a4', treeId: 't5', residentId: 'r4', residentName: '\u8d75\u5976\u5976', startDate: '2025-03-10', endDate: formatDate(addDays(today, 90)), status: 'active', adoptDate: '2025-03-10', isReadOnly: false, survivalRate: '100%', abnormalReason: null, transferHistory: [], careTrack: [
    { date: formatDate(addDays(today, -2)), type: 'watering', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u5e7c\u82d7\u671f\u6ce8\u610f\u4fdd\u6e7f' },
    { date: formatDate(addDays(today, -8)), type: 'fertilizing', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u65bd\u590d\u5408\u80a5\u4fc3\u8fdb\u751f\u957f' },
  ]},
];

export const maintenances = [
  { id: 'm1', treeId: 't1', type: 'water', operatorId: 'g1', operatorName: '\u7eff\u5316\u5458\u5218\u5e08\u5085', date: formatDate(addDays(today, -3)), note: '\u5929\u6c14\u5e72\u71e5\uff0c\u6d47\u900f\u6c34' },
  { id: 'm2', treeId: 't1', type: 'fertilize', operatorId: 'g1', operatorName: '\u7eff\u5316\u5458\u5218\u5e08\u5085', date: formatDate(addDays(today, -10)), note: '\u65bd\u6709\u673a\u80a5' },
  { id: 'm3', treeId: 't2', type: 'water', operatorId: 'g2', operatorName: '\u7eff\u5316\u5458\u9648\u5e08\u5085', date: formatDate(addDays(today, -5)), note: '\u6b63\u5e38\u6d47\u6c34' },
  { id: 'm4', treeId: 't3', type: 'water', operatorId: 'g1', operatorName: '\u7eff\u5316\u5458\u5218\u5e08\u5085', date: formatDate(addDays(today, -20)), note: '\u5b9a\u671f\u6d47\u6c34' },
  { id: 'm5', treeId: 't5', type: 'water', operatorId: 'g2', operatorName: '\u7eff\u5316\u5458\u9648\u5e08\u5085', date: formatDate(addDays(today, -2)), note: '\u5e7c\u82d7\u671f\u6ce8\u610f\u4fdd\u6e7f' },
  { id: 'm6', treeId: 't5', type: 'fertilize', operatorId: 'g2', operatorName: '\u7eff\u5316\u5458\u9648\u5e08\u5085', date: formatDate(addDays(today, -8)), note: '\u65bd\u590d\u5408\u80a5\u4fc3\u8fdb\u751f\u957f' },
  { id: 'm7', treeId: 't6', type: 'water', operatorId: 'g1', operatorName: '\u7eff\u5316\u5458\u5218\u5e08\u5085', date: formatDate(addDays(today, -18)), note: '\u82b1\u671f\u6d47\u6c34' },
  { id: 'm8', treeId: 't7', type: 'water', operatorId: 'g1', operatorName: '\u7eff\u5316\u5458\u5218\u5e08\u5085', date: formatDate(addDays(today, -1)), note: '\u65e5\u5e38\u517b\u62a4' },
];

export const reminders = [
  { id: 'r1', treeId: 't3', treeName: '\u94f6\u674f\u6811', type: 'maintenance_overdue', message: '\u8be5\u82d7\u6728\u5df2\u8fde\u7eed19\u5929\u672a\u517b\u62a4\uff0c\u8bf7\u5c3d\u5feb\u5b89\u6392\u517b\u62a4', daysOverdue: 19, createdDate: formatDate(addDays(today, -5)), status: 'unread', witherDetails: { recentMaintainers: ['\u7eff\u5316\u5458\u5218\u5e08\u5085'], responsibleArea: '\u5065\u8eab\u5e7f\u573a\u7247\u533a', remediation: '\u7acb\u5373\u8865\u6c34\u5e76\u68c0\u67e5\u6839\u7cfb\uff0c\u65bd\u751f\u6839\u7c89\u4fc3\u8fdb\u6062\u590d', lastTwoWeeksRecords: [
    { date: formatDate(addDays(today, -20)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u5b9a\u671f\u6d47\u6c34' },
  ]}},
  { id: 'r2', treeId: 't6', treeName: '\u7d2b\u8587', type: 'maintenance_overdue', message: '\u8be5\u82d7\u6728\u5df2\u8fde\u7eed17\u5929\u672a\u517b\u62a4\uff0c\u8bf7\u5c3d\u5feb\u5b89\u6392\u517b\u62a4', daysOverdue: 17, createdDate: formatDate(addDays(today, -3)), status: 'unread', witherDetails: { recentMaintainers: ['\u7eff\u5316\u5458\u5218\u5e08\u5085'], responsibleArea: '\u513f\u7ae5\u4e50\u56ed\u7247\u533a', remediation: '\u7d27\u6025\u6d47\u6c34\u65bd\u80a5\uff0c\u68c0\u67e5\u75c5\u866b\u5bb3\u60c5\u51b5', lastTwoWeeksRecords: [
    { date: formatDate(addDays(today, -18)), type: 'watering', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u82b1\u671f\u6d47\u6c34' },
  ]}},
  { id: 'r3', treeId: 't4', treeName: '\u68a7\u6850\u6811', type: 'wither_warning', message: '\u68a7\u6850\u6811\u51fa\u73b0\u67af\u840e\u9884\u8b66\uff0c\u8bf7\u7acb\u5373\u5904\u7406', daysOverdue: 25, createdDate: formatDate(addDays(today, -7)), status: 'unread', witherDetails: { recentMaintainers: ['\u7eff\u5316\u5458\u5218\u5e08\u5085', '\u7eff\u5316\u5458\u9648\u5e08\u5085'], responsibleArea: '\u5357\u95e8\u7247\u533a', remediation: '\u786e\u8ba4\u866b\u5bb3\u7c7b\u578b\uff0c\u55b7\u65bd\u9488\u5bf9\u6027\u6740\u866b\u5242\uff1b\u82e5\u65e0\u6cd5\u6062\u590d\u5efa\u8bae\u8865\u79cd', lastTwoWeeksRecords: [
    { date: formatDate(addDays(today, -25)), type: 'watering', operator: '\u7eff\u5316\u5458\u9648\u5e08\u5085', note: '\u53d1\u73b0\u866b\u5bb3\u8ff9\u8c61' },
    { date: formatDate(addDays(today, -30)), type: 'fertilizing', operator: '\u7eff\u5316\u5458\u5218\u5e08\u5085', note: '\u65bd\u590d\u5408\u80a5' },
  ]}},
  { id: 'r4', treeId: 't8', treeName: '\u67f3\u6811', type: 'wither_warning', message: '\u67f3\u6811\u51fa\u73b0\u67af\u840e\u9884\u8b66\uff0c\u6301\u7eed\u5e72\u65f1\u5bfc\u81f4\u8131\u6c34', daysOverdue: 30, createdDate: formatDate(addDays(today, -10)), status: 'unread', witherDetails: { recentMaintainers: ['\u7eff\u5316\u5458\u5218\u5e08\u5085'], responsibleArea: '\u4eba\u5de5\u6e56\u7247\u533a', remediation: '\u7d27\u6025\u8865\u6c34\uff0c\u82e5\u6839\u7cfb\u5df2\u67af\u6b7b\u5efa\u8bae\u8f6c\u5165\u82d7\u5703\u91cd\u65b0\u57f9\u80b2\u6216\u8865\u79cd', lastTwoWeeksRecords: [] }},
];

export const seasonalPlans = [
  { id: 'sp1', treeId: 't1', season: 'summer', year: 2025, plan: '\u9ad8\u6e29\u671f\u589e\u52a0\u6d47\u6c34\u9891\u6b21\uff0c\u6ce8\u610f\u6392\u6c34\u9632\u6d9d', actions: [
    { id: 'sa1', type: 'relocation', label: '\u8fc1\u76c6', date: '', status: 'pending', note: '\u65e0\u9700\u8fc1\u76c6' },
    { id: 'sa2', type: 'replanting', label: '\u8865\u79cd', date: '', status: 'not_needed', note: '\u957f\u52bf\u826f\u597d\uff0c\u65e0\u9700\u8865\u79cd' },
    { id: 'sa3', type: 'nursery', label: '\u8f6c\u5165\u82d7\u5703', date: '', status: 'not_needed', note: '\u65e0\u9700\u8f6c\u5165\u82d7\u5703' },
  ], createdBy: 'c1', createdName: '\u738b\u4e3b\u4efb', createdDate: formatDate(addDays(today, -15)) },
  { id: 'sp2', treeId: 't4', season: 'summer', year: 2025, plan: '\u866b\u5bb3\u4e25\u91cd\uff0c\u9700\u8981\u8bc4\u4f30\u662f\u5426\u8865\u79cd\u6216\u8f6c\u5165\u82d7\u5703', actions: [
    { id: 'sa4', type: 'relocation', label: '\u8fc1\u76c6', date: '', status: 'pending', note: '\u8bc4\u4f30\u4e2d' },
    { id: 'sa5', type: 'replanting', label: '\u8865\u79cd', date: formatDate(addDays(today, 10)), status: 'planned', note: '\u8ba1\u5212\u8865\u79cd\u65b0\u68a7\u6850\u82d7' },
    { id: 'sa6', type: 'nursery', label: '\u8f6c\u5165\u82d7\u5703', date: '', status: 'pending', note: '\u89c6\u6062\u590d\u60c5\u51b5\u51b3\u5b9a' },
  ], createdBy: 'c2', createdName: '\u674e\u59d4\u5458', createdDate: formatDate(addDays(today, -10)) },
  { id: 'sp3', treeId: 't8', season: 'summer', year: 2025, plan: '\u5e72\u65f1\u5bfc\u81f4\u67af\u840e\uff0c\u5efa\u8bae\u8f6c\u5165\u82d7\u5703\u57f9\u80b2\u6216\u76f4\u63a5\u8865\u79cd', actions: [
    { id: 'sa7', type: 'relocation', label: '\u8fc1\u76c6', date: '', status: 'not_needed', note: '\u4e0d\u9002\u5408\u8fc1\u76c6' },
    { id: 'sa8', type: 'replanting', label: '\u8865\u79cd', date: formatDate(addDays(today, 15)), status: 'planned', note: '\u8ba1\u5212\u8865\u79cd\u65b0\u67f3\u6811' },
    { id: 'sa9', type: 'nursery', label: '\u8f6c\u5165\u82d7\u5703', date: formatDate(addDays(today, 5)), status: 'confirmed', note: '\u5df2\u786e\u8ba4\u8f6c\u5165\u82d7\u5703\u91cd\u65b0\u57f9\u80b2' },
  ], createdBy: 'c1', createdName: '\u738b\u4e3b\u4efb', createdDate: formatDate(addDays(today, -8)) },
];

export const transfers = [
  { id: 'tf1', adoptionId: 'a2', fromResidentId: 'r2', fromResidentName: '\u674e\u963f\u59e8', toResidentId: 'r4', toResidentName: '\u8d75\u5976\u5976', startDate: formatDate(addDays(today, -30)), endDate: formatDate(addDays(today, -15)), reason: '\u5916\u51fa\u63a2\u4eb2\uff0c\u4e34\u65f6\u8f6c\u517b', status: 'returned' },
];

export const residents = [
  { id: 'r1', name: '\u5f20\u5927\u7237', phone: '138****1234', address: '3\u53f7\u697c2\u5355\u5143501' },
  { id: 'r2', name: '\u674e\u963f\u59e8', phone: '139****5678', address: '5\u53f7\u697c1\u5355\u5143302' },
  { id: 'r3', name: '\u738b\u5c0f\u660e', phone: '137****9012', address: '1\u53f7\u697c3\u5355\u5143101' },
  { id: 'r4', name: '\u8d75\u5976\u5976', phone: '136****3456', address: '7\u53f7\u697c2\u5355\u5143403' },
];

export const greenkeepers = [
  { id: 'g1', name: '\u5218\u5e08\u5085', phone: '135****7890', status: 'onDuty', responsibleArea: '\u4e1c\u95e8\u7247\u533a\u3001\u5065\u8eab\u5e7f\u573a\u7247\u533a\u3001\u5317\u95e8\u7247\u533a' },
  { id: 'g2', name: '\u9648\u5e08\u5085', phone: '134****2345', status: 'onDuty', responsibleArea: '\u4e2d\u5fc3\u82b1\u56ed\u7247\u533a\u30011\u53f7\u697c\u7247\u533a\u3001\u5357\u95e8\u7247\u533a' },
];

export const committeeMembers = [
  { id: 'c1', name: '\u738b\u4e3b\u4efb', role: '\u5c45\u59d4\u4f1a\u4e3b\u4efb' },
  { id: 'c2', name: '\u674e\u59d4\u5458', role: '\u7eff\u5316\u59d4\u5458' },
];

export const users = {
  residents: [
    { id: 'r1', name: '\u5f20\u5927\u7237', avatar: '\u5f20', phone: '138****1234' },
    { id: 'r2', name: '\u674e\u963f\u59e8', avatar: '\u674e', phone: '139****5678' },
    { id: 'r3', name: '\u738b\u5c0f\u660e', avatar: '\u738b', phone: '137****9012' },
    { id: 'r4', name: '\u8d75\u5976\u5976', avatar: '\u8d75', phone: '136****3456' },
  ],
  greenkeepers: [
    { id: 'g1', name: '\u5218\u5e08\u5085', avatar: '\u5218', phone: '135****7890' },
    { id: 'g2', name: '\u9648\u5e08\u5085', avatar: '\u9648', phone: '134****2345' },
  ],
  committee: [
    { id: 'c1', name: '\u738b\u4e3b\u4efb', avatar: '\u738b', role: '\u5c45\u59d4\u4f1a\u4e3b\u4efb' },
    { id: 'c2', name: '\u674e\u59d4\u5458', avatar: '\u674e', role: '\u7eff\u5316\u59d4\u5458' },
  ],
};

export const roles = [
  { id: 'resident', name: '\u5c45\u6c11', description: '\u8ba4\u517b\u82d7\u6728\u3001\u67e5\u770b\u517b\u62a4\u8bb0\u5f55' },
  { id: 'greenkeeper', name: '\u7eff\u5316\u5458', description: '\u8bb0\u5f55\u6d47\u6c34\u65bd\u80a5\u3001\u67e5\u770b\u63d0\u9192' },
  { id: 'committee', name: '\u5c45\u59d4\u4f1a', description: '\u67e5\u770b\u6210\u6d3b\u7387\u3001\u76d1\u7763\u7ba1\u7406' },
];
