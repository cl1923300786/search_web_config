import React from 'react'
import { Row, Input, Form, Modal, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

interface IAddTemplateProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  cancel: () => void
  submit: (params: any) => void
}

const AddTemplateForm = (props: IAddTemplateProps) => {
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

        {/* return (
            <div>
                <Table     
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        ); */}
      </Modal>
    </>
  )
}

const AddTemplateModal = Form.create<IAddTemplateProps>({
  name: 'AddTemplateForm'
})(AddTemplateForm)

export default AddTemplateModal
