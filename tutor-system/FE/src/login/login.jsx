// src/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import bkLogo from '../assets/logobk.png'; 

const Login = () => {
  const navigate = useNavigate();

  // Dữ liệu tài khoản mẫu
  const ACCOUNTS = [
    { username: 'student1', password: '123', role: 'student' },
    { username: 'tutor1', password: '123', role: 'tutor' },
    { username: 'pdt1', password: '123', role: 'pdt' },
  ];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State cho ô tích lưu mật khẩu
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- 1. TỰ ĐỘNG ĐIỀN TÊN TÀI KHOẢN NẾU ĐÃ LƯU ---
  useEffect(() => {
    const savedUser = localStorage.getItem('savedUsername');
    if (savedUser) {
        setUsername(savedUser);
        setRememberMe(true); // Tự động tích vào ô lưu
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
        const foundUser = ACCOUNTS.find(
            acc => acc.username === username && acc.password === password
        );

        if (foundUser) {
            // --- 2. XỬ LÝ LƯU THÔNG TIN ---
            if (rememberMe) {
                localStorage.setItem('savedUsername', username);
            } else {
                localStorage.removeItem('savedUsername'); // Nếu bỏ tích thì xóa đi
            }

            // Chuyển hướng
            if (foundUser.role === 'student') {
                navigate('/student/dashboard');
            } else if (foundUser.role === 'tutor') {
                navigate('/tutor/dashboard');
            } else if (foundUser.role === 'pdt') {
                navigate('/pdt/homepage');
            } else {
                setError('Tài khoản chưa được cấp quyền.');
            }
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
        }
        setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
      setUsername('');
      setPassword('');
      setError('');
      // Không xóa rememberMe để tiện cho người dùng
  };

  return (
    <div className="page-wrapper">
        <header className="bk-header">
            <div className="header-content">
                <img src={bkLogo} alt="Logo BK" className="bk-logo" />
                <h1>DỊCH VỤ XÁC THỰC TẬP TRUNG</h1>
            </div>
        </header>

        <div className="main-container">
            <div className="login-card">
                <h2 className="form-header">Nhập thông tin tài khoản của bạn</h2>
                
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-msg">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Tên tài khoản</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="" /* Đã xóa chữ student1/pdt1 */
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="" /* Đã xóa gợi ý mật khẩu */
                        />
                    </div>

                    {/* --- 3. Ô TÍCH LƯU THÔNG TIN --- */}
                    <div className="form-check">
                        <input 
                            type="checkbox" 
                            id="remember-check" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-check">Lưu thông tin đăng nhập</label>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="btn btn-login" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                        <button type="button" className="btn btn-reset" onClick={handleReset} disabled={isLoading}>
                            Xóa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;