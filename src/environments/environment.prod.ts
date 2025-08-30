export const environment = {
  production: true,
  apiBaseUrl: 'https://{API_BASE_URL}',
  wsBaseUrl: 'wss://{WS_BASE_URL}/fbb',
  baseUrl: '{BASE_URL}',
  envLabel: '{ENV_LABEL}',
  xApiKey: '{X_API_KEY}',
  awsmobile: {
    aws_cognito_identity_pool_id: '{IDENTITY_POOL_ID}',
    aws_cognito_region: 'ap-southeast-2',
    aws_user_pools_id: '{USERPOOL_ID}',
    aws_user_pools_web_client_id: '{USERPOOL_WEBCLIENTID}',
    oauth: {
      domain: '{USERPOOL_OAUTH_DOMAIN}',
      redirectSignIn: '{USERPOOL_OAUTH_REDIRECT_SIGNIN}',
      redirectSignOut: '{USERPOOL_OAUTH_REDIRECT_SIGNOUT}'
    },
  }
};
