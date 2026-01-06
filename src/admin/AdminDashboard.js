import React from 'react';
import './admin.css';
import TransactionHistory from './TransactionHistory';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="admin-main">
        <section className="admin-section">
          <h2>Pending Landlord Verifications</h2>
          {/* Add logic to list and approve/reject landlords here */}
          <div className="admin-placeholder">No pending verifications yet.</div>
        </section>
        <section className="admin-section">
          <h2>Transaction History</h2>
          <TransactionHistory />
        </section>
        <section className="admin-section">
          <h2>All Landlords</h2>
          {/* Add logic to list all landlords here */}
          <div className="admin-placeholder">No landlords found.</div>
        </section>
      </main>
    </div>
  );
};
  );
const [showTransactions, setShowTransactions] = React.useState(false);

