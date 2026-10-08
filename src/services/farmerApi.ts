const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface FarmerUser {
  name: string;
  phone: string;
  state: 'rajasthan' | 'tamil_nadu';
  district: string;
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export async function registerFarmer(payload: {
  name: string;
  phone: string;
  password: string;
  state: string;
  district: string;
}): Promise<FarmerUser> {
  const res = await fetch(`${API_BASE}/farmer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: payload.name,
      mobile_number: payload.phone,
      password: payload.password,
      state: payload.state,
      district: payload.district
    })
  });
  const data = await handleResponse(res);
  return {
    name: data.user.full_name,
    phone: data.user.mobile_number,
    state: data.user.state,
    district: data.user.district
  };
}

export async function loginFarmer(payload: {
  phone: string;
  password: string;
}): Promise<FarmerUser> {
  const res = await fetch(`${API_BASE}/farmer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile_number: payload.phone,
      password: payload.password
    })
  });
  const data = await handleResponse(res);
  return {
    name: data.user.full_name,
    phone: data.user.mobile_number,
    state: data.user.state,
    district: data.user.district
  };
}