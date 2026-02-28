export async function handler(event) {
  console.log("PATH:", event.path);
  console.log("RAW QUERY:", event.rawQuery);

  const backendPath = event.path.replace('/.netlify/functions/proxy', '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';

  const targetUrl = `http://195.85.216.67/stu-be${backendPath}${query}`;

  console.log("TARGET:", targetUrl);
  console.log("TARGET:", {
    method: event.httpMethod,
    headers: {
      ...event.headers
    },
    body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body
  });

  const response = await fetch(targetUrl, {
    method: event.httpMethod,
    headers: {
      ...event.headers
    },
    body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body
  });
  console.log('THEN', response)

  const data = await response.text();

  return {
    statusCode: response.status,
    body: data
  };
}