import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import SendMoney from "./pages/SendMoney";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="landing-page">

              <nav className="navbar">

                <Link to="/" className="brand">
                  <span className="brand-icon">F</span>
                  FinPay
                </Link>

                <div className="nav-links">
                  <a href="#features">Features</a>
                  <a href="#security">Security</a>
                  <a href="#about">About</a>
                </div>

                <div className="nav-actions">
                  <Link to="/login" className="nav-login">
                    Log in
                  </Link>

                  <Link to="/register" className="nav-register">
                    Get started
                  </Link>
                </div>

              </nav>

              <section className="hero">

                <div className="hero-content">

                  <div className="hero-badge">
                    <span></span>
                    SIMPLE. SECURE. FINANCIAL.
                  </div>

                  <h1>
                    Your money.
                    <br />
                    <span>Made simple.</span>
                  </h1>

                  <p>
                    FinPay is a modern digital wallet built to make
                    sending, receiving, and managing money effortless.
                  </p>

                  <div className="hero-actions">

                    <Link
                      to="/register"
                      className="primary-button"
                    >
                      Open your wallet
                      <span>→</span>
                    </Link>

                    <Link
                      to="/login"
                      className="secondary-button"
                    >
                      Sign in
                    </Link>

                  </div>

                  <div className="hero-trust">

                    <div className="trust-item">
                      <strong>₹</strong>
                      <span>INSTANT TRANSFERS</span>
                    </div>

                    <div className="trust-item">
                      <strong>✓</strong>
                      <span>SECURE PAYMENTS</span>
                    </div>

                    <div className="trust-item">
                      <strong>24/7</strong>
                      <span>ALWAYS AVAILABLE</span>
                    </div>

                  </div>

                </div>

                <div className="hero-card-wrapper">

                  <div className="wallet-preview">

                    <div className="wallet-preview-top">

                      <span>FINPAY WALLET</span>

                      <div className="wallet-chip">
                        ◈
                      </div>

                    </div>

                    <div className="wallet-preview-balance">
                      <span>AVAILABLE BALANCE</span>
                      <strong>₹24,850.00</strong>
                    </div>

                    <div className="wallet-preview-bottom">

                      <div>
                        <span>ACCOUNT</span>
                        <strong>PERSONAL</strong>
                      </div>

                      <div>
                        <span>CURRENCY</span>
                        <strong>INR</strong>
                      </div>

                    </div>

                  </div>

                  <div className="floating-card transaction-card">

                    <div className="floating-icon">
                      ↗
                    </div>

                    <div>
                      <span>TRANSFER</span>
                      <strong>₹2,500.00</strong>
                    </div>

                    <div className="transaction-success">
                      ✓
                    </div>

                  </div>

                  <div className="floating-card secure-card">

                    <div className="secure-icon">
                      ✓
                    </div>

                    <div>
                      <strong>Secure</strong>
                      <span>BCrypt protected</span>
                    </div>

                  </div>

                </div>

              </section>

              <section className="stats-section">

                <div className="stat">
                  <strong>₹1M+</strong>
                  <span>TRANSACTIONS PROCESSED</span>
                </div>

                <div className="stat">
                  <strong>99.9%</strong>
                  <span>SYSTEM AVAILABILITY</span>
                </div>

                <div className="stat">
                  <strong>24/7</strong>
                  <span>PAYMENT ACCESS</span>
                </div>

                <div className="stat">
                  <strong>100%</strong>
                  <span>TRANSACTION TRACKING</span>
                </div>

              </section>

              <section
                id="features"
                className="features-section"
              >

                <div className="section-heading">

                  <span>FEATURES</span>

                  <h2>
                    Everything you need
                    <br />
                    in one wallet.
                  </h2>

                  <p>
                    Designed around the things that matter most
                    when managing your money.
                  </p>

                </div>

                <div className="feature-grid">

                  <Link
                    to="/send-money"
                    className="feature-card"
                  >
                    <div className="feature-number">01</div>

                    <div className="feature-icon">
                      ↗
                    </div>

                    <h3>
                      Send money
                    </h3>

                    <p>
                      Transfer money instantly to another
                      FinPay wallet using a secure transaction
                      reference.
                    </p>

                    <span className="feature-arrow">
                      Explore →
                    </span>
                  </Link>

                  <Link
                    to="/wallet"
                    className="feature-card"
                  >
                    <div className="feature-number">02</div>

                    <div className="feature-icon">
                      ◈
                    </div>

                    <h3>
                      Smart wallet
                    </h3>

                    <p>
                      Add money, withdraw funds, and keep
                      track of your available wallet balance.
                    </p>

                    <span className="feature-arrow">
                      Explore →
                    </span>
                  </Link>

                  <Link
                    to="/transactions"
                    className="feature-card"
                  >
                    <div className="feature-number">03</div>

                    <div className="feature-icon">
                      ↻
                    </div>

                    <h3>
                      Track everything
                    </h3>

                    <p>
                      Every successful transaction is recorded
                      with its reference ID, amount, and status.
                    </p>

                    <span className="feature-arrow">
                      Explore →
                    </span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="feature-card"
                  >
                    <div className="feature-number">04</div>

                    <div className="feature-icon">
                      ⚡
                    </div>

                    <h3>
                      Built for speed
                    </h3>

                    <p>
                      Redis caching and Kafka event streaming
                      keep the platform responsive and scalable.
                    </p>

                    <span className="feature-arrow">
                      Explore →
                    </span>
                  </Link>

                </div>

              </section>

              <section
                id="security"
                className="security-section"
              >

                <div className="security-content">

                  <span>SECURITY FIRST</span>

                  <h2>
                    Your money deserves
                    <br />
                    serious protection.
                  </h2>

                  <p>
                    FinPay combines secure password hashing,
                    transactional database operations, and
                    event-driven architecture to protect and
                    process your financial activity.
                  </p>

                  <div className="security-points">

                    <div>
                      <strong>✓</strong>
                      <span>BCrypt password protection</span>
                    </div>

                    <div>
                      <strong>✓</strong>
                      <span>Atomic wallet transactions</span>
                    </div>

                    <div>
                      <strong>✓</strong>
                      <span>Unique transaction references</span>
                    </div>

                    <div>
                      <strong>✓</strong>
                      <span>Kafka event processing</span>
                    </div>

                  </div>

                </div>

                <div className="security-visual">

                  <div className="security-circle">
                    <div className="security-lock">
                      ✓
                    </div>
                  </div>

                  <span>
                    PROTECTED
                  </span>

                </div>

              </section>

              <section
                id="about"
                className="cta-section"
              >

                <div>

                  <span>
                    READY WHEN YOU ARE
                  </span>

                  <h2>
                    Start managing
                    <br />
                    money smarter.
                  </h2>

                </div>

                <Link
                  to="/register"
                  className="cta-button"
                >
                  Create your wallet →
                </Link>

              </section>

              <footer className="footer">

                <div className="footer-brand">

                  <Link to="/" className="brand">
                    <span className="brand-icon">F</span>
                    FinPay
                  </Link>

                  <p>
                    Modern digital wallet for modern payments.
                  </p>

                </div>

                <div className="footer-right">

                  <span>
                    Built with Java • Spring Boot • React
                  </span>

                  <span>
                    © 2026 FinPay
                  </span>

                </div>

              </footer>

            </div>
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Wallet */}
        <Route
          path="/wallet"
          element={<Wallet />}
        />

        {/* Send Money */}
        <Route
          path="/send-money"
          element={<SendMoney />}
        />

        {/* Transactions */}
        <Route
          path="/transactions"
          element={<Transactions />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;