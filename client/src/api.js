const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  getState: (token) => request('/tracker', { token }),
  setSettings: (token, catDate) => request('/tracker/settings', { method: 'PUT', body: { catDate }, token }),

  toggleMission: (token, index) => request(`/tracker/mission/${index}`, { method: 'PATCH', token }),
  toggleWeeklyMission: (token, index) => request(`/tracker/weekly-mission/${index}`, { method: 'PATCH', token }),

  addTarget: (token, target) => request('/tracker/targets', { method: 'POST', body: target, token }),
  updateTarget: (token, index, target) => request(`/tracker/targets/${index}`, { method: 'PUT', body: target, token }),
  deleteTarget: (token, index) => request(`/tracker/targets/${index}`, { method: 'DELETE', token }),
  incrementTarget: (token, index, delta) => request(`/tracker/targets/${index}/increment`, { method: 'PATCH', body: { delta }, token }),

  addMock: (token, mock) => request('/tracker/mocks', { method: 'POST', body: mock, token }),
  deleteMock: (token, index) => request(`/tracker/mocks/${index}`, { method: 'DELETE', token }),

  addLearning: (token, text) => request('/tracker/learning-log', { method: 'POST', body: { text }, token }),
  deleteLearning: (token, index) => request(`/tracker/learning-log/${index}`, { method: 'DELETE', token }),

  // Weekly schedule (day-by-day)
  addScheduleTask:    (token, day, text)  => request(`/tracker/weekly-schedule/${day}`,       { method: 'POST',   body: { text }, token }),
  toggleScheduleTask: (token, day, index) => request(`/tracker/weekly-schedule/${day}/${index}`, { method: 'PATCH', token }),
  deleteScheduleTask: (token, day, index) => request(`/tracker/weekly-schedule/${day}/${index}`, { method: 'DELETE', token }),

  // Next-week schedule (day-by-day)
  addNextWeekTask:    (token, day, text)  => request(`/tracker/next-week-schedule/${day}`,       { method: 'POST',   body: { text }, token }),
  toggleNextWeekTask: (token, day, index) => request(`/tracker/next-week-schedule/${day}/${index}`, { method: 'PATCH', token }),
  deleteNextWeekTask: (token, day, index) => request(`/tracker/next-week-schedule/${day}/${index}`, { method: 'DELETE', token }),

  bulkSave: (token, payload) => request('/tracker/bulk', { method: 'PUT', body: payload, token }),
  resetDashboard: (token) => request('/tracker/reset', { method: 'POST', token })
};
