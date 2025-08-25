import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PortfolioList from './pages/PortfolioList';
import PortfolioDetail from './pages/PortfolioDetail';
import AddPortfolio from './pages/AddPortfolio';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RequestForm from './pages/RequestForm';
import RequestList from './pages/RequestList';
import Calendar from './pages/Calendar';
import KayitOl from './pages/KayitOl';
import Profil from './pages/Profil';
import { AuthProvider } from './context/AuthContext';
import mockData from './data/db.json';
import './utils/fixLeafletIcon';
import './index.css';

// LocalStorage'dan veri okumayı daha güvenli hale getiren yardımcı fonksiyon
const getInitialState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    // Eğer hafızada kayıtlı bir veri varsa ve bu veri "[]" (boş dizi) DEĞİLSE, onu kullan.
    // Bu, tüm portföyleri silseniz bile, sayfayı yenilediğinizde test verilerinin geri gelmesini sağlar.
    if (saved && saved !== "[]" && saved !== "undefined") {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultValue;
    }
    // Hafıza boşsa veya boş bir dizi içeriyorsa, varsayılan veriyi (db.json) yükle.
    return defaultValue;
  } catch (error) {
    console.error(`'${key}' verisi okunurken hata oluştu:`, error);
    return defaultValue;
  }
};


function App() {
  const [properties, setProperties] = useState(() => getInitialState('properties', mockData.properties));
  const [requests, setRequests] = useState(() => getInitialState('requests', []));
  const [appointments, setAppointments] = useState(() => {
      const savedAppointments = getInitialState('appointments', []);
      return savedAppointments.map(app => ({...app, start: new Date(app.start), end: new Date(app.end)}));
  });

  useEffect(() => { localStorage.setItem('properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('appointments', JSON.stringify(appointments)); }, [appointments]);
  
  const handleDeletePortfolio = (id) => { if (window.confirm("Bu portföyü silmek istediğinizden emin misiniz?")) { setProperties(p => p.filter(item => item.id !== id)); }};
  
  const handleUpdatePortfolio = (updated) => { 
      const imagesAsArray = typeof updated.images === 'string' ? updated.images.split(',').map(img => img.trim()).filter(img => img) : updated.images;
      const portfolioToUpdate = { ...updated, id: parseInt(updated.id), images: imagesAsArray };
      setProperties(p => p.map(item => (item.id === portfolioToUpdate.id ? portfolioToUpdate : item))); 
  };

  const handleAddPortfolio = (newPortfolio) => { 
      const imagesAsArray = typeof newPortfolio.images === 'string' ? newPortfolio.images.split(',').map(img => img.trim()).filter(img => img) : newPortfolio.images;
      setProperties(p => [{ ...newPortfolio, id: Date.now(), images: imagesAsArray }, ...p]); 
  };

  const handleAddRequest = (newRequest) => { setRequests(r => [{ ...newRequest, id: Date.now(), status: 'Yeni' }, ...r]); };
  const handleUpdateRequestStatus = (id, status) => { setRequests(r => r.map(item => (item.id === id ? { ...item, status } : item))); };
  const handleDeleteRequest = (id) => { if (window.confirm("Bu talebi kalıcı olarak silmek istediğinizden emin misiniz?")) { setRequests(r => r.filter(item => item.id !== id)); } };
  const handleAddAppointment = (newAppointment) => { setAppointments(a => [...a, { ...newAppointment, id: Date.now() }]); };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<PortfolioList properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
            <Route path="/talep-et" element={<RequestForm onAddRequest={handleAddRequest} />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/kayit-ol" element={<KayitOl />} />
            
            <Route path="/profil" element={
              <ProtectedRoute>
                <Profil 
                  properties={properties} 
                  onDeletePortfolio={handleDeletePortfolio}
                />
              </ProtectedRoute>
            } />

            <Route path="/talepler" element={<ProtectedRoute><RequestList requests={requests} onUpdateRequestStatus={handleUpdateRequestStatus} onDeleteRequest={handleDeleteRequest} /></ProtectedRoute>} />
            <Route path="/takvim" element={<ProtectedRoute><Calendar appointments={appointments} onAddAppointment={handleAddAppointment} /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddPortfolio onAddPortfolio={handleAddPortfolio} /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><AddPortfolio properties={properties} onUpdatePortfolio={handleUpdatePortfolio} /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;