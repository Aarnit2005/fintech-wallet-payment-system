import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SendMoney.css";

const API_URL = "http://localhost:8081";

function SendMoney() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

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

  const handleTransfer = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const receiver = Number(receiverId);
    const transferAmount = Number(amount);

    if (!receiverId || receiver <= 0) {
      setError("Enter a valid receiver user ID.");
      return;
    }

    if (receiver === Number(userId)) {
      setError("You cannot send money to yourself.");
      return;
    }

    if (!amount || transferAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (
      wallet &&
      transferAmount > Number(wallet.balance)
    ) {
      setError("Insufficient balance.");
      return;
    }

    setProcessing(true);

    const referenceId =
      `TXN-${Date.now()}`;

    try {
      const response = await fetch(
        `${API_URL}/wallets/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            senderUserId: userId,
            receiverUserId: receiverId,
            amount: amount,
            referenceId: referenceId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Transfer failed."
        );
      }

      setMessage(
        `₹${transferAmount.toLocaleString(
          "en-IN"
        )} sent successfully. Reference: ${data.referenceId}`
      );

      setReceiverId("");
      setAmount("");

      await loadWallet();

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
            className="sidebar-link active"
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

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              SEND MONEY
            </p>

            <h1>
              Send money
            </h1>

            <p className="dashboard-subtitle">
              Transfer funds securely to another FinPay user.
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
          <div className="send-message error">
            {error}
          </div>
        )}

        {message && (
          <div className="send-message success">
            {message}
          </div>
        )}

        <section className="send-money-layout">

          <div className="send-money-card">

            <div className="send-card-top">
              <span>FINPAY TRANSFER</span>
              <span>↗</span>
            </div>

            <div className="send-card-label">
              Available balance
            </div>

            <div className="send-card-balance">
              {loading
                ? "Loading..."
                : formatCurrency(wallet?.balance)}
            </div>

            <div className="send-card-footer">

              <div>
                <span>FROM WALLET</span>
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

          <div className="send-form-card">

            <div className="send-form-heading">

              <p className="dashboard-eyebrow">
                NEW TRANSFER
              </p>

              <h2>
                Send funds
              </h2>

              <p>
                Enter the receiver and amount below.
              </p>

            </div>

            <form onSubmit={handleTransfer}>

              <div className="send-form-group">

                <label htmlFor="receiverId">
                  Receiver User ID
                </label>

                <input
                  id="receiverId"
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={receiverId}
                  onChange={(event) =>
                    setReceiverId(event.target.value)
                  }
                  required
                />

                <span>
                  Enter the FinPay user's ID.
                </span>

              </div>

              <div className="send-form-group">

                <label htmlFor="transferAmount">
                  Amount
                </label>

                <div className="send-amount-input">

                  <span>₹</span>

                  <input
                    id="transferAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="send-submit-button"
                disabled={processing || loading}
              >
                {processing
                  ? "Processing transfer..."
                  : "Send money →"}
              </button>

            </form>

          </div>

        </section>

        <section className="send-info-grid">

          <div className="send-info-card">

            <span>01</span>

            <h3>
              Secure transfer
            </h3>

            <p>
              Transfers are processed by the FinPay
              backend with balance validation.
            </p>

          </div>

          <div className="send-info-card">

            <span>02</span>

            <h3>
              Transaction reference
            </h3>

            <p>
              Every transfer receives a unique reference
              for tracking and idempotency.
            </p>

          </div>

          <div className="send-info-card">

            <span>03</span>

            <h3>
              Real-time processing
            </h3>

            <p>
              Successful transfers update both wallets
              inside one database transaction.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default SendMoney;