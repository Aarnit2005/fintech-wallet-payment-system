import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:8081";

function Dashboard() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("finpayUserId");
  const userName = localStorage.getItem("finpayName") || "Customer";

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [userId, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [walletResponse, transactionResponse] =
        await Promise.all([
          fetch(`${API_URL}/wallets/user/${userId}`),
          fetch(`${API_URL}/wallets/${userId}/transactions`)
        ]);

      if (!walletResponse.ok) {
        throw new Error("Unable to load wallet.");
      }

      if (!transactionResponse.ok) {
        throw new Error("Unable to load transactions.");
      }

      const walletData = await walletResponse.json();
      const transactionData = await transactionResponse.json();

      setWallet(walletData);
      setTransactions(transactionData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("finpayUserId");
    localStorage.removeItem("finpayName");
    localStorage.removeItem("finpayEmail");

    navigate("/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionLabel = (transaction) => {
    if (transaction.type === "TRANSFER") {
      if (transaction.senderWalletId === wallet?.id) {
        return `Transfer to Wallet #${transaction.receiverWalletId}`;
      }

      return `Received from Wallet #${transaction.senderWalletId}`;
    }

    if (transaction.type === "ADD_MONEY") {
      return "Money added";
    }

    if (transaction.type === "WITHDRAW") {
      return "Cash withdrawal";
    }

    return transaction.type;
  };

  const isOutgoing = (transaction) => {
    if (!wallet) {
      return false;
    }

    return (
      transaction.senderWalletId === wallet.id ||
      transaction.type === "WITHDRAW"
    );
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
            className="sidebar-link active"
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
              FINANCIAL OVERVIEW
            </p>

            <h1>
              Good to see you, {userName.split(" ")[0]}.
            </h1>

            <p className="dashboard-subtitle">
              Here's what's happening with your money.
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
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* BALANCE CARDS */}

        <section className="dashboard-cards">

          <div className="balance-main-card">

            <div className="balance-card-header">
              <span>Available balance</span>

              <button className="more-button">
                •••
              </button>
            </div>

            <div className="main-balance">

              {loading
                ? "Loading..."
                : formatCurrency(wallet?.balance || 0)}

            </div>

            <div className="balance-account">
              <span>Wallet account</span>

              <strong>
                •••• {wallet?.id || "----"}
              </strong>
            </div>

            <div className="balance-card-footer">

              <span>
                Currency
              </span>

              <strong>
                {wallet?.currency || "INR"}
              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ↗
            </div>

            <span className="stat-label">
              Money received
            </span>

            <strong>
              {formatCurrency(
                transactions
                  .filter(
                    (transaction) =>
                      !isOutgoing(transaction)
                  )
                  .reduce(
                    (total, transaction) =>
                      total +
                      Number(transaction.amount),
                    0
                  )
              )}
            </strong>

            <span className="stat-description">
              Total incoming
            </span>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ↙
            </div>

            <span className="stat-label">
              Money sent
            </span>

            <strong>
              {formatCurrency(
                transactions
                  .filter(
                    (transaction) =>
                      isOutgoing(transaction)
                  )
                  .reduce(
                    (total, transaction) =>
                      total +
                      Number(transaction.amount),
                    0
                  )
              )}
            </strong>

            <span className="stat-description">
              Total outgoing
            </span>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="quick-actions">

          <div className="section-title-row">

            <div>
              <h2>Quick actions</h2>
              <p>
                Manage your money instantly.
              </p>
            </div>

          </div>

          <div className="action-grid">

            <Link
              to="/wallet"
              className="action-card"
            >
              <div className="action-icon">
                +
              </div>

              <div>
                <strong>Add money</strong>
                <span>
                  Add funds to your wallet
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

            <Link
              to="/send-money"
              className="action-card"
            >
              <div className="action-icon">
                ↗
              </div>

              <div>
                <strong>Send money</strong>
                <span>
                  Transfer to another user
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

            <Link
              to="/wallet"
              className="action-card"
            >
              <div className="action-icon">
                ↓
              </div>

              <div>
                <strong>Withdraw</strong>
                <span>
                  Withdraw from your wallet
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

          </div>

        </section>

        {/* TRANSACTIONS */}

        <section className="transactions-section">

          <div className="section-title-row">

            <div>
              <h2>Recent transactions</h2>
              <p>
                Your latest wallet activity.
              </p>
            </div>

            <Link
              to="/transactions"
              className="view-all"
            >
              View all →
            </Link>

          </div>

          <div className="transaction-table">

            <div className="transaction-header">
              <span>Transaction</span>
              <span>Reference</span>
              <span>Date</span>
              <span>Status</span>
              <span>Amount</span>
            </div>

            {loading ? (

              <div className="empty-transactions">
                Loading transactions...
              </div>

            ) : transactions.length === 0 ? (

              <div className="empty-transactions">
                No transactions yet.
              </div>

            ) : (

              transactions
                .slice()
                .reverse()
                .slice(0, 5)
                .map((transaction) => (

                  <div
                    className="transaction-row"
                    key={transaction.id}
                  >

                    <div className="transaction-name">

                      <div
                        className={
                          isOutgoing(transaction)
                            ? "transaction-icon outgoing"
                            : "transaction-icon incoming"
                        }
                      >
                        {isOutgoing(transaction)
                          ? "↗"
                          : "↙"}
                      </div>

                      <div>
                        <strong>
                          {getTransactionLabel(
                            transaction
                          )}
                        </strong>

                        <span>
                          {transaction.type}
                        </span>
                      </div>

                    </div>

                    <span className="transaction-reference">
                      {transaction.referenceId}
                    </span>

                    <span className="transaction-date">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleDateString("en-IN")}
                    </span>

                    <span className="transaction-status">
                      {transaction.status}
                    </span>

                    <strong
                      className={
                        isOutgoing(transaction)
                          ? "amount outgoing"
                          : "amount incoming"
                      }
                    >
                      {isOutgoing(transaction)
                        ? "-"
                        : "+"}
                      {formatCurrency(
                        transaction.amount
                      )}
                    </strong>

                  </div>

                ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;