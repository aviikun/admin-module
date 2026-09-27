import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import InspectionSchedule from './pages/InspectionSchedule';
import InspectionDetails from './pages/InspectionDetails';
import OnSiteInspection from './pages/OnSiteInspection';
import InspectionRecords from './pages/InspectionRecords';
import InspectionRecordDetail from './pages/InspectionRecordDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/schedule" replace />} />
        <Route path="/schedule" element={<InspectionSchedule />} />
        <Route path="/schedule/:id" element={<InspectionDetails />} />
        <Route path="/schedule/:id/onsite" element={<OnSiteInspection />} />
        <Route path="/records" element={<InspectionRecords />} />
        <Route path="/records/:id" element={<InspectionRecordDetail />} />
        <Route path="*" element={<Navigate to="/schedule" replace />} />
      </Route>
    </Routes>
  );
}
