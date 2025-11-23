/**
 * Main App Component
 * Sets up routing for the PFC Ticketing System
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Submit from './pages/Submit';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Default route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - executive view */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Submit - ticket intake form */}
          <Route path="/submit" element={<Submit />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
