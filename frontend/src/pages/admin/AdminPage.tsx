import React from 'react';
import PageHeader from '../../components/PageHeader';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminPage = () => {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage users, content, and system settings"
        backgroundImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <AdminDashboard />
        </div>
      </section>
    </div>
  );
};

export default AdminPage;