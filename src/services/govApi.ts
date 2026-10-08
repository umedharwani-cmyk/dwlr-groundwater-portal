const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface GovUser {
  name: string;
  employeeId: string;
  department: string;
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export async function loginGov(payload: {
  employeeId: string;
  password: string;
}): Promise<GovUser> {
  const res = await fetch(`${API_BASE}/gov/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employee_id: payload.employeeId,
      password: payload.password
    })
  });
  const data = await handleResponse(res);
  return {
    name: data.user.name,
    employeeId: data.user.employee_id,
    department: data.user.department
  };
}