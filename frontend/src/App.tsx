import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import ViewReports from './pages/ViewReports';

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/reports" element={<ViewReports />} />
          <Route path="/dashboard/:reportId" element={<Dashboard />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;
