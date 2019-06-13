import React, { useEffect } from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'

interface IWordsModalFormProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  cancel: () => void
  submit: (params: any) => void
}

const WordsModalForm = (props: IWordsModalFormProps) => {
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

  useEffect(() => {
    resetFields()
  }, [])

  const handleCancel = () => {
    resetFields()
    props.cancel()
  }

  const handleSubmit = () => {
    props.form.validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['word', 'id'])
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
        <Form.Item label="id" required>
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入id' }],
              initialValue: props.property.id
            })(<Input type="text" readOnly />)}
        </Form.Item>
         <Form.Item label="词" required>
            {getFieldDecorator('word', {
              rules: [{ required: true, message: '请输入词' }],
              initialValue: props.property.word
            })(<Input placeholder="请输入词" />)}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const WordsModalEdit = Form.create<IWordsModalFormProps>({ name: 'WordsModalForm' })(WordsModalForm)

export default WordsModalEdit
