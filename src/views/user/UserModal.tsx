import React from 'react'
import { Row, Input, Form, Modal, Button, DatePicker } from 'antd'
import moment from 'moment'
import { FormComponentProps } from 'antd/lib/form'

interface IUserProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  cancel: () => void
  submit: (params: any) => void
}

const UserModalForm = (props: any) => {
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
    props.form.validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['name', 'birthDay', 'city'])
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
          <Form.Item label="姓名" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入姓名' }],
              initialValue: props.property.name
            })(<Input placeholder="请输入姓名" />)}
          </Form.Item>
          <Form.Item label="生日" required>
            {getFieldDecorator('birthDay', {
              rules: [{ required: true, message: '请选择生日' }],
              initialValue: moment(
                props.property.birthDay,
                'YYYY-MM-DD HH:mm:ss'
              )
            })(
              <DatePicker style={{ width: '100%' }} placeholder="请选择生日" />
            )}
          </Form.Item>
          <Form.Item label="住址" required>
            {getFieldDecorator('city', {
              rules: [{ required: true, message: '请输入住址' }],
              initialValue: props.property.city
            })(<Input placeholder="请输入住址" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const UserModal = Form.create<IUserProps>({ name: 'UserModalForm' })(
  UserModalForm
)

export default UserModal
