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
import SuperAdminRoute from './components/SuperAdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import mockData from './data/db.json';
import RequestList from './pages/RequestList';
import Calendar from './pages/Calendar';
import RequestForm from './pages/RequestForm';
import KayitOl from './pages/KayitOl';
import DemandPool from './pages/DemandPool';
import Abonelik from './pages/Abonelik';
import Paketler from './pages/Paketler';
import Odeme from './pages/Odeme';
import AdminPanel from './pages/AdminPanel';
import moment from 'moment';
import './utils/fixLeafletIcon';
import './index.css';

function AppContent() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState(mockData.properties);
  const [users, setUsers] = useState(mockData.users || []);
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

  const handleTogglePortfolioVisibility = (id) => {
    setProperties(prev => 
      prev.map(p => 
        p.id === id ? { ...p, isPublished: !p.isPublished } : p
      )
    );
  };
  
  const handleUpdateRequestStatus = (requestId, newStatus) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleExtendSubscription = (userId) => {
    if (window.confirm("Bu kullanıcının aboneliğini 1 ay uzatmak istediğinizden emin misiniz?")) {
        setUsers(prevUsers =>
            prevUsers.map(user => {
                if (user.id === userId && user.subscription) {
                    const newEndDate = moment(user.subscription.endDate).add(1, 'month').toISOString();
                    return { ...user, subscription: { ...user.subscription, status: 'active', endDate: newEndDate } };
                }
                return user;
            })
        );
        alert("Abonelik başarıyla uzatıldı.");
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bu kullanıcıyı ve tüm portföylerini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setProperties(prevProps => prevProps.filter(prop => prop.ownerId !== userId));
        alert("Kullanıcı ve portföyleri başarıyla silindi.");
    }
  };

  // --- DEĞİŞİKLİK 1: Portföy GÜNCELLEME fonksiyonu eklendi ---
  const handleUpdatePortfolio = (updatedPortfolio) => {
    setProperties(prevProperties => 
      prevProperties.map(p => 
        p.id === updatedPortfolio.id ? updatedPortfolio : p
      )
    );
  };

  const handleAddPortfolio = (newPortfolio) => {
    const newProperty = { ...newPortfolio, id: Date.now() };
    setProperties(prev => [newProperty, ...prev]);
  };

  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<PortfolioList properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
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
           <Route path="/profil/abonelik" element={<ProtectedRoute><Abonelik /></ProtectedRoute>} />
           <Route path="/paketler" element={<ProtectedRoute><Paketler /></ProtectedRoute>} />
           <Route path="/odeme/:paketAdi" element={<ProtectedRoute><Odeme /></ProtectedRoute>} />

          <Route path="/super-admin" element={
            <SuperAdminRoute>
              <AdminPanel 
                users={users} 
                onExtendSubscription={handleExtendSubscription} 
                onDeleteUser={handleDeleteUser} 
              />
            </SuperAdminRoute>
          } />
          
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
                onAddPortfolio={handleAddPortfolio} 
              />
            </ProtectedRoute>
          } />
          
           {/* --- DEĞİŞİKLİK 2: onUpdatePortfolio prop'u /edit/:id rotasına eklendi --- */}
           <Route path="/edit/:id" element={
            <ProtectedRoute>
              <AddPortfolio 
                  properties={properties} 
                  onUpdatePortfolio={handleUpdatePortfolio}
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