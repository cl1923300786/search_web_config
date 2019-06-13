import React from 'react'
import { Row, Input, Form, Modal, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

interface IEsConfigProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  cancel: () => void
  submit: (params: any) => void
}

const EsConfigModalForm = (props: IEsConfigProps) => {
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
        const fieldValue = getFieldsValue([
          'ip',
          'port',
          'userName',
          'password',
          'dbName',
          'tableName'
        ])
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
        footer={renderFooter()}>
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
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: props.property.userName
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item label="密码" required>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: props.property.password
            })(<Input placeholder="请输入密码" />)}
          </Form.Item>
          <Form.Item label="数据库名" required>
            {getFieldDecorator('dbName', {
              rules: [{ required: true, message: '请输入数据库名' }],
              initialValue: props.property.dbName
            })(<Input placeholder="请输入数据库名" />)}
          </Form.Item>
          <Form.Item label="数据库表名" required>
            {getFieldDecorator('tableName', {
              rules: [{ required: true, message: '请输入数据库表名' }],
              initialValue: props.property.tableName
            })(<Input placeholder="请输入数据库表名" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const EsConfigModal = Form.create<IEsConfigProps>({
  name: 'EsConfigModalForm'
})(EsConfigModalForm)

export default EsConfigModal
