import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Eğer kullanıcı doğrudan korumalı bir sayfaya gitmeye çalıştıysa,
  // giriş yaptıktan sonra o sayfaya yönlendirilir. Yoksa ana sayfaya.
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (auth.login(username, password)) {
      // Giriş başarılı olursa, kullanıcının gitmek istediği sayfaya yönlendir
      navigate(from, { replace: true });
    } else {
      // Hatalı giriş
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Armenkul Yönetici Paneli</h2>
        <p>Lütfen devam etmek için giriş yapın.</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;