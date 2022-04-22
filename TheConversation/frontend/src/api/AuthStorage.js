import Cookies from 'js-cookie';

const access_token_name = 'adin-user-access-token';
const refresh_token_name = 'adin-user-refresh-token';

const storeAccessToken = (token) => Cookies.set(access_token_name, token);
const getAccessToken = () => Cookies.get(access_token_name);
const removeAccessToken = () => Cookies.remove(access_token_name);
const storeRefreshToken = (token) => Cookies.set(refresh_token_name, token);
const getRefreshToken = () => Cookies.get(refresh_token_name);
const removeRefreshToken = () => Cookies.remove(refresh_token_name);

const AuthStorage = {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  storeAccessToken,
  storeRefreshToken,
};

export default AuthStorage;
