import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { RESPONSE_DELAY } from '../config/Constant'
import { users } from './data/user'
import { loginUser } from './data/loginUser'
import { ILoginUser } from '../modal/loginUser'

export default {
  bootstrap() {
    const mock = new MockAdapter(axios, { delayResponse: RESPONSE_DELAY })

    mock.onGet('/success').reply(200, { code: 200, msg: 'success' })

    mock.onGet('/error').reply(500, { code: 500, msg: 'failure' })

    mock.onGet('/v1/users').reply(200, { code: 200, msg: '请求成功', users })

    mock.onPost('/v1/login').reply((config) => {
      const { userName, password } = JSON.parse(config.data)
      let user = {}
      const hasUser = loginUser.some((userItem: ILoginUser) => {
        if (userItem.name === userName && userItem.password === password) {
          user = JSON.parse(JSON.stringify(userItem))
          return true
        } else {
          return false
        }
      })
      if (hasUser) {
        return ([200, { code: 200, msg: '请求成功', user }])
      } else {
        return ([401, { code: 401, msg: '账号或密码错误' }])
      }
    })
  }
}
