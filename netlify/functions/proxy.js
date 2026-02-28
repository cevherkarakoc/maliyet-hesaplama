export async function handler(event) {
  const path = event.path.replace('/stu-be', '');
  const url = `http://195.85.216.67/stu-be${path}`;

  const response = await fetch(url, {
    method: event.httpMethod,
    headers: {
      'Content-Type': 'application/json'
    },
    body: event.body
  });

  const data = await response.text();

  return {
    statusCode: response.status,
    body: data
  };
}