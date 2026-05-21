import { Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Home from '../pages/Home';
import CompanyDetail from '../pages/CompanyDetail';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/company/:id" element={<CompanyDetail />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
