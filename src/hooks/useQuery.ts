interface QueryBody {
  SqlCommand: string;
}

const useQuery = () => {
  const query = async (body: QueryBody, offset = 0) => {
    const headers = new Headers();
    headers.append("Authorization", window.apiKey);
    headers.append("Content-Type", "application/json");

    const sql = JSON.stringify(body);

    const options = {
      method: "PUT",
      headers: headers,
      body: sql,
    };

    const url = `https://api.opendental.com/api/v1/queries/ShortQuery?Offset=${offset}`;

    const response = await fetch(url, options);

    if (response.ok) {
      const json = await response.json();

      if (json.length === 100) {
        const next = await query(body, offset + 100);
        json.push(...next);
      }

      return json;
    } else {
      // eslint-disable-next-line no-console
      console.log(`${response.status}: ${response.statusText}`);
      // eslint-disable-next-line no-console
      console.log(response);
    }
  };

  return { query };
};

export default useQuery;
