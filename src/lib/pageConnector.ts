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
      ...(fetchOptions.body ? { body: JSON.stringify(fetchOptions.body) } : {}),
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUserPonds = async () => {
  const ponds = await pageFetch("currentUserPonds", {
    method: "GET",
  });

  return ponds;
};

export const updatePageTitle = async (id: string, title: string) => {
  const pages = await pageFetch("updatePageTitle", {
    method: "POST",
    body: { id, title },
  });

  return pages;
};
