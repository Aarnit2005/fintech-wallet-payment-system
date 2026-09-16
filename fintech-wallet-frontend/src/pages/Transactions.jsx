import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Transactions.css";

const API_URL = "http://localhost:8081";

function Transactions() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

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

    loadTransactions();
  }, [userId, navigate]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const [walletResponse, transactionResponse] =
        await Promise.all([
          fetch(`${API_URL}/wallets/user/${userId}`),
          fetch(`${API_URL}/wallets/${userId}/transactions`)
        ]);

      const walletData = await walletResponse.json();
      const transactionData = await transactionResponse.json();

      if (!walletResponse.ok) {
        throw new Error(
          walletData.message || "Unable to load wallet."
        );
      }

      if (!transactionResponse.ok) {
        throw new Error(
          transactionData.message ||
          "Unable to load transactions."
        );
      }

      setWallet(walletData);
      setTransactions(transactionData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const getTransactionTitle = (transaction) => {
    if (transaction.type === "TRANSFER") {

      if (
        transaction.senderWalletId === wallet?.id
      ) {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
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
            className="sidebar-link active"
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
              TRANSACTION HISTORY
            </p>

            <h1>
              Transactions
            </h1>

            <p className="dashboard-subtitle">
              A complete record of your wallet activity.
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
          <div className="transactions-message error">
            {error}
          </div>
        )}

        <section className="transaction-summary">

          <div className="transaction-balance-card">

            <span>
              CURRENT BALANCE
            </span>

            <strong>
              {loading
                ? "Loading..."
                : formatCurrency(wallet?.balance)}
            </strong>

            <small>
              Wallet #{wallet?.id || "--"}
            </small>

          </div>

          <div className="transaction-summary-card">

            <span>
              TOTAL TRANSACTIONS
            </span>

            <strong>
              {transactions.length}
            </strong>

            <small>
              Recorded activities
            </small>

          </div>

          <div className="transaction-summary-card">

            <span>
              ACCOUNT CURRENCY
            </span>

            <strong>
              {wallet?.currency || "INR"}
            </strong>

            <small>
              Indian Rupee
            </small>

          </div>

        </section>

        <section className="all-transactions">

          <div className="transactions-heading">

            <div>
              <h2>
                All transactions
              </h2>

              <p>
                Your latest financial activity.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadTransactions}
              disabled={loading}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="transactions-table">

            <div className="transactions-table-header">

              <span>
                Transaction
              </span>

              <span>
                Reference
              </span>

              <span>
                Date
              </span>

              <span>
                Status
              </span>

              <span>
                Amount
              </span>

            </div>

            {loading ? (

              <div className="transactions-empty">
                Loading transactions...
              </div>

            ) : transactions.length === 0 ? (

              <div className="transactions-empty">
                No transactions have been recorded yet.
              </div>

            ) : (

              transactions
                .slice()
                .reverse()
                .map((transaction) => {

                  const outgoing =
                    isOutgoing(transaction);

                  return (
                    <div
                      className="transactions-table-row"
                      key={transaction.id}
                    >

                      <div className="transaction-cell">

                        <div
                          className={
                            outgoing
                              ? "transaction-round-icon outgoing"
                              : "transaction-round-icon incoming"
                          }
                        >
                          {outgoing
                            ? "↗"
                            : "↙"}
                        </div>

                        <div>

                          <strong>
                            {getTransactionTitle(
                              transaction
                            )}
                          </strong>

                          <span>
                            {transaction.type}
                          </span>

                        </div>

                      </div>

                      <span className="reference-cell">
                        {transaction.referenceId}
                      </span>

                      <div className="date-cell">

                        <strong>
                          {formatDate(
                            transaction.createdAt
                          )}
                        </strong>

                        <span>
                          {formatTime(
                            transaction.createdAt
                          )}
                        </span>

                      </div>

                      <span className="status-cell">
                        {transaction.status}
                      </span>

                      <strong
                        className={
                          outgoing
                            ? "transaction-amount outgoing"
                            : "transaction-amount incoming"
                        }
                      >
                        {outgoing
                          ? "-"
                          : "+"}

                        {formatCurrency(
                          transaction.amount
                        )}
                      </strong>

                    </div>
                  );
                })

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Transactions;