import { AppProvider } from './context/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TreeList from './pages/TreeList';
import TreeDetail from './pages/TreeDetail';
import MyAdoptions from './pages/MyAdoptions';
import Maintenance from './pages/Maintenance';
import Statistics from './pages/Statistics';
import Reminders from './pages/Reminders';
import RoleSelect from './pages/RoleSelect';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path='/' element={<RoleSelect/>} />
          <Route path='/app' element={<Layout />}>
            <Route index element={<TreeList />} />
            <Route path='tree/:id' element={<TreeDetail />} />
            <Route path='my-adoptions' element={<MyAdoptions />} />
            <Route path='maintenance' element={<Maintenance />} />
            <Route path='statistics' element={<Statistics />} />
            <Route path='reminders' element={<Reminders />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
