export default {

    oidc: {
        clientId : '0oaec4dx0g08usuTx5d7',
        issuer : 'https://dev-34734116.okta.com/oauth2/default',
        redirectUri : 'https://localhost:4200/login/callback',
        scopes : ['openid', 'profile', 'email']

        // scope provide access to info about a user
        // openid : required for authentication requests
    }
}
