export async function handler(event) {
  console.log("=== STU-BE PROXY HIT ===");
  console.log("Path:", event.path);
  console.log("Method:", event.httpMethod);
  console.log("Query:", event.rawQuery);

  const path = event.path.replace('/stu-be', '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const targetUrl = `http://195.85.216.67/stu-be${path}${query}`;

  console.log("Target URL:", targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: '195.85.216.67'
      },
      body: ['GET', 'HEAD'].includes(event.httpMethod)
        ? undefined
        : event.body
    });

    console.log("Response status:", response.status);

    const data = await response.text();

    return {
      statusCode: response.status,
      body: data
    };
  } catch (err) {
    console.error("Proxy error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}