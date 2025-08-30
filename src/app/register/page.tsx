'use client';

import { useState, useContext } from 'react';
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
  FaUser,
  FaBuilding,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/components/LoginForm.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    profile_type: 'student',
    first_name: '',
    surname: '',
    institution_name: '',
    institution_location: '',
    email: '',
    password: '',
    password_confirmation: '',
    accept_privacy_policy: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    if (!formData.accept_privacy_policy) {
      newErrors.accept_privacy_policy = 'You must accept the privacy policy';
    }
    
    if (formData.profile_type !== 'institution') {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.surname) newErrors.surname = 'Surname is required';
    } else {
      if (!formData.institution_name) newErrors.institution_name = 'Institution name is required';
      if (!formData.institution_location) newErrors.institution_location = 'Institution location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API call would go here in a real application
      console.log('Registration data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login?message=Registration successful. Please login.');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isInstitution = formData.profile_type === 'institution';

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
      
      {/* Left Panel - Welcome Content (Same as Login) */}
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

      {/* Right Panel - Register Form */}
      <div className={styles.loginPanel}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeaderContainer}>
            <h2 className={styles.loginHeader}>Create Your Account</h2>
            <p className={styles.loginSubheader}>Join us! Please enter your details to get started</p>
          </div>
          
          {/* <div className={styles.socialLogin}>
            <button 
              className={styles.socialButton}
              aria-label="Sign up with Google"
            >
              <FaGoogle className={styles.socialIcon} />
            </button>
            <button 
              className={styles.socialButton}
              aria-label="Sign up with Apple"
            >
              <FaApple className={styles.socialIcon} />
            </button>
            <button 
              className={styles.socialButton}
              aria-label="Sign up with Microsoft"
            >
              <FaMicrosoft className={styles.socialIcon} />
            </button>
          </div>
          
          <div className={styles.divider}>
            <span>or continue with email</span>
          </div> */}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputContainer}>
              <label htmlFor="profile_type" className={styles.inputLabel}>Account Type</label>
              <div className={styles.inputWrapper}>
                <select 
                  name="profile_type"
                  value={formData.profile_type}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="student">Student/Learner</option>
                  <option value="teacher">Teacher/Tutor</option>
                  <option value="institution">Institution/Company/School</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.profile_type && <span className={styles.errorText}>{errors.profile_type}</span>}
            </div>

            {!isInstitution ? (
              <>
                <div className={styles.inputContainer}>
                  <label htmlFor="first_name" className={styles.inputLabel}>First Name</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
                    />
                  </div>
                  {errors.first_name && <span className={styles.errorText}>{errors.first_name}</span>}
                </div>

                <div className={styles.inputContainer}>
                  <label htmlFor="surname" className={styles.inputLabel}>Surname</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      id="surname"
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="Enter your surname"
                      className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                    />
                  </div>
                  {errors.surname && <span className={styles.errorText}>{errors.surname}</span>}
                </div>
              </>
            ) : (
              <>
                <div className={styles.inputContainer}>
                  <label htmlFor="institution_name" className={styles.inputLabel}>Institution Name</label>
                  <div className={styles.inputWrapper}>
                    <FaBuilding className={styles.inputIcon} />
                    <input
                      id="institution_name"
                      type="text"
                      name="institution_name"
                      value={formData.institution_name}
                      onChange={handleChange}
                      placeholder="Enter institution name"
                      className={`${styles.input} ${errors.institution_name ? styles.inputError : ''}`}
                    />
                  </div>
                  {errors.institution_name && <span className={styles.errorText}>{errors.institution_name}</span>}
                </div>

                <div className={styles.inputContainer}>
                  <label htmlFor="institution_location" className={styles.inputLabel}>Institution Location</label>
                  <div className={styles.inputWrapper}>
                    <FaMapMarkerAlt className={styles.inputIcon} />
                    <input
                      id="institution_location"
                      type="text"
                      name="institution_location"
                      value={formData.institution_location}
                      onChange={handleChange}
                      placeholder="Enter institution location"
                      className={`${styles.input} ${errors.institution_location ? styles.inputError : ''}`}
                    />
                  </div>
                  {errors.institution_location && <span className={styles.errorText}>{errors.institution_location}</span>}
                </div>
              </>
            )}

            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  autoCapitalize="none"
                  autoComplete="email"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  autoComplete="new-password"
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

            <div className={styles.inputContainer}>
              <label htmlFor="password_confirmation" className={styles.inputLabel}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`${styles.input} ${errors.password_confirmation ? styles.inputError : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.eyeIcon}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password_confirmation && <span className={styles.errorText}>{errors.password_confirmation}</span>}
            </div>

            <div className={styles.optionsContainer}>
              <div className={styles.rememberMe}>
                <button
                  type="button"
                  className={styles.checkbox}
                  onClick={() => setFormData({...formData, accept_privacy_policy: !formData.accept_privacy_policy})}
                  aria-checked={formData.accept_privacy_policy}
                  role="checkbox"
                >
                  <div className={`${styles.checkboxInner} ${formData.accept_privacy_policy ? styles.checkboxChecked : ''}`}>
                    {formData.accept_privacy_policy && <FaCheck className={styles.checkIcon} />}
                  </div>
                  <span className={styles.checkboxText}>
                    I accept the <a href="/privacy-policy" target="_blank" className={styles.privacyLink}>Privacy Policy</a>
                  </span>
                </button>
              </div>
            </div>
            {errors.accept_privacy_policy && <span className={styles.errorText}>{errors.accept_privacy_policy}</span>}
            
            <button 
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.loader}></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className={styles.signupContainer}>
            <p className={styles.signupText}>
              Already have an account?{' '}
              <button 
                className={styles.signupLink} 
                onClick={() => router.push('/login')}
                type="button"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;