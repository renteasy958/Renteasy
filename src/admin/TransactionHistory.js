import React, { useEffect, useState } from 'react';
import './admin.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // TODO: Fetch real transaction data from backend here
    setTransactions([]);
  }, []);

  return (
    <div className="transaction-history-cards">
      {transactions.length === 0 ? (
        <div className="transaction-card-empty">No transactions yet.</div>
      ) : (
        transactions.map((txn, idx) => (
          <div className="transaction-card transaction-card-inline" key={idx}>
            <span className="transaction-label" style={{marginRight: 32}}>Name:</span>
            <span className="transaction-value" style={{marginRight: 64}}>{txn.name}</span>
            <span className="transaction-label" style={{marginRight: 32}}>Reference:</span>
            <span className="transaction-value" style={{marginRight: 64}}>{txn.reference}</span>
            <span className="transaction-label" style={{marginRight: 32}}>Amount:</span>
            <span className="transaction-value" style={{ fontWeight: 600, color: txn.amount === 50 ? '#007bff' : '#28a745', marginRight: 0 }}>₱{txn.amount}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
