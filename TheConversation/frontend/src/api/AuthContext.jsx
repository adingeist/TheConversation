import React, { useContext } from 'react';
import jwtDecode from 'jwt-decode';
import AuthStorage from './AuthStorage';

export const AuthContext = React.createContext({ user: {} });

// Hook for child components to access the UserContext values
export function useAuthContext() {
  const authContext = useContext(AuthContext);

  const logIn = (access_token, refresh_token) => {
    const user = jwtDecode(access_token);
    console.log(user);

    if (authContext.setUser) {
      authContext.setUser(user);
    }

    AuthStorage.storeAccessToken(access_token);
    AuthStorage.storeRefreshToken(refresh_token);
  };

  const logOut = () => {
    if (authContext.setUser) {
      authContext.setUser(undefined);
    }
    AuthStorage.removeAccessToken();
    AuthStorage.removeRefreshToken();
  };

  return { logIn, logOut, ...authContext };
}
