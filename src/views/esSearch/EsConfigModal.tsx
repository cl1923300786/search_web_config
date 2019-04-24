import React from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button,
  DatePicker
} from 'antd'

const EsConfigModalForm = (props: any) => {
  const { getFieldDecorator, getFieldsValue, resetFields } = props.form

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 }
    }
  }

  const renderFooter = () => {
    return (
      <Row>
        <Button htmlType="reset" onClick={handleCancel}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          保存
        </Button>
      </Row>
    )
  }

  const handleCancel = () => {
    resetFields()
    props.cancel()
  }

  const handleSubmit = () => {
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['ip', 'port', 'user', 'password', 'database', 'table'])
        props.submit(fieldValue)
      }
    })
  }

  return (
    <>
      <Modal
        title={props.title}
        visible={props.visible}
        width={800}
        closable={false}
        footer={renderFooter()}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ip" required>
            {getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入ip' }],
              initialValue: props.property.ip
            })(<Input placeholder="请输入ip" />)}
          </Form.Item>
          <Form.Item label="port" required>
            {getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入port' }],
              initialValue: props.property.port
            })(<Input placeholder="请输入port" />)}
          </Form.Item>
          <Form.Item label="用户名" required>
            {getFieldDecorator('user', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: props.property.user
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item label="密码" required>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: props.property.password
            })(<Input placeholder="请输入密码" />)}
          </Form.Item>
          <Form.Item label="数据库名" required>
            {getFieldDecorator('database', {
              rules: [{ required: true, message: '请输入数据库名' }],
              initialValue: props.property.database
            })(<Input placeholder="请输入数据库名" />)}
          </Form.Item>
          <Form.Item label="数据库表名" required>
            {getFieldDecorator('table', {
              rules: [{ required: true, message: '请输入数据库表名' }],
              initialValue: props.property.table
            })(<Input placeholder="请输入数据库表名" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const EsConfigModal = Form.create({ name: 'EsConfigModalForm' })(EsConfigModalForm)

export default EsConfigModal
