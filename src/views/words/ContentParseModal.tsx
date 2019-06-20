import React from 'react'
import { Row, Form, Modal, Button, Col } from 'antd'

import styles from './Words.module.less'
import TextArea from 'antd/lib/input/TextArea'
import { FormComponentProps } from 'antd/lib/form'

interface IContentParseProps extends FormComponentProps {
  visible: boolean
  title: string
  property: any
  parseText: (content: any) => Promise<void>
  close: () => void
}

const ContentParseForm = (props: IContentParseProps) => {
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
        <Button type="primary" htmlType="submit" onClick={handleCancel}>
          保存
        </Button>
      </Row>
    )
  }

  const handleCancel = () => {
    resetFields()
    props.close()
  }

  const parseContent = () => {
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['content'])
        props.parseText(fieldValue)
      }
    })
  }

  return (
    <>
      <Modal
        title={props.title}
        visible={props.visible}
        width={1000}
        closable={false}
        footer={renderFooter()}>
        <Form {...formItemLayout}>
          <Form.Item label="文本" required>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入文本' }],
              initialValue: props.property.content
            })(<TextArea placeholder="请输入文本" />)}
          </Form.Item>
        </Form>

        <Row className={styles.parseButtonRow}>
          <Col span={6}>
            <Button type="primary" onClick={parseContent}>
              解析
            </Button>
          </Col>
        </Row>

        <Row className={styles.parseButtonRow}>
          <Col span={6} className={styles.label}>
            词：
          </Col>
          <Col span={12}>{props.property.words}</Col>
        </Row>
        <Row className={styles.parseButtonRow}>
          <Col span={6} className={styles.label}>
            关键字：
          </Col>
          <Col span={12}>{props.property.keyWords}</Col>
        </Row>
        <Row className={styles.parseButtonRow}>
          <Col span={6} className={styles.label}>
            摘要：
          </Col>
          <Col span={12}>{props.property.summary}</Col>
        </Row>
      </Modal>
    </>
  )
}

const ContentParseModal = Form.create<IContentParseProps>({
  name: 'ContentParseForm'
})(ContentParseForm)

export default ContentParseModal
