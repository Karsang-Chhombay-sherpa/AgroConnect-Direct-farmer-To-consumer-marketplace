import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  const [user, setUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }
    
    checkUser()
    
    // Listen for storage changes (when user logs in from another tab/window)
    window.addEventListener('storage', checkUser)
    
    // Also check when window gains focus (in case user logged in in same window)
    window.addEventListener('focus', checkUser)
    
    return () => {
      window.removeEventListener('storage', checkUser)
      window.removeEventListener('focus', checkUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setShowPopup(false)
    window.location.href = "/"
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#22c55e"/>
              <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.logoText}>FarmFresh</span>
        </div>
        
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Marketplace</a>
          <a href="#" className={styles.navLink}>Subscription</a>
          <a href="#" className={styles.navLink}>Recipes</a>
          <a href="#" className={styles.navLink}>About</a>
        </nav>
        
        <div className={styles.authButtons}>
          {user ? (
            <div className={styles.profileContainer}>
              <button 
                className={styles.profileBtn}
                onClick={() => {
                  const userData = localStorage.getItem("user")
                  if (userData) {
                    setUser(JSON.parse(userData))
                  }
                  setShowPopup(!showPopup)
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="#22c55e" strokeWidth="2" fill="none"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#22c55e" strokeWidth="2" fill="none"/>
                </svg>
              </button>
              {showPopup && (
                <>
                  <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}></div>
                  <div className={styles.profilePopup}>
                    <div className={styles.popupContent}>
                      <div className={styles.profileInfo}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Name:</span>
                          <span className={styles.infoValue}>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Email:</span>
                          <span className={styles.infoValue}>{user.email}</span>
                        </div>
                      </div>
                      <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
          <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
