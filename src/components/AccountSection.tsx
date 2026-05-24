'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

type SidebarView = 'account' | 'cart' | null;

export default function AccountSection() {
  const [sidebar, setSidebar] = useState<SidebarView>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('auth-user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }

    const handleAuthChange = () => {
      const s = sessionStorage.getItem('auth-user');
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const openSidebar = (view: SidebarView) => {
    setSidebar(sidebar === view ? null : view);
  };

  const closeSidebar = () => setSidebar(null);

  return (
    <>
      {/* Cart button */}
      <button
        id="cart-btn"
        className="fas fa-shopping-cart"
        aria-label="Cart"
        onClick={() => openSidebar('cart')}
      />

      {/* Account button */}
      <button
        id="account-btn"
        className="fas fa-user"
        aria-label="Account"
        onClick={() => openSidebar('account')}
      />

      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebar !== null ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div className={`account-sidebar sidebar-panel ${sidebar !== null ? 'active' : ''}`}>
        <div className="account-sidebar-header">
          <h3>{sidebar === 'cart' ? 'Shopping Cart' : 'My Account'}</h3>
          <button className="account-sidebar-close" onClick={closeSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ===== CART VIEW ===== */}
        {sidebar === 'cart' && (
          <div className="sidebar-cart-content">
            <p className="sidebar-cart-empty">Your cart is empty</p>
            <Link href="/products" className="sidebar-cart-shop-btn" onClick={closeSidebar}>
              Browse Products
            </Link>
          </div>
        )}

        {/* ===== ACCOUNT VIEW ===== */}
        {sidebar === 'account' && (
          <>
            {user ? (
              <>
                <div className="account-user-content">
                  <div className="account-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="account-user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="account-menu">
                  {user.isAdmin && (
                    <Link href="/admin" className="account-menu-item" onClick={closeSidebar}>
                      <div className="account-menu-icon">
                        <i className="fas fa-cog"></i>
                      </div>
                      <span>Admin Panel</span>
                      <i className="fas fa-chevron-right account-menu-arrow"></i>
                    </Link>
                  )}
                  <Link href="/order-confirmation" className="account-menu-item" onClick={closeSidebar}>
                    <div className="account-menu-icon">
                      <i className="fas fa-box"></i>
                    </div>
                    <span>My Orders</span>
                    <i className="fas fa-chevron-right account-menu-arrow"></i>
                  </Link>
                  <button className="account-menu-item" onClick={() => openSidebar('cart')}>
                    <div className="account-menu-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <span>Cart</span>
                    <i className="fas fa-chevron-right account-menu-arrow"></i>
                  </button>
                </div>

                <div className="account-sidebar-footer">
                  <button className="account-logout-btn" onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    sessionStorage.removeItem('auth-user');
                    window.dispatchEvent(new Event('auth-change'));
                    closeSidebar();
                  }}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="account-guest-content">
                  <div className="account-avatar account-avatar-guest">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <h4>Welcome, Guest!</h4>
                  <p>Sign in to access your orders and preferences</p>
                  <Link href="/login" className="account-login-btn" onClick={closeSidebar}>
                    <i className="fas fa-sign-in-alt"></i>
                    Login / Sign Up
                  </Link>
                </div>

                <div className="account-menu">
                  <button className="account-menu-item" onClick={() => openSidebar('cart')}>
                    <div className="account-menu-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <span>Cart</span>
                    <i className="fas fa-chevron-right account-menu-arrow"></i>
                  </button>
                  <Link href="/products" className="account-menu-item" onClick={closeSidebar}>
                    <div className="account-menu-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <span>Wishlist</span>
                    <i className="fas fa-chevron-right account-menu-arrow"></i>
                  </Link>
                  <Link href="/contact" className="account-menu-item" onClick={closeSidebar}>
                    <div className="account-menu-icon">
                      <i className="fas fa-headset"></i>
                    </div>
                    <span>Help & Support</span>
                    <i className="fas fa-chevron-right account-menu-arrow"></i>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
