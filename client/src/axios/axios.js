import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/api/v1'
//   baseURL: 'https://task-management-system-server-18cy.onrender.com/api/v1'
  baseURL: 'http://localhost:8080'
  , 
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default api;