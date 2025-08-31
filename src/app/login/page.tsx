'use client';

import { useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '@/components/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaGoogle, 
  FaApple, 
  FaMicrosoft, 
  FaGooglePlay, 
  FaApple as FaAppStore 
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/components/LoginForm.module.css';

// Define error state type
interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Get auth context with proper type checking
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { saveToken } = authContext;
  
  const router = useRouter();

  // Validate form inputs
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        email: email.trim(),
        password: password,
      }).toString();

      const response = await axios.get(`https://tbooke.net/login/token?${queryParams}`, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data?.access_token) {
        const accessToken = response.data.access_token;
        saveToken(accessToken);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/tbooke-learning');
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (error.response) {
        if (error.response.status === 401) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Invalid request. Please check your inputs.');
        } else if (error.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Left Panel - Welcome Content */}
      <div className={styles.welcomePanel}>
        <div className={styles.welcomeContent}>
          <div className={styles.logoContainer}>
            <h1 className={styles.welcomeTitle}>Welcome to Tbooke</h1>
          </div>
          <p className={styles.welcomeText}>
            An Education-Centric Open Learning and Social Platform.
          </p>
          
          <div className={styles.buttonGroup}>
            <button
              className={styles.learnMoreButton}
              onClick={() => router.push('/about')}
            >
              Learn More
            </button>
            
            <div className={styles.appDownload}>
              <p className={styles.downloadText}>Download our app</p>
              <div className={styles.storeButtons}>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.olie.tbooke&pcampaignid=web_share" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeLink}
                  aria-label="Download Tbooke from Google Play"
                >
                  <div className={styles.storeButton}>
                    <FaGooglePlay className={styles.storeIcon} />
                    <div className={styles.storeText}>
                      <span className={styles.getOn}>GET IT ON</span>
                      <span className={styles.storeName}>Google Play</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={styles.loginPanel}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeaderContainer}>
            <h2 className={styles.loginHeader}>Sign In to Your Account</h2>
            <p className={styles.loginSubheader}>Welcome back! Please enter your details</p>
          </div>
          
          {/* <div className={styles.socialLogin}>
            <button 
              className={styles.socialButton}
              aria-label="Sign in with Google"
            >
              <FaGoogle className={styles.socialIcon} />
            </button>
            <button 
              className={styles.socialButton}
              aria-label="Sign in with Apple"
            >
              <FaApple className={styles.socialIcon} />
            </button>
            <button 
              className={styles.socialButton}
              aria-label="Sign in with Microsoft"
            >
              <FaMicrosoft className={styles.socialIcon} />
            </button>
          </div>
          
          <div className={styles.divider}>
            <span>or continue with email</span>
          </div> */}

          <form onSubmit={handleLogin} className={styles.form} noValidate>
            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({...prev, email: ''}));
                    }
                  }}
                  autoCapitalize="none"
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.inputLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({...prev, password: ''}));
                    }
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeIcon}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.optionsContainer}>
              <div className={styles.rememberMe}>
                <button
                  type="button"
                  className={styles.checkbox}
                  onClick={() => setRememberMe(!rememberMe)}
                  aria-checked={rememberMe}
                  role="checkbox"
                >
                  <div className={`${styles.checkboxInner} ${rememberMe ? styles.checkboxChecked : ''}`}>
                    {rememberMe && <FaCheck className={styles.checkIcon} />}
                  </div>
                  <span className={styles.checkboxText}>Remember me</span>
                </button>
              </div>
              
              <button
                type="button"
                className={styles.forgotPassword}
                onClick={() => router.push('/forgot-password')}
              >
                Forgot Password?
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

          <div className={styles.signupContainer}>
            <p className={styles.signupText}>
              Don't have an account?{' '}
              <button 
                className={styles.signupLink} 
                onClick={() => router.push('/register')}
                type="button"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;