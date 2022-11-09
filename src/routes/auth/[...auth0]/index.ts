import type { RequestHandler } from "@builder.io/qwik-city";

const domain = import.meta.env.VITE_AUTH0_ISSUER_BASE_URL;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const clientSecret = import.meta.env.VITE_AUTH0_CLIENT_SECRET;

let currentUser: UserProfile | null = null;

export const getCurrentUser = () => {
  return currentUser;
};

const getManagementToken = async () => {
  try {
    const body = {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
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

const getTokenWithAccessCode = async ({
  accessCode,
}: {
  accessCode: string;
}) => {
  try {
    const body = {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: accessCode,
      redirect_uri: "http://dev.newt:5173/",
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
      console.log({ profile });
      return profile;
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserWithMetadata = async (userId: string) => {
  try {
    const tokenData = await getManagementToken();
    const res = await fetch(`https://${domain}/api/v2/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw Error(res.statusText);
    } else {
      const user = await res.json();
      return user;
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateUserMetadata = async (userId: string, metadata: object) => {
  try {
    const tokenData = await getManagementToken();
    const res = await fetch(`https://${domain}/api/v2/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_metadata: metadata,
      }),
    });
    const result = await res.json();

    console.log({ result });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const onPost: RequestHandler = async ({ params, request, cookie }) => {
  const userCookie = cookie.get("newt-user");

  if (params.auth0 === "updateUser") {
    if (userCookie) {
      const update = await request.json();
      updateUserMetadata(userCookie?.value, update);
    }
  }
};

export const onGet: RequestHandler = async ({
  url,
  params,
  response,
  cookie,
}) => {
  // HANDLE LOGIN CALLBACK
  if (params.auth0 === "callback") {
    try {
      const accessCode = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (accessCode && state) {
        const tokenData = await getTokenWithAccessCode({ accessCode });

        if (tokenData) {
          const profile = await getProfile(tokenData?.access_token);

          cookie.set("newt-user", profile.sub, {
            domain: "dev.newt",
            path: "/",
          });

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

  // HANDLE LOGOUT
  if (params.auth0 === "logout") {
    // delete cookie
    response.headers.set(
      "Set-Cookie",
      `newt-user = null; Path=/ ; Domain=dev.newt ; Max-Age=0`
    );
    throw response.redirect("/", 302);
  }

  // HANDLE GET USER
  if (params.auth0 === "me") {
    const userCookie = cookie.get("newt-user");

    if (!userCookie) {
      response.status = 403;
      return "no-user";
    }

    const user = await getUserWithMetadata(userCookie.value);
    return user;
  }
};
