import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/resume/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResumes();
  }, [token]);

  return (
    <div>
      <ul>
        {resumes.map((r) => (
          <li key={r._id}>
            <a href={`http://localhost:8000/${r.filePath}`} target="_blank" rel="noreferrer">
              {r.originalName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
