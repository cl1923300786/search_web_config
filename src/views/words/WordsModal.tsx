import React from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button,
  DatePicker
} from 'antd'
import moment from 'moment'

const WordsModalForm = (props: any) => {
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
        const fieldValue = getFieldsValue(['word', 'wordPos', 'freshTime'])
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
          <Form.Item label="词" required>
            {getFieldDecorator('word', {
              rules: [{ required: true, message: '请输入词' }],
              initialValue: props.property.word
            })(<Input placeholder="请输入词" />)}
          </Form.Item>
          <Form.Item label="词性" required>
            {getFieldDecorator('wordPos', {
              rules: [{ required: true, message: '请输入词xing' }],
              initialValue: props.property.wordPos
            })(<Input placeholder="请输入词性" />)}
          </Form.Item>
          <Form.Item label="时间" required>
            {getFieldDecorator('freshTime', {
              rules: [{ required: true, message: '请选择时间' }],
              initialValue: moment(props.property.freshTime, 'YYYY-MM-DD HH:mm:ss') 
            })(
              <DatePicker
                style={{width: '100%'}}
                placeholder="请选择时间"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const WordsModal = Form.create({ name: 'WordsModalForm' })(WordsModalForm)

export default WordsModal
