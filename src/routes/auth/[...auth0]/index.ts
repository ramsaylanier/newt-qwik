import type { RequestHandler } from "@builder.io/qwik-city";

const domain = import.meta.env.VITE_AUTH0_ISSUER_BASE_URL;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const clientSecret = import.meta.env.VITE_AUTH0_CLIENT_SECRET;

let currentUser: UserProfile | null;

export const getCurrentUser = () => {
  return currentUser || null;
};

const getToken = async ({ accessCode }: { accessCode: string }) => {
  try {
    const body = {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: accessCode,
      redirect_uri: "http://localhost:5173/",
    };

    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    };

    const res = await fetch(`https://${domain}/oauth/token`, options);

    if (!res.ok) {
      throw Error(res.statusText);
    } else {
      const tokenData = await res.json();
      return tokenData;
    }
  } catch (err) {
    console.log(err);
  }
};

const getProfile = async (token: string) => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await fetch(`https://${domain}/userinfo`, options);

    if (!res.ok) {
      throw Error(res.statusText);
    } else {
      const profile = await res.json();
      return profile;
    }
  } catch (err) {
    console.log(err);
  }
};

export const onGet: RequestHandler = async ({
  url,
  params,
  response,
  // cookie,
}) => {
  if (params.auth0 === "callback") {
    try {
      const accessCode = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (accessCode && state) {
        const tokenData = await getToken({ accessCode });

        if (tokenData) {
          const profile = await getProfile(tokenData?.access_token);
          // cookie.set("newt-user", profile);
          currentUser = profile;
        } else {
          throw Error("No Token!");
        }
      }
    } catch (err) {
      console.log(err);
    }

    throw response.redirect("/", 302);
  }

  if (params.auth0 === "logout") {
    currentUser = null;
    throw response.redirect("/", 302);
  }
};
