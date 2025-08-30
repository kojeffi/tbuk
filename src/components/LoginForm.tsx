'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Error: Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        email: email.trim(),
        password: password,
      }).toString();

      const response = await axios.get(`https://tbooke.net/login/token?${queryParams}`);

      if (response.data && response.data.access_token) {
        const accessToken = response.data.access_token;
        saveToken(accessToken);
        router.push('/tbooke-learning');
      } else {
        alert('Login Failed: Invalid email or password. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('Login Failed: Incorrect email or password.');
        } else if (error.response.status === 400) {
          alert('Login Failed: ' + (error.response.data.message || 'Invalid request.'));
        } else {
          alert('Error: ' + (error.response.data.message || 'Something went wrong. Please try again.'));
        }
      } else if (error.request) {
        alert('Network Error: Please check your internet connection and try again.');
      } else {
        alert('Error: An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.welcomeTitle}>Welcome to Tbooke</h1>
        <p className={styles.welcomeText}>
          An Education-Centric Open Learning and Social Platform
        </p>
        <button
          className={styles.learnMoreButton}
          onClick={() => router.push('/about')}
        >
          Learn More
        </button>
      </div>

      <div className={styles.loginContainer}>
        <p className={styles.loginTitle}>
          Don't have an account?{' '}
          <span className={styles.signupLink} onClick={() => router.push('/register')}>
            Sign Up
          </span>
        </p>

        <p className={styles.signupPrompt}>Sign in to your account to continue</p>

        <form onSubmit={handleLogin}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Email</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                required
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeIcon}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.forgotPassword}
            onClick={() => router.push('/forgot-password')}
          >
            Forgot Password?
          </button>

          <div className={styles.checkboxContainer}>
            <button
              type="button"
              className={styles.checkbox}
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div className={`${styles.checkboxInner} ${rememberMe ? styles.checkboxChecked : ''}`}>
                {rememberMe && <FaCheck className={styles.checkIcon} />}
              </div>
              <span className={styles.checkboxText}>Remember me</span>
            </button>
          </div>
          
          <button 
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;