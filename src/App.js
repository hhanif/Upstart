import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [pollId, setPollId] = useState(null);
  const [poll, setPoll] = useState(null);

  const createPoll = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/polls", { name, description, options });
      setPollId(response.data._id);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const editPoll = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8000/api/polls/${pollId}`, { name, description, options });
      setPollId(response.data._id);
    } catch (error) {
      console.error("Error editing poll:", error);
    }
  };

  const getPoll = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/polls/${pollId}`);
      setPoll(response.data);
    } catch (error) {
      console.error("Error getting poll:", error);
    }
  };

  useEffect(() => {
    if (pollId) getPoll();
  }, [pollId]);

  return (
    <div>
      <h1>Create / edit a new poll</h1>
      <form>
        <label>
          Poll Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Options:
          <input
            type="text"
            value={options.join(",")}
            onChange={(e) => setOptions(e.target.value.split(","))}
          />
        </label>
        {pollId ? (
          <button onClick={editPoll}>Edit Poll</button>
        ) : (
          <button onClick={createPoll}>Create Poll</button>
        )}
      </form>
      {poll && (
        <div>
          <h2>View Poll</h2>
          <p>Title: {poll.name}</p>
          <p>Description: {poll.description}</p>
          <ul>
            {poll.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
