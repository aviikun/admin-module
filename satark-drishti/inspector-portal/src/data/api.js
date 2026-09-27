const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export function fetchSchedule() {
  return request('/api/schedule');
}

export function fetchScheduleItem(id) {
  return fetchSchedule().then((items) => items.find((item) => item.id === id) || null);
}

export function fetchUsers() {
  return request('/api/users');
}

export function fetchInspections() {
  return request('/api/inspections');
}

export function fetchInspection(id) {
  return request(`/api/inspections/${encodeURIComponent(id)}`);
}

export function createInspection(payload) {
  return request('/api/inspections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
