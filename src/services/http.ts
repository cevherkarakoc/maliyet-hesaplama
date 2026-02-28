const BASE_URL = "/.netlify/functions/proxy/tf";
//const BASE_URL = "/stu-be/tf";
//const BASE_URL = "http://195.85.216.67/stu-be/tf";

function getAuthToken(): string {
  const username = localStorage.getItem("auth_username");
  const password = localStorage.getItem("auth_password");
  if (username && password) {
    return "Basic " + btoa(`${username}:${password}`);
  }
  return "";
}

export async function post<T>(url: string, body?: any, query?: Record<string, any>): Promise<T> {
  let fullUrl = `${BASE_URL}${url}`;
  if (query) {
    const params = new URLSearchParams(query);
    fullUrl += `?${params.toString()}`;
  }
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": getAuthToken() 
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}