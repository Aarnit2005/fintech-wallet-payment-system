import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Wallet.css";

const API_URL = "http://localhost:8081";

function Wallet() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("finpayUserId");
  const userName =
    localStorage.getItem("finpayName") || "Customer";

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadWallet();
  }, [userId, navigate]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/wallets/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load wallet."
        );
      }

      setWallet(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletAction = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setProcessing(true);

    const endpoint =
      action === "add"
        ? `${API_URL}/wallets/${userId}/add-money`
        : `${API_URL}/wallets/${userId}/withdraw`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Wallet operation failed."
        );
      }

      setWallet(data);

      setMessage(
        action === "add"
          ? `₹${Number(amount).toLocaleString("en-IN")} added successfully.`
          : `₹${Number(amount).toLocaleString("en-IN")} withdrawn successfully.`
      );

      setAmount("");
      setAction(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
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

      {/* SIDEBAR */}

      <aside className="sidebar">

        <Link to="/" className="dashboard-logo">
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
            className="sidebar-link active"
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
            className="sidebar-link"
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

      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              MY WALLET
            </p>

            <h1>
              Your wallet
            </h1>

            <p className="dashboard-subtitle">
              Manage your funds securely.
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
          <div className="wallet-message error">
            {error}
          </div>
        )}

        {message && (
          <div className="wallet-message success">
            {message}
          </div>
        )}

        {/* WALLET CARD */}

        <section className="wallet-layout">

          <div className="wallet-main-card">

            <div className="wallet-card-top">

              <span>
                FINPAY WALLET
              </span>

              <span>
                ◉
              </span>

            </div>

            <div className="wallet-card-label">
              Available balance
            </div>

            <div className="wallet-balance">

              {loading
                ? "Loading..."
                : formatCurrency(wallet?.balance)}

            </div>

            <div className="wallet-card-bottom">

              <div>
                <span>WALLET ID</span>
                <strong>
                  •••• {wallet?.id || "----"}
                </strong>
              </div>

              <div>
                <span>CURRENCY</span>
                <strong>
                  {wallet?.currency || "INR"}
                </strong>
              </div>

            </div>

          </div>

          <div className="wallet-actions">

            <button
              className="wallet-action primary-wallet-action"
              onClick={() => {
                setAction("add");
                setMessage("");
                setError("");
              }}
            >

              <div className="wallet-action-icon">
                +
              </div>

              <div>
                <strong>Add money</strong>
                <span>
                  Add funds to your wallet
                </span>
              </div>

              <b>→</b>

            </button>

            <button
              className="wallet-action"
              onClick={() => {
                setAction("withdraw");
                setMessage("");
                setError("");
              }}
            >

              <div className="wallet-action-icon">
                ↓
              </div>

              <div>
                <strong>Withdraw</strong>
                <span>
                  Withdraw available funds
                </span>
              </div>

              <b>→</b>

            </button>

            <Link
              to="/send-money"
              className="wallet-action"
            >

              <div className="wallet-action-icon">
                ↗
              </div>

              <div>
                <strong>Send money</strong>
                <span>
                  Transfer to another user
                </span>
              </div>

              <b>→</b>

            </Link>

          </div>

        </section>

        {/* ACTION FORM */}

        {action && (

          <section className="wallet-form-card">

            <div>

              <p className="dashboard-eyebrow">
                {action === "add"
                  ? "ADD FUNDS"
                  : "WITHDRAW FUNDS"}
              </p>

              <h2>
                {action === "add"
                  ? "Add money to wallet"
                  : "Withdraw from wallet"}
              </h2>

              <p>
                Enter the amount you want to
                {action === "add"
                  ? " add."
                  : " withdraw."}
              </p>

            </div>

            <form onSubmit={handleWalletAction}>

              <div className="amount-input">

                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  autoFocus
                  required
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setAction(null);
                    setAmount("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-wallet-button"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : action === "add"
                      ? "Add money"
                      : "Withdraw"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* INFORMATION */}

        <section className="wallet-info-grid">

          <div className="wallet-info-card">

            <span className="info-number">
              01
            </span>

            <h3>
              Secure wallet
            </h3>

            <p>
              Your wallet balance is securely
              stored and managed through the
              FinPay backend.
            </p>

          </div>

          <div className="wallet-info-card">

            <span className="info-number">
              02
            </span>

            <h3>
              Instant updates
            </h3>

            <p>
              Balance changes are reflected
              immediately after successful
              wallet operations.
            </p>

          </div>

          <div className="wallet-info-card">

            <span className="info-number">
              03
            </span>

            <h3>
              Full history
            </h3>

            <p>
              Every successful wallet operation
              is recorded in your transaction
              history.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Wallet;