import { create } from 'apisauce';
import AuthStorage from './AuthStorage';

const client = create({
  baseURL: 'http://YOUR_IP_ADDRESS:8080/api',
});

async function getWithAuthToken(url, data, axiosConfig) {
  const token = await AuthStorage.getAccessToken();
  return client.get(url, data, {
    headers: { Authorization: `Bearer ${token}` },
    ...axiosConfig,
  });
}

async function postWithAuthToken(url, data, axiosConfig) {
  const token = await AuthStorage.getAccessToken();
  return client.post(url, data, {
    headers: { Authorization: `Bearer ${token}` },
    ...axiosConfig,
  });
}

const connection = {
  getWithAuthToken,
  postWithAuthToken,
  ...client,
};

export default connection;
