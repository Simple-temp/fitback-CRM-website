import "./Report.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

let mainChart = null; // Overall doughnut chart

const BusinessAnalaysisReport = () => {
  const [totalBillCount, setTotalBillCount] = useState(0);
  const [last7DaysAmount, setLast7DaysAmount] = useState(0);
  const [last1HourAmount, setLast1HourAmount] = useState(0);
  const [last7DaysBills, setLast7DaysBills] = useState([]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await axios.get(
        "https://qwikit1.pythonanywhere.com/billingReport/"
      );
      const bills = response.data;

      // Filter out specific user types
      const filteredBills = bills.filter(
        (bill) =>
          bill.usertype !== "Fitback" &&
          bill.usertype !== "Reset" &&
          bill.usertype !== "Aesthetic"
      );

      setTotalBillCount(filteredBills.length);

      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);

      const oneHourAgo = new Date(now);
      oneHourAgo.setHours(now.getHours() - 1);

      // Calculate last 7 days total amount and bills
      const last7DaysBills = filteredBills.filter((bill) => {
        const billDate = new Date(bill.systemdate);
        return billDate >= sevenDaysAgo;
      });
      const last7DaysAmount = last7DaysBills.reduce(
        (sum, bill) => sum + parseInt(bill.totalAmount),
        0
      );

      // Calculate last 1 hour total amount
      const last1HourBills = filteredBills.filter((bill) => {
        const billDate = new Date(bill.systemdate);
        return billDate >= oneHourAgo;
      });
      const last1HourAmount = last1HourBills.reduce(
        (sum, bill) => sum + parseInt(bill.totalAmount),
        0
      );

      setLast7DaysAmount(last7DaysAmount);
      setLast1HourAmount(last1HourAmount);
      setLast7DaysBills(last7DaysBills);

      renderMainChart(filteredBills.length, last7DaysAmount, last1HourAmount);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const renderMainChart = (total, last7Days, last1Hour) => {
    const ctx = document.getElementById("totalBillChart").getContext("2d");

    if (mainChart) mainChart.destroy();

    mainChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Total Bills", "Last 7 Days", "Last 1 Hour"],
        datasets: [
          {
            data: [total, last7Days, last1Hour],
            backgroundColor: ["#4caf50", "#2196f3", "#ff5722"],
          },
        ],
      },
    });
  };

  return (
    <div>
      <h1 style={{ marginLeft: "20px" }}>Business Analysis Report</h1>

      <div className="analysis-top-part">
        <canvas id="totalBillChart"></canvas>
      </div>

      <div className="row">
        <div className="chart-container">
          <p>Total Amount (Last 7 Days): BDT {last7DaysAmount}</p>
          <p>Total Amount (Last 1 Hour): BDT {last1HourAmount}</p>
        </div>
        {/* <div className="chart-container">
          <p>Total Amount (Last 1 Hour): BDT {last1HourAmount}</p>
        </div> */}
        <div className="chart-container">
        <h1 style={{fontWeight:"900", fontSize:"19px"}}>Total Bill {totalBillCount}</h1>
        </div>
      </div>

      <div className="table-container">
        <h2>Bills from the Last 7 Days</h2>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>User Type</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {last7DaysBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.user_type || "General"}</td>
                <td>{new Date(bill.systemdate).toLocaleDateString()}</td>
                <td>BDT {bill.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessAnalaysisReport;
