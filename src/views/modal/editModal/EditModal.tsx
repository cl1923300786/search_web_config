import React, { useState, useEffect } from 'react'
import { Modal, Row, Button, Form, Input, Table } from 'antd'
import styles from './EditModal.module.less'

/**
 * 新增模板时，默认空白模板
 */
const defaultDataSource = [
  {
    id: 0,
    key: 0,
    dataIndex: 0,
    name: '123',
    type: 'STRING',
    remark: '456'
  }
]

const EditModalForm = (props: any) => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [showInput, setShowInput] = useState(false)
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const { getFieldDecorator, getFieldsValue, resetFields } = props.form

  useEffect(() => {
    setDataSource(defaultDataSource)
  }, [])

  const columns = [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
      render: (text: string, record: any) => renderNameColumn(text, record)
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%'
    },
    {
      title: '含义',
      dataIndex: 'remark',
      key: 'remark',
      width: '20%'
    }
  ]

  const renderNameColumn = (name: string, record: any) => {
    return (
      <div onClick={() => switchToInput(record)}>
        {renderNameTd(name, record)}
      </div>
    )
  }

  const renderNameTd = (name: string, record: any) => {
    if (showInput) {
      return (
        <Form.Item required className={styles.formItem}>
          {getFieldDecorator(`${name}${record.key}`, {
            initialValue: record.name,
            rules: [{ required: true, message: '请输入字段名' }]
          })(<Input placeholder="请输入字段名" size="small" onBlur={
            (event: React.FocusEvent<HTMLInputElement>) => handleInputBlur(event, 'name')
            }/>
          )}
        </Form.Item>
      )
    } else {
      return <div>{name}</div>
    }
  }

  const switchToInput = (record: any) => {
    if (!showInput) {
      setShowInput(!showInput)
      setCurrentRowIndex(record.key)
    }
  }

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>, columnName: string) => {
    setShowInput(!showInput)
    const newDataSource = dataSource.map((i: any) => {
      return {
        ...i,
        ...handleKey(columnName, event.target.value)
      }
    })
    setDataSource(newDataSource)
  }

  const handleKey = (columnName: string, value: any) => {
    if (columnName === 'name') {
      return { name: value }
    } else if (columnName === 'remark') {
      return { remark: value }
    } else {
      return { type: value }
    }
  }

  const handleCancel = () => {
    resetFields()
    props.cancel()
  }

  const handleSubmit = () => {
    props.form.validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['word'])
        props.submit(fieldValue)
        resetFields()
      }
    })
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

  return (
    <>
      <Modal
        title={props.title}
        visible={props.visible}
        width={800}
        closable={false}
        footer={renderFooter()}>
        <Table columns={columns} dataSource={dataSource} className="globalTableTd" />
      </Modal>
    </>
  )
}

const EditModal = Form.create({ name: 'EditModalForm' })(EditModalForm)

export default EditModal
