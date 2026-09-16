import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://localhost:8081";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("finpayUserId");
  const userName =
    localStorage.getItem("finpayName") || "Customer";

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, [userId, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, walletResponse] =
        await Promise.all([
          fetch(`${API_URL}/users/${userId}`),
          fetch(`${API_URL}/wallets/user/${userId}`)
        ]);

      const userData = await userResponse.json();
      const walletData = await walletResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.message || "Unable to load profile."
        );
      }

      if (!walletResponse.ok) {
        throw new Error(
          walletData.message || "Unable to load wallet."
        );
      }

      setUser(userData);
      setWallet(walletData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("finpayUserId");
    localStorage.removeItem("finpayName");
    localStorage.removeItem("finpayEmail");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <Link
          to="/"
          className="dashboard-logo"
        >
          <span className="logo-icon">F</span>
          FinPay
        </Link>

        <div className="sidebar-section">

          <span className="sidebar-title">
            MAIN MENU
          </span>

          <Link
            to="/dashboard"
            className="sidebar-link"
          >
            <span>⌂</span>
            Overview
          </Link>

          <Link
            to="/wallet"
            className="sidebar-link"
          >
            <span>◈</span>
            My Wallet
          </Link>

          <Link
            to="/send-money"
            className="sidebar-link"
          >
            <span>↗</span>
            Send Money
          </Link>

          <Link
            to="/transactions"
            className="sidebar-link"
          >
            <span>↻</span>
            Transactions
          </Link>

        </div>

        <div className="sidebar-section">

          <span className="sidebar-title">
            ACCOUNT
          </span>

          <Link
            to="/profile"
            className="sidebar-link active"
          >
            <span>○</span>
            Profile
          </Link>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-security">

            <div className="security-check">
              ✓
            </div>

            <div>
              <strong>Secure account</strong>
              <span>Protected by FinPay</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              ACCOUNT SETTINGS
            </p>

            <h1>
              Your profile
            </h1>

            <p className="dashboard-subtitle">
              Manage your FinPay account information.
            </p>

          </div>

          <div className="profile-mini">

            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{userName}</strong>
              <span>Personal account</span>
            </div>

          </div>

        </header>

        {error && (
          <div className="profile-message error">
            {error}
          </div>
        )}

        <section className="profile-layout">

          <div className="profile-main-card">

            <div className="profile-main-header">

              <div className="large-profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>

                <span className="profile-label">
                  FINPAY CUSTOMER
                </span>

                <h2>
                  {loading
                    ? "Loading..."
                    : user?.name}
                </h2>

                <p>
                  {user?.email || "Loading email..."}
                </p>

              </div>

            </div>

            <div className="profile-divider"></div>

            <div className="profile-details">

              <div className="profile-detail">

                <span>
                  FULL NAME
                </span>

                <strong>
                  {loading
                    ? "Loading..."
                    : user?.name}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {loading
                    ? "Loading..."
                    : user?.email}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  USER ID
                </span>

                <strong>
                  #{user?.id || "--"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  Personal
                </strong>

              </div>

            </div>

          </div>

          <div className="profile-wallet-card">

            <div className="profile-wallet-icon">
              ◈
            </div>

            <span className="profile-label">
              WALLET
            </span>

            <h3>
              {loading
                ? "Loading..."
                : formatCurrency(wallet?.balance)}
            </h3>

            <p>
              Available balance
            </p>

            <div className="profile-wallet-meta">

              <div>
                <span>
                  WALLET ID
                </span>

                <strong>
                  #{wallet?.id || "--"}
                </strong>
              </div>

              <div>
                <span>
                  CURRENCY
                </span>

                <strong>
                  {wallet?.currency || "INR"}
                </strong>
              </div>

            </div>

            <Link
              to="/wallet"
              className="profile-wallet-button"
            >
              Manage wallet →
            </Link>

          </div>

        </section>

        <section className="profile-security-section">

          <div className="profile-security-heading">

            <div className="profile-security-icon">
              ✓
            </div>

            <div>

              <p className="dashboard-eyebrow">
                SECURITY
              </p>

              <h2>
                Your account is protected
              </h2>

              <p>
                FinPay uses secure authentication and
                encrypted password storage to protect
                your account information.
              </p>

            </div>

          </div>

          <div className="profile-security-items">

            <div>

              <strong>
                ✓
              </strong>

              <div>
                <span>
                  PASSWORD
                </span>

                <p>
                  Encrypted with BCrypt
                </p>
              </div>

            </div>

            <div>

              <strong>
                ✓
              </strong>

              <div>
                <span>
                  TRANSACTIONS
                </span>

                <p>
                  Database protected
                </p>
              </div>

            </div>

            <div>

              <strong>
                ✓
              </strong>

              <div>
                <span>
                  WALLET
                </span>

                <p>
                  Secure balance management
                </p>
              </div>

            </div>

          </div>

        </section>

        <section className="profile-actions">

          <Link
            to="/dashboard"
            className="profile-action-button secondary"
          >
            ← Back to dashboard
          </Link>

          <button
            className="profile-action-button danger"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </section>

      </main>

    </div>
  );
}

export default Profile;