'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Changed import

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname instead of router.pathname

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]); // Use pathname instead of router.pathname

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'fa-home' },
    { name: 'My Network', path: '/network', icon: 'fa-user-friends' },
    { name: 'Jobs', path: '/jobs', icon: 'fa-briefcase' },
    { name: 'Messaging', path: '/messaging', icon: 'fa-comment-dots' },
    { name: 'Notifications', path: '/notifications', icon: 'fa-bell' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-container">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">Tbooke</span>
            </Link>
          </div>
          
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" />
          </div>
          
          <div className="nav-links">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <div className={`nav-item ${pathname === item.path ? 'active' : ''}`}>
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
            
            <div className="profile-nav">
              <div className="profile-img">
                <img src="/avatar.png" alt="Profile" />
              </div>
              <span>Me <i className="fas fa-caret-down"></i></span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-container">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">LinkedIn</span>
            </Link>
          </div>
          
          <div className="mobile-nav-items">
            <button className="menu-button" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Sidebar Menu */}
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <div className={`sidebar-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-header">
          <div className="profile-section">
            <div className="profile-img">
              <img src="/avatar.png" alt="Profile" />
            </div>
            <div className="profile-info">
              <h3>John Doe</h3>
              <p>View profile</p>
            </div>
          </div>
          <button className="close-menu" onClick={toggleMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="menu-items">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <div className={`menu-item ${pathname === item.path ? 'active' : ''}`}>
                <i className={`fas ${item.icon}`}></i>
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
          
          <div className="menu-divider"></div>
          
          <div className="menu-item">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </div>
          <div className="menu-item">
            <i className="fas fa-info-circle"></i>
            <span>About Us</span>
          </div>
          <div className="menu-item">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Common Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .desktop-nav, .mobile-nav {
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        /* Desktop Navigation */
        .desktop-nav {
          display: none;
          padding: 10px 0;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo-text {
          font-size: 28px;
          font-weight: bold;
          color: #0a66c2;
          cursor: pointer;
        }
        
        .search-bar {
          flex-grow: 1;
          max-width: 280px;
          margin: 0 20px;
          position: relative;
        }
        
        .search-bar input {
          width: 100%;
          padding: 8px 15px 8px 40px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          background-color: #eef3f8;
          font-size: 14px;
        }
        
        .search-bar i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .nav-links {
          display: flex;
          align-items: center;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 10px;
          padding: 5px 10px;
          color: #666;
          text-decoration: none;
          font-size: 12px;
          cursor: pointer;
        }
        
        .nav-item i {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        .nav-item.active {
          color: #000;
        }
        
        .nav-item.active i {
          color: #0a66c2;
        }
        
        .profile-nav {
          display: flex;
          align-items: center;
          margin-left: 15px;
          padding-left: 15px;
          border-left: 1px solid #e0e0e0;
          cursor: pointer;
        }
        
        .profile-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }
        
        .profile-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Mobile Navigation */
        .mobile-nav {
          display: flex;
          padding: 12px 0;
        }
        
        .mobile-nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }
        
        .mobile-nav-items {
          display: flex;
        }
        
        .menu-button {
          background: none;
          border: none;
          font-size: 20px;
          color: #666;
          cursor: pointer;
        }
        
        /* Sidebar Menu */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .sidebar-menu {
          position: fixed;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100%;
          background-color: #fff;
          z-index: 1001;
          overflow-y: auto;
          transition: left 0.3s ease;
        }
        
        .sidebar-menu.active {
          left: 0;
        }
        
        .menu-header {
          padding: 20px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .profile-section {
          display: flex;
          align-items: center;
          flex-grow: 1;
        }
        
        .profile-section .profile-img {
          width: 50px;
          height: 50px;
          margin-right: 15px;
        }
        
        .profile-info h3 {
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .profile-info p {
          font-size: 14px;
          color: #666;
        }
        
        .close-menu {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
        }
        
        .menu-items {
          padding: 15px 0;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #333;
          text-decoration: none;
          font-size: 16px;
          cursor: pointer;
        }
        
        .menu-item i {
          margin-right: 15px;
          font-size: 20px;
          width: 24px;
          text-align: center;
        }
        
        .menu-item.active {
          color: #0a66c2;
          background-color: #f0f7ff;
        }
        
        .menu-item:hover {
          background-color: #f3f2ef;
        }
        
        .menu-divider {
          height: 8px;
          background-color: #f3f2ef;
          margin: 10px 0;
        }
        
        /* Responsive Styles */
        @media (min-width: 768px) {
          .desktop-nav {
            display: block;
          }
          
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;