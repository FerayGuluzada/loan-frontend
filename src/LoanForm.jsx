import { useState } from "react";

export default function LoanForm() {
  const [personalCode, setPersonalCode] = useState("");
  const [loanAmount, setLoanAmount] = useState(2000);
  const [loanPeriod, setLoanPeriod] = useState(12);
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

    try {
      const res = await fetch("http://localhost:8080/loan/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalCode,
          loanAmount: Number(loanAmount),
          loanPeriodMonths: Number(loanPeriod),
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Loan Decision Engine</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Personal Code:</label><br />
          <input
            type="text"
            value={personalCode}
            onChange={(e) => setPersonalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Loan Amount (€):</label><br />
          <input
            type="number"
            min="2000"
            max="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Loan Period (months):</label><br />
          <input
            type="number"
            min="12"
            max="60"
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Checking..." : "Get Decision"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>Decision:</h3>
          <p>Approved: {response.approved ? "Yes" : "No"}</p>
          <p>Approved Amount: €{response.approvedAmount}</p>
          <p>Approved Period: {response.approvedPeriodMonths} months</p>
        </div>
      )}
    </div>
  );
}