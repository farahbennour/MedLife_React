import React from "react";
import "./dashboardadmin.css";

export default function Dashboard() {
  // Sample data for demonstration
  const stats = [
    { title: "Total Patients", value: "1,234", icon: "👥", color: "bg-blue-500" },
    { title: "Today's Appointments", value: "28", icon: "📅", color: "bg-green-500" },
    { title: "Pending Consultations", value: "12", icon: "⏳", color: "bg-yellow-500" },
    { title: "Available Doctors", value: "15", icon: "👨‍⚕️", color: "bg-purple-500" }
  ];

  const recentActivities = [
    { time: "10:30 AM", activity: "New patient registration - John Doe", type: "registration" },
    { time: "09:45 AM", activity: "Appointment completed - Dr. Smith", type: "appointment" },
    { time: "09:15 AM", activity: "Lab results received - Sarah Wilson", type: "results" },
    { time: "Yesterday", activity: "Monthly report generated", type: "report" }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, Dr. Anderson! 👋</h1>
        <p>Here's what's happening with your clinic today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="content-card">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-desc">{activity.activity}</div>
                <span className={`activity-badge ${activity.type}`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn">
              <span className="action-icon">➕</span>
              New Appointment
            </button>
            <button className="action-btn">
              <span className="action-icon">👤</span>
              Add Patient
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              View Reports
            </button>
            <button className="action-btn">
              <span className="action-icon">💊</span>
              Manage Inventory
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="content-card">
          <h2>Upcoming Appointments</h2>
          <div className="appointments-list">
            <div className="appointment-item">
              <div className="appointment-time">11:30 AM</div>
              <div className="appointment-details">
                <strong>Michael Brown</strong>
                <span>Regular Checkup</span>
              </div>
              <button className="status-btn confirmed">Confirmed</button>
            </div>
            <div className="appointment-item">
              <div className="appointment-time">02:15 PM</div>
              <div className="appointment-details">
                <strong>Emily Johnson</strong>
                <span>Dental Consultation</span>
              </div>
              <button className="status-btn pending">Pending</button>
            </div>
            <div className="appointment-item">
              <div className="appointment-time">04:00 PM</div>
              <div className="appointment-details">
                <strong>Robert Wilson</strong>
                <span>Follow-up Visit</span>
              </div>
              <button className="status-btn confirmed">Confirmed</button>
            </div>
          </div>
        </div>

        {/* Clinic Performance */}
        <div className="content-card">
          <h2>Clinic Performance</h2>
          <div className="performance-stats">
            <div className="performance-item">
              <span>Monthly Revenue</span>
              <strong>$45,678</strong>
            </div>
            <div className="performance-item">
              <span>Patient Satisfaction</span>
              <strong>94%</strong>
            </div>
            <div className="performance-item">
              <span>Average Wait Time</span>
              <strong>8 min</strong>
            </div>
            <div className="performance-item">
              <span>Appointment Rate</span>
              <strong>87%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}