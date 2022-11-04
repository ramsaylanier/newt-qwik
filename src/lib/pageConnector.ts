interface FetchOptions {
  method?: string;
  body?: object;
  credentials?: string;
}

const pageFetch = async (endpoint: string, fetchOptions: any) => {
  try {
    const res = await fetch(`http://dev.newt:5173/page/api/${endpoint}`, {
      method: fetchOptions.method || "POST",
      headers: {
        responseType: "application/json",
        ...fetchOptions.headers,
      },
      credentials: fetchOptions.credentials || "include",
      ...(fetchOptions.body ? { body: fetchOptions.body } : {}),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUserPages = async () => {
  const pages = await pageFetch("currentUserPages", {
    method: "GET",
  });

  return pages;
};
