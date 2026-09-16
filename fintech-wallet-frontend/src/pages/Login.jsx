import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:8081";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      /*
       * Store the authenticated user's information
       * so the dashboard knows which wallet to load.
       */
      localStorage.setItem(
        "finpayUserId",
        data.userId
      );

      localStorage.setItem(
        "finpayName",
        data.name
      );

      localStorage.setItem(
        "finpayEmail",
        data.email
      );

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("aarnit@fintech.com");
    setPassword("test123");
    setError("");
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-brand">
          <span className="logo-icon">F</span>
          FinPay
        </div>

        <div className="auth-left-content">

          <div className="eyebrow">
            ✦ SMARTER BANKING
          </div>

          <h1>
            Your money.
            <br />
            <span>Your way.</span>
          </h1>

          <p>
            Securely access your wallet, send money,
            and manage your finances from anywhere.
          </p>

        </div>

        <div className="auth-security">
          <span>✓</span>
          Protected with secure authentication
        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-brand">
            <span className="logo-icon">F</span>
            FinPay
          </div>

          <div className="auth-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your account.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  Forgot password?
                </button>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="demo-login"
            onClick={fillDemoAccount}
          >
            Use demo account
          </button>

          <p className="auth-footer">

            Don't have an account?

            <Link to="/register">
              Create an account
            </Link>

          </p>

          <div className="legal">

            By continuing, you agree to FinPay's
            <span> Terms of Service</span> and
            <span> Privacy Policy</span>.

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;