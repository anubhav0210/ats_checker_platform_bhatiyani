// src/api/mockBackend.js
const MOCK_DELAY = 500; // Simulate network delay

const mockBackend = {
  authAPI: {
    login: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { 
        data: { 
          access_token: "mock-token",
          user: { email, password,id: 1 }
        } 
      };
    },
    register: async (username, email, password) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { data: { id: 2 } };
    },
    getMe: async () => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { data: { id: 1, email: "test@example.com", password:"testcase", username: "testuser" } };
    }
  },

  resumeAPI: {
    uploadResume: async (formData) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { 
        data: { 
          id: "2",
          resume_name: formData.get('resume_name'),
          score: Math.floor(Math.random() * 100),
          file_url: "/uploads/mock.pdf"
        } 
      };
    },
    getResumes: async () => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { data: require('../mocks/db.json').resumes };
    },
    getResume: async (id) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      const resume = require('../mocks/db.json').resumes.find(r => r.id === id);
      return { data: resume || null };
    },
    deleteResume: async (id) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { status: 204 };
    }
  }
};

export { mockBackend };