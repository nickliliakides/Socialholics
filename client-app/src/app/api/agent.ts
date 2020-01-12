import axios, { AxiosResponse } from 'axios'
import { IActivity } from '../models/activity';
import { IUser, IUserFormValues } from '../models/user';
import { history } from '../..';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem('jwt');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
  const {status, data, config} = error.response;

  if(error.message === 'Network Error' && !error.response) {
    toast.error('Network error! Check your connection or try again later.');
  }
  if(status === 404) {
    history.push('/notfound');
  }
  if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
    history.push('/notfound');
  }
  if(status === 500) {
    toast.error('Server error! Try again later.');
  }
  throw error.response;
})

const responseBody = (response: AxiosResponse) => response.data;

const delay = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const requests = {
  get: (url: string) => axios.get(url).then(delay(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(delay(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(delay(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(delay(1000)).then(responseBody)
}

const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string): Promise<IActivity> => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`)
}

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user)
}

export default {
  Activities,
  User
}