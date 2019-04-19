import React, { useState, useCallback } from 'react'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import styles from './Login.module.scss'

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

  const LoginRequest = async (fieldValue: IParams) => {
    const { res } = await requestFn(dispatch, state, {
      url: '/v1/login',
      method: 'post',
      data: {
        username: fieldValue.userName,
        password: fieldValue.password
      }
    })
    setLoading(false)
    console.log(res)
    if (res.data) {
      props.history.push('/')
    }
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
                placeholder="用户名"
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
                placeholder="密码"
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
