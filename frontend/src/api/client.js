const API_BASE = '/api';

/**
 * Authentication API Client Methods
 */
export async function signupRequest(data) {
  const res = await fetch(`${API_BASE}/auth/signup-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const error = new Error(json.message || 'Signup request failed.');
    error.status = res.status;
    error.errorCode = json.errorCode;
    throw error;
  }
  return json;
}

export async function verifyOtp(data) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const error = new Error(json.message || 'OTP verification failed.');
    error.status = res.status;
    throw error;
  }
  return json;
}

export async function resendOtp(data) {
  const res = await fetch(`${API_BASE}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const error = new Error(json.message || 'Failed to resend OTP.');
    error.status = res.status;
    throw error;
  }
  return json;
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const error = new Error(json.message || 'Login failed.');
    error.status = res.status;
    error.errorCode = json.errorCode;
    throw error;
  }
  return json;
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

/**
 * Animal Rescue, Adoption, and Care API Methods
 */
export async function fetchRescues() {
  const res = await fetch(`${API_BASE}/rescue`);
  if (!res.ok) throw new Error('Failed to fetch rescues');
  return res.json();
}

export async function submitRescueReport(data) {
  const res = await fetch(`${API_BASE}/rescue/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit rescue report');
  return res.json();
}

export async function fetchAdoptionPets(species = 'All', urgency = '') {
  const query = new URLSearchParams();
  if (species && species !== 'All') query.append('species', species);
  if (urgency) query.append('urgency', urgency);
  const res = await fetch(`${API_BASE}/adoption?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch adoption pets');
  return res.json();
}

export async function fetchAdoptionApplications() {
  const res = await fetch(`${API_BASE}/adoption/applications`);
  if (!res.ok) throw new Error('Failed to fetch adoption applications');
  return res.json();
}

export async function submitAdoptionApplication(data) {
  const res = await fetch(`${API_BASE}/adopt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to submit adoption application');
  }
  return json;
}

export async function fetchPetCareGuides(searchQuery = '', category = 'All') {
  const query = new URLSearchParams();
  if (searchQuery) query.append('query', searchQuery);
  if (category && category !== 'All') query.append('category', category);
  const res = await fetch(`${API_BASE}/petcare/guides?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch pet care guides');
  return res.json();
}

export async function fetchConsultationRequests() {
  const res = await fetch(`${API_BASE}/petcare/consultations`);
  if (!res.ok) throw new Error('Failed to fetch consultation requests');
  return res.json();
}

export async function submitConsultationRequest(data) {
  const res = await fetch(`${API_BASE}/petcare/consult`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit consultation request');
  return res.json();
}

export async function fetchNearbyHelpers(lat = '', lng = '', type = 'All') {
  const query = new URLSearchParams();
  if (lat) query.append('lat', lat);
  if (lng) query.append('lng', lng);
  if (type && type !== 'All') query.append('type', type);
  const res = await fetch(`${API_BASE}/helpers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch helpers');
  return res.json();
}

export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chatbot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to get response from Veterinary Assistant.');
  }
  return json;
}
