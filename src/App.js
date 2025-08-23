import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PortfolioList from './pages/PortfolioList';
import PortfolioDetail from './pages/PortfolioDetail';
import AddPortfolio from './pages/AddPortfolio';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import mockData from './data/db.json';
import './utils/fixLeafletIcon';
import './index.css';

function App() {
  const [properties, setProperties] = useState(mockData.properties);

  const handleDeletePortfolio = (portfolioId) => {
    if (window.confirm("Bu portföyü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      setProperties(prevProperties => prevProperties.filter(p => p.id !== portfolioId));
    }
  };

  const handleUpdatePortfolio = (updatedPortfolio) => {
    // Gelen resimler string ise diziye çevir, değilse dokunma
    const imagesAsArray = typeof updatedPortfolio.images === 'string'
      ? (updatedPortfolio.images || '').split(',').map(img => img.trim()).filter(img => img)
      : updatedPortfolio.images;

    const portfolioToUpdate = {
      ...updatedPortfolio,
      images: imagesAsArray
    };

    setProperties(prevProperties => 
      prevProperties.map(p => 
        p.id === portfolioToUpdate.id ? portfolioToUpdate : p
      )
    );
  };

  const handleAddPortfolio = (newPortfolio) => {
    const imagesAsArray = (newPortfolio.images || '')
      .split(',')
      .map(img => img.trim())
      .filter(img => img);

    const portfolioWithId = {
      ...newPortfolio,
      id: Date.now(),
      images: imagesAsArray,
    };
    
    setProperties([portfolioWithId, ...properties]);
  };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<PortfolioList properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail properties={properties} onDeletePortfolio={handleDeletePortfolio} />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route 
              path="/add" 
              element={
                <ProtectedRoute>
                  <AddPortfolio onAddPortfolio={handleAddPortfolio} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <AddPortfolio 
                    properties={properties}
                    onUpdatePortfolio={handleUpdatePortfolio}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
export default App;