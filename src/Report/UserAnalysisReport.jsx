import "./Report.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

let mainChart = null; // Overall doughnut chart
let last7DaysChart = null; // Last 7 days chart
let last1HourChart = null; // Last 1 hour chart

const UserAnalysisReport = () => {
  const [userCounts, setUserCounts] = useState({
    Fitback: [],
    Reset: [],
    Aesthetic: [],
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [last7DaysUsers, setLast7DaysUsers] = useState(0);
  const [last1HourUsers, setLast1HourUsers] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (totalUsers > 0) {
      renderMainChart();
      calculateTimeBasedUsers();
    }
  }, [userCounts]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "https://qwikit1.pythonanywhere.com/userProfile"
      );
      const users = response.data;

      const counts = {
        Fitback: users.filter((user) => user.usertype === "Fitback"),
        Reset: users.filter((user) => user.usertype === "Reset"),
        Aesthetic: users.filter((user) => user.usertype === "Aesthetic"),
      };

      setUserCounts(counts);
      setTotalUsers(users.length);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const calculateTimeBasedUsers = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);

    const usersLast7Days = Object.values(userCounts)
      .flat()
      .filter((user) => {
        const userDate = new Date(user.systemdate);
        return userDate >= sevenDaysAgo;
      });

    const usersLast1Hour = Object.values(userCounts)
      .flat()
      .filter((user) => {
        const userDate = new Date(user.systemdate);
        return userDate >= oneHourAgo;
      });

    setLast7DaysUsers(usersLast7Days.length);
    setLast1HourUsers(usersLast1Hour.length);

    renderTimeBasedCharts(usersLast7Days.length, usersLast1Hour.length);
  };

  const renderMainChart = () => {
    const ctx = document.getElementById("userChart").getContext("2d");

    if (mainChart) mainChart.destroy();

    mainChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Fitback", "Reset", "Aesthetic"],
        datasets: [
          {
            data: [
              userCounts.Fitback.length,
              userCounts.Reset.length,
              userCounts.Aesthetic.length,
            ],
            backgroundColor: ["#4caf50", "#2196f3", "#ff5722"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce(
                  (acc, val) => acc + val,
                  0
                );
                const percentage = ((context.raw / total) * 100).toFixed(2);
                return `${context.label}: ${context.raw} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  };

  const renderTimeBasedCharts = (last7Days, last1Hour) => {
    const last7DaysCtx = document
      .getElementById("last7DaysChart")
      .getContext("2d");
    const last1HourCtx = document
      .getElementById("last1HourChart")
      .getContext("2d");

    if (last7DaysChart) last7DaysChart.destroy();
    if (last1HourChart) last1HourChart.destroy();

    last7DaysChart = new Chart(last7DaysCtx, {
      type: "doughnut",
      data: {
        labels: ["New Users (Last 7 Days)", "Others"],
        datasets: [
          {
            data: [last7Days, totalUsers - last7Days],
            backgroundColor: ["#4caf50", "#e0e0e0"],
          },
        ],
      },
    });

    last1HourChart = new Chart(last1HourCtx, {
      type: "doughnut",
      data: {
        labels: ["New Users (Last 1 Hour)", "Others"],
        datasets: [
          {
            data: [last1Hour, totalUsers - last1Hour],
            backgroundColor: ["#2196f3", "#e0e0e0"],
          },
        ],
      },
    });
  };

  return (
    <div>
      <h1 style={{ marginLeft: "20px" }}>User Analysis Report</h1>

      <div className="analysis-top-part">
        {/* Main Doughnut Chart */}
        <div style={{ width: "30%", }} className="analysis-left">
          <canvas id="userChart"></canvas>
        </div>

        {/* Circular Progress Bars */}
        <div className="circle-bar analysis-right">
          {["Fitback", "Reset", "Aesthetic"].map((type) => {
            const count = userCounts[type].length;
            const percentage =
              totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(2) : 0;

            return (
              <div className="inner-circle-bar" key={type}>
                <div className="circle-bar-title">
                  <h3>{type} Users</h3>
                </div>
                <div
                  className="inner-circle-body"
                  style={{ "--percentage": percentage }}
                >
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time-Based Doughnut Charts */}
      <div className="row">
        <div className="chart-container">
          <canvas id="last7DaysChart"></canvas>
          <p>New Users (Last 7 Days): {last7DaysUsers}</p>
        </div>
        <div className="chart-container">
          <canvas id="last1HourChart"></canvas>
          <p>New Users (Last 1 Hour): {last1HourUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalysisReport;
