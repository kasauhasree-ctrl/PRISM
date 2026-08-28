import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Overview } from './pages/Overview';
import { Runtime } from './pages/Runtime';
import { Policies } from './pages/Policies';
import { Interventions } from './pages/Interventions';
import { FlightRecorder } from './pages/FlightRecorder';
import { Agents } from './pages/Agents';
import { Integrity } from './pages/Integrity';
import { Evaluation } from './pages/Evaluation';
import { Login } from './pages/Login';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth><AppShell><Outlet /></AppShell></RequireAuth>}>
          <Route path="/" element={<Overview />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/runtime" element={<Runtime />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/flight-recorder" element={<FlightRecorder />} />
          <Route path="/integrity" element={<Integrity />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
