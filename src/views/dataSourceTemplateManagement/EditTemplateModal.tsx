import React from 'react'
import { Row, Input, Form, Modal, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

interface IEditTemplateProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  close: () => void
  parseText: (text: string) => Promise<void>
}

const EditTemplateForm = (props: IEditTemplateProps) => {
  const { getFieldDecorator, getFieldsValue, resetFields, validateFields } = props.form

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
  }

  const handleSubmit = () => {
    validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue([
          'ip',
          'port',
          'userName',
          'password',
          'dbName',
          'tableName'
        ])
        console.log(fieldValue)
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
          <Form.Item label="模板名称" required>
            {getFieldDecorator('templateName', {
              rules: [{ required: true, message: '请输入模板名称' }]
            })(<Input placeholder="请输入模板名称" />)}
          </Form.Item>
          <Form.Item label="模板描述" required>
            {getFieldDecorator('templateDescribe', {
              rules: [{ required: true, message: '请输入模板描述' }]
            })(<Input placeholder="请输入模板描述" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const EditTemplateModal = Form.create<IEditTemplateProps>({
  name: 'EditTemplateForm'
})(EditTemplateForm)

export default EditTemplateModal
