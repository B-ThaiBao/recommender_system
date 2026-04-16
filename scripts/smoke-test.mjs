const BASE = {
  auth: process.env.AUTH_BASE_URL || "http://localhost:9001",
  core: process.env.CORE_BASE_URL || "http://localhost:9002",
  grade: process.env.GRADE_BASE_URL || "http://localhost:9003",
  chatbot: process.env.CHATBOT_BASE_URL || "http://localhost:9014",
};

const headers = { "Content-Type": "application/json" };

async function request(url, options = {}) {
  const res = await fetch(url, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const detail = body?.detail || body?.message || `${res.status} ${res.statusText}`;
    throw new Error(`${url} -> ${detail}`);
  }
  return body;
}

async function waitForHealth(baseUrl, maxAttempts = 30) {
  for (let i = 1; i <= maxAttempts; i += 1) {
    try {
      await request(`${baseUrl}/health`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error(`Service not healthy after retries: ${baseUrl}`);
}

async function run() {
  console.log("[smoke] Waiting for health checks...");
  await waitForHealth(BASE.auth);
  await waitForHealth(BASE.core);
  await waitForHealth(BASE.grade);
  await waitForHealth(BASE.chatbot);

  const username = `smoke_${Date.now()}`;
  const password = "smoke-123";

  console.log("[smoke] Register user...");
  await request(`${BASE.auth}/v1/auth/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username,
      email: `${username}@example.com`,
      password,
    }),
  });

  console.log("[smoke] Login user...");
  const login = await request(`${BASE.auth}/v1/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, password }),
  });

  console.log("[smoke] Validate me endpoint...");
  await request(`${BASE.auth}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${login.access_token}`,
    },
  });

  console.log("[smoke] Validate refresh endpoint...");
  await request(`${BASE.auth}/v1/auth/refresh`, {
    method: "POST",
    headers,
    body: JSON.stringify({ refresh_token: login.refresh_token }),
  });

  console.log("[smoke] Validate core quiz endpoints...");
  await request(`${BASE.core}/v1/quiz/templates`);
  await request(`${BASE.core}/v1/quiz/attempts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ answers: [1, 0] }),
  });

  console.log("[smoke] Validate grade endpoints...");
  await request(`${BASE.grade}/v1/grades/latest`);
  await request(`${BASE.grade}/v1/grades/manual`, {
    method: "POST",
    headers,
    body: JSON.stringify({ math: 8.5, literature: 7.5, english: 9.0 }),
  });

  if (process.env.CHATBOT_SMOKE_CALL_LLM === "true") {
    console.log("[smoke] Validate chatbot endpoint...");
    await request(`${BASE.chatbot}/v1/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: "Chao ban" }),
    });
  } else {
    console.log("[smoke] Skip /v1/chat call (set CHATBOT_SMOKE_CALL_LLM=true to enable)");
  }

  console.log("[smoke] All services verified successfully.");
}

run().catch((err) => {
  console.error("[smoke] FAILED:", err.message);
  process.exit(1);
});
