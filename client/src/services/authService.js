const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

export const registerUser = async ({ firstName, lastName, email, password }) => {
  const res = await fetch(`${BASE_URL}/api/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Registration failed")
  return data
}

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Login failed")
  return data
}