import { useState } from "react";

export default function LoanForm() {
  const [personalCode, setPersonalCode] = useState("");
  const [loanAmount, setLoanAmount] = useState("2000"); 
  const [loanPeriod, setLoanPeriod] = useState("12"); 
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!personalCode) {
      setError("Personal code is required.");
      setLoading(false);
      return;
    }

    if (!loanAmount || !loanPeriod) {
      setError("Loan amount and period are required.");
      setLoading(false);
      return;
    }

    try {
      const body = {
        personalCode,
        loanAmount: Number(loanAmount),
        loanPeriodMonths: Number(loanPeriod),
      };

      const res = await fetch("http://localhost:8080/loan/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: 360,
    margin: "50px auto",
    padding: "25px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const headingStyle = { textAlign: "center", marginBottom: 25, color: "#222" };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0 16px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    backgroundColor: "#fff",
    color: "#000",
    boxSizing: "border-box",
  };
  const labelStyle = { fontWeight: "600", fontSize: "14px" };
  const buttonStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const errorStyle = { color: "red", marginTop: 10, fontSize: "14px" };
  const responseStyle = {
    marginTop: 20,
    padding: 15,
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#e6f7ff",
    color: "#000",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Loan Decision Engine</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Personal Code:</label>
          <input
            type="text"
            value={personalCode}
            onChange={(e) => setPersonalCode(e.target.value)}
            style={inputStyle}
            required // Prevent empty submission
          />
        </div>

        <div>
          <label style={labelStyle}>Loan Amount (€):</label>
          <input
            type="number"
            min={2000}          // Minimum allowed value
            max={10000}         // Maximum allowed value
            step={100}          // Arrow keys increase/decrease by €100
            value={loanAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setLoanAmount("2000"); // Reset to min if cleared
              } else {
                setLoanAmount(value);
              }
            }}
            style={inputStyle}
            required // Prevent empty submission
          />
        </div>

        <div>
          <label style={labelStyle}>Loan Period (months):</label>
          <input
            type="number"
            min={12}            // Minimum allowed period
            max={60}            // Maximum allowed period
            step={1}            // Arrow keys increase/decrease by 1 month
            value={loanPeriod}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setLoanPeriod("12"); // Reset to min if cleared
              } else {
                setLoanPeriod(value);
              }
            }}
            style={inputStyle}
            required // Prevent empty submission
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Checking..." : "Get Decision"}
        </button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      {response && (
        <div style={responseStyle}>
          <h3>Decision:</h3>
          <p>Approved: {response.approved ? "Yes ✅" : "No ❌"}</p>
          <p>Approved Amount: €{response.approvedAmount}</p>
          <p>Approved Period: {response.approvedPeriodMonths} months</p>
        </div>
      )}
    </div>
  );
}