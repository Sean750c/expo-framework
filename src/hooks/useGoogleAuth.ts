import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { AuthService } from '../api/authService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '1091013528765-lc80atrjcf2sll66nct8is4shud6kplo.apps.googleusercontent.com';
// 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

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const useGoogleAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'cardify',
    path: 'redirect',
  });
  //console.log('redirectUri:', redirectUri);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: 'https://auth.expo.dev/@sean750/cardify',
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  const [idTokenRequest, idTokenResponse, promptIdTokenAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'cardify',
        path: 'redirect',
      }),
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('code:', code);
      // 发给你的后端换 token
      AuthService.getGoogleInfoByToken(code, request?.redirectUri || '');

      handleAuthorizationCode(code);
    }
  }, [response]);

  useEffect(() => {
    if (idTokenResponse?.type === 'success') {
      const { id_token } = idTokenResponse.params;
      handleIdToken(id_token);
    }
  }, [idTokenResponse]);

  const handleAuthorizationCode = async (code: string) => {
    console.log('Authorization Code received:', code);
    console.log('Code Verifier:', request?.codeVerifier);
    console.log('Redirect URI:', request?.redirectUri);
  };

  const handleIdToken = (idToken: string) => {
    console.log('ID Token received:', idToken);

    try {
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      console.log('Decoded ID Token payload:', payload);
    } catch (error) {
      console.error('Failed to decode ID token:', error);
    }
  };

  const signInWithCode = async () => {
    try {
      const result = await promptAsync({
        showInRecents: true,
      });
console.log(JSON.stringify(result));
      if (result?.type === 'success') {
        console.log('Auth Code flow initiated successfully');
      } else if (result?.type === 'error') {
        console.error('Auth Code flow error:', result.error);
      }
    } catch (error) {
      console.error('Error during Auth Code flow:', error);
    }
  };

  const signInWithIdToken = async () => {
    try {
      const result = await promptIdTokenAsync({
        showInRecents: true,
      });
console.log(JSON.stringify(result));
      if (result?.type === 'success') {
        console.log('ID Token flow initiated successfully');
      } else if (result?.type === 'error') {
        console.error('ID Token flow error:', result.error);
      }
    } catch (error) {
      console.error('Error during ID Token flow:', error);
    }
  };

  return {
    signInWithCode,
    signInWithIdToken,
    codeRequest: request,
    codeResponse: response,
    idTokenRequest,
    idTokenResponse,
  };
};
