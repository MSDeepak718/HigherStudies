import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function ChatBot() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const handleQuerySubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/query", { userQuery: query });
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React GPT SQL Query App</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about your database..."
        rows="4"
        cols="50"
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={handleQuerySubmit} style={{ marginBottom: "20px" }}>
        Submit Query
      </button>

      {data.length > 0 && (
        <BarChart
          width={800}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Column_1" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Column_2" fill="#8884d8" />
        </BarChart>
      )}
    </div>
  );
}

export default ChatBot;
