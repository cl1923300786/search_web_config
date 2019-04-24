import React, { useState, useCallback } from 'react'
import { Row, Col, Form, Input, Button, Icon, notification } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import styles from './Login.module.less'
import { setStore } from '../../utils/util'

interface IParams {
  userName: string
  password: string
}

const LoginForm = (props: any) => {
  const [loading, setLoading] = useState(false)
  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['userName', 'password'])
        setLoading(true)
        LoginRequest(fieldValue)
      }
    })
  }

  // const LoginRequest = async (fieldValue: IParams) => {
  //   const { res } = await requestFn(dispatch, state, {
  //     url: '/v1/login',
  //     method: 'post',
  //     data: {
  //       username: fieldValue.userName,
  //       password: fieldValue.password
  //     }
  //   })
  //   setLoading(false)
  //   if (res && res.status === 200 && res.data) {
  //     setStore('user', res.data.user)
  //     setStore('token', 'token')
  //     props.history.push('/')
  //   } else {
  //     errorTips(
  //       '登录失败',
  //       res && res.data && res.data.msg
  //         ? res.data.msg
  //         : '请求错误，请重试！'
  //     )
  //   }
  // }

  const LoginRequest = (fieldValue: IParams) => {
    setStore('user', 'user')
    setStore('token', 'token')
    props.history.push('/')
  //   const { res } = await requestFn(dispatch, state, {
  //     url: '/v1/login',
  //     method: 'post',
  //     data: {
  //       username: fieldValue.userName,
  //       password: fieldValue.password
  //     }
  //   })
  //   setLoading(false)
  //   if (res && res.status === 200 && res.data) {
  //     setStore('user', res.data.user)
  //     setStore('token', 'token')
  //     props.history.push('/')
  //   } else {
  //     errorTips(
  //       '登录失败',
  //       res && res.data && res.data.msg
  //         ? res.data.msg
  //         : '请求错误，请重试！'
  //     )
  //   }
  // }

  // const errorTips = (message = '', description = '') => {
  //   notification.error({
  //     message,
  //     description
  //   })
  }

  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      description
    })
  }

  return (
    <Row className={styles.loginContainer}>
      <Col span={8}>
        <div className={styles.logoWrapper}>
          <div className={styles.logo} />
          <div className={styles.title}>XXX系统V1.0</div>
        </div>
      </Col>
      <Col span={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="用户名:admin"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="密码:admin"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

const Login = Form.create({ name: 'LoginForm' })(LoginForm)

export default Login
