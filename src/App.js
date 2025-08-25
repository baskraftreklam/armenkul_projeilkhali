import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PortfolioList from './pages/PortfolioList';
import PortfolioDetail from './pages/PortfolioDetail';
import AddPortfolio from './pages/AddPortfolio';
import LoginPage from './pages/LoginPage';
import Profil from './pages/Profil';
import EditProfile from './pages/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import mockData from './data/db.json';
import RequestList from './pages/RequestList';
import Calendar from './pages/Calendar';
import RequestForm from './pages/RequestForm';
import KayitOl from './pages/KayitOl';
import DemandPool from './pages/DemandPool';
import './utils/fixLeafletIcon';
import './index.css';

function AppContent() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState(mockData.properties);
  const [users] = useState(mockData.users || []); // Kullanıcıları state'e al
  const [requests, setRequests] = useState(mockData.requests || []);
  const [appointments, setAppointments] = useState(mockData.appointments || []);

  const handleDeletePortfolio = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };
  
  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, { ...newAppointment, id: Date.now() }]);
  };

  const handleAddRequest = (newRequestData) => {
    const requestWithId = { 
      ...newRequestData, 
      id: Date.now(), 
      status: 'Yeni',
      agentId: currentUser ? currentUser.id : null,
      agentName: currentUser ? currentUser.name : 'Misafir',
      agentPicture: currentUser ? currentUser.profilePicture : null,
      agentPhone: currentUser ? currentUser.phone : null,
      agentOfficeName: currentUser ? currentUser.officeName : null
    };
    setRequests(prev => [requestWithId, ...prev]);
  };

  const handleUpdateRequestStatus = (requestId, newStatus) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleTogglePortfolioVisibility = (id) => {
    setProperties(prev => 
      prev.map(p => 
        p.id === id ? { ...p, isPublished: !p.isPublished } : p
      )
    );
  };

  const onUpdatePortfolio = (updated) => { /* Henüz tanımlanmamış */ };
  const onAddPortfolio = (newPortfolio) => { /* Henüz tanımlanmamış */ };

  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<PortfolioList properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
          {/* --- DEĞİŞİKLİK: Portföy detay sayfasına kullanıcı listesi gönderiliyor --- */}
          <Route path="/portfolio/:id" element={<PortfolioDetail properties={properties} users={users} />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/talep-et" element={<RequestForm onAddRequest={handleAddRequest} />} />
          <Route path="/kayit-ol" element={<KayitOl />} />
          
          <Route path="/profil" element={
            <ProtectedRoute>
              <Profil 
                properties={properties} 
                 onDeletePortfolio={handleDeletePortfolio}
                onToggleVisibility={handleTogglePortfolioVisibility}
              />
            </ProtectedRoute>
          } />
          
           <Route path="/profil/duzenle" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/talepler" element={<ProtectedRoute><RequestList requests={requests} properties={properties} onUpdateRequestStatus={handleUpdateRequestStatus} /></ProtectedRoute>} />

          <Route path="/talep-havuzu" element={
            <ProtectedRoute>
              <DemandPool requests={requests} properties={properties} />
            </ProtectedRoute>
          } />

          <Route path="/takvim" element={<ProtectedRoute><Calendar appointments={appointments} onAddAppointment={handleAddAppointment} /></ProtectedRoute>} />
          
          <Route path="/add" element={
            <ProtectedRoute>
               <AddPortfolio 
                onAddPortfolio={onAddPortfolio} 
              />
            </ProtectedRoute>
          } />
          
           <Route path="/edit/:id" element={
            <ProtectedRoute>
              <AddPortfolio 
                  properties={properties} 
                  onUpdatePortfolio={onUpdatePortfolio}
                   onDeletePortfolio={handleDeletePortfolio}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;