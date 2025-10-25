import React, { useEffect, useState } from "react";
import { getStats } from "../api/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from "recharts";

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);       // Track loading state
  const [message, setMessage] = useState("");         // Track no data or error messages

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getStats();

        if (!stats || stats.length === 0) {
          setData([]);
          setMessage("No scheduled classes available.");
        } else {
          setData(stats);
          setMessage("");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setData([]);
        setMessage("Failed to fetch stats. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s
    return () => clearInterval(interval); // cleanup
  }, []);

  if (loading) return <p>Loading stats...</p>;

  const maxCount = Math.max(...data.map((d) => d.count), 0);
  const ticks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Daily Scheduled Classes</h2>

      <p style={{ color: "#555", marginBottom: "20px" }}>
    This section displays the number of driving classes scheduled per day. 
    Use this chart to monitor daily class activity and identify trends 
    in your driving center’s schedule.
  </p>

      {message ? (
        <p style={{ color: "#e53935", fontWeight: "500" }}>{message}</p>
      ) : (
        <div style={{
      background: "#f9f9fb",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
    }}>
                <LineChart width={700} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              })
            }
          >
            <Label
              value="Date"
              offset={-10}
              position="insideBottom"
              style={{ textAnchor: "middle", fontWeight: "bold", fill: "#333" }}
            />
          </XAxis>
          <YAxis
            ticks={ticks}
            allowDecimals={false}
            domain={[0, maxCount || 1]}
          >
            <Label
              value="Number of Classes"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold", fill: "#333" }}
            />
          </YAxis>
          <Tooltip
            formatter={(value) => [`${value} class${value !== 1 ? "es" : ""}`, "Count"]}
            contentStyle={{ backgroundColor: "#fff", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b5dcc"
            strokeWidth={3}
            dot={{ r: 5, fill: "#3b5dcc" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
    </div>
      )}
    </div>
  );
};

export default Stats;
