"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Users, TrendingUp, Plus } from "lucide-react";

export default function AdminDashboardClient({ initialStats }) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: Refresh stats periodically
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-white/90">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.products || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats?.customers || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`$${(stats?.revenue || 0).toLocaleString()}`}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Plus size={24} className="text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-600">Create a new product</p>
            </div>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Package size={24} className="text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900">View Products</h3>
              <p className="text-sm text-gray-600">Manage all products</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Refresh Status */}
      {loading && (
        <div className="text-center text-gray-600 text-sm">
          Refreshing stats...
        </div>
      )}
    </div>
  );
}
