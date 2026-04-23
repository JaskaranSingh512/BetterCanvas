const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const TOKEN_KEY = "bettercanvas_token";

async function request(path: string, init?: RequestInit) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "API request failed");
  }
  return response.json();
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function getDashboard() {
  return request("/dashboard");
}

export async function getCourses() {
  return request("/courses");
}

export async function getCalendarTasks() {
  return request("/calendar/tasks");
}

export async function patchTask(id: string, checked: boolean) {
  return request(`/calendar/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ checked }),
  });
}

export async function createTask(payload: {
  eventDate: string;
  courseCode?: string;
  courseName: string;
  taskTitle: string;
  taskType: "assignment" | "calendar";
  points?: number;
  dueTime?: string;
  time?: string;
  thumbnail?: "red" | "green";
  taskSubtitle?: string;
  thumbnailLabel?: string;
}) {
  return request("/calendar/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getGroups() {
  return request("/groups");
}

export async function getAccount() {
  return request("/account");
}

export async function patchAccount(settings: string[]) {
  return request("/account", {
    method: "PATCH",
    body: JSON.stringify({ settings }),
  });
}

export async function setFocusedCourse(courseId: string) {
  return request(`/courses/${courseId}/focused`, {
    method: "PATCH",
  });
}

export async function getHelpTopics() {
  return request("/help/topics");
}
