import axios from 'axios'
import { API_URL, REQUEST_TIME_OUT } from '../config/Constant'
import Qs from 'qs'
import Actions from '../store/Actions'
import { IState } from '../store/Store'
import { Dispatch } from 'redux'
import { setStore, getStore, removeAllStore } from './util'
import { Modal } from 'antd'

export interface IParams {
  url: string
  method?: string
  params?: object
  data?: object
}

const tokenExpired = () => {
  Modal.error({
    title: '你的登录信息已过期',
    content: '因长时间未操作，你的登录信息已过期，点击确定重新登录。',
    okText: '确定',
    onOk: () => {
      removeAllStore()
      window.location.reload()
    }
  })
}

/**
 * 通用网络请求
 */
export const requestFn = (
  dispatch: Dispatch<Actions>,
  state: IState,
  params: IParams
): any => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: 'fetch_begin',
      payload: {
        pageLoading: true
      }
    })
    axios.interceptors.response.use(
      (response) => {
        if (response && response.status === 200 && response.data && response.data.token) {
          axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
          setStore('token', response.data.token)
        }
        return response
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          tokenExpired()
          return reject({ state, res: error })
        } else {
          return resolve({ state, res: error })
        }
      }
    )
    axios
      .request({
        url: params.url,
        method: params.method || 'get',
        baseURL: `${API_URL}/api`,
        params: params.params || {},
        paramsSerializer: (arg) => {
          return Qs.stringify(arg, { arrayFormat: 'brackets' })
        },
        headers: {
          ...(getStore('token') ? {Authorization: `Bearer ${getStore('token')}`} : {})
        },
        data: {
          ...(params.data || {})
        },
        timeout: REQUEST_TIME_OUT,
        validateStatus: (status) => {
          return status < 500 // Reject only if the status code is greater than or equal to 500
        }
      })
      .then((res) => {
        dispatch({
          type: 'fetch_success',
          payload: {
            res,
            pageLoading: false
          }
        })
        resolve({ state, res })
      })
      .catch((err) => {
        dispatch({
          type: 'fetch_failed',
          payload: {
            res: err,
            pageLoading: false
          }
        })
        resolve({ state, res: err })
      })
  })
}
