
import auth0 from 'auth0-js';

const client = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_ISSUER_BASE_URL,
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  scope: 'openid email profile offline_access',
  responseType: 'code'
});

export default client