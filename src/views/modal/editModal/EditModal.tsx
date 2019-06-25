import React, { useState, useEffect } from 'react'
import {
  Modal,
  Row,
  Button,
  Form,
  Input,
  Table,
  Col,
  Select,
  Popconfirm,
  Tooltip
} from 'antd'
import styles from './EditModal.module.less'
import {
  filedTypeOptions,
  IOPtion,
  defaultNameMaxLength,
  defaultRemarkMaxLength
} from '../../../config/Constant'
import { FormComponentProps } from 'antd/lib/form'
import { IModalProperty } from '../Modal'

interface IEditableTableFormProps extends FormComponentProps {
  dataSource: any[]
  save: (datas: any[]) => void
  type: any
  deleteRow: (id: number) => void
  updateDataSource: (value: any, recored: any) => void
}

interface IEditModalProps extends FormComponentProps {
  visible: boolean
  cancel: () => void
  type: string
  property: IModalProperty
  fields: any[]
  title: string
  submit: (params: any) => Promise<void>
}

const { Option } = Select

const EditableContext = React.createContext('')

const EditableRow = ({ form, index, ...props }: any) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const EditableCellForm = (props: any) => {
  const [ editing, setEditing] = useState(false)
  const { getFieldDecorator, validateFields, resetFields } = props.form

  /**
   * 切换编辑状态
   */
  const toggleEdit = () => {
    setEditing(!editing)
  }

  /**
   * 单元格编辑时，失去焦点，更新对应的字段值
   */
  const save = () => {
    validateFields((error: any, values: any) => {
      if (!error) {
        toggleEdit()
        resetFields()
      }
      props.handleSave({ ...props.record, ...values })
    })
  }

  /**
   * 渲染字段类型列的下拉选项
   */
  const renderTypeOptions = () => {
    return filedTypeOptions.map((i: IOPtion) => {
      return <Option key={i.value}>{i.label}</Option>
    })
  }

  /**
   * 渲染输入框
   */
  const renderFormItem = () => {
    if (props.dataIndex !== 'type') {
      return (
        <Form.Item style={{ margin: 0 }}>
          {getFieldDecorator(props.dataIndex, {
            rules: [
              {
                required: true,
                message: `请输入${
                  props.dataIndex === 'name' ? '字段名' : '含义'
                }`
              }
            ],
            initialValue: props.record[props.dataIndex]
          })(
            <Input
              onPressEnter={save}
              onBlur={save}
              autoFocus
              maxLength={
                props.dataIndex === 'name'
                  ? defaultNameMaxLength
                  : defaultRemarkMaxLength
              }
            />
          )}
        </Form.Item>
      )
    } else {
      return (
        <Form.Item required className={styles.formItem}>
          {getFieldDecorator(props.dataIndex, {
            initialValue: props.record[props.dataIndex]
          })(<Select style={{ width: '100%' }}>{renderTypeOptions()}</Select>)}
        </Form.Item>
      )
    }
  }

  /**
   * 渲染单元格
   */
  const renderCell = () => {
    return editing ? (
      { ...renderFormItem() }
    ) : (
      <Tooltip placement="topLeft" title={props.children}>
        <div
          className="globalEditableCellValueWrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}>
          {props.children}
        </div>
      </Tooltip>
    )
  }

  return (
    <td {...props.restProps}>
      {props.editable && props.type !== 'view' ? (
        <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
      ) : (
        props.children
      )}
    </td>
  )
}

const EditableCell = Form.create({ name: 'EditableCellForm' })(EditableCellForm)

const EditableTableForm = (props: IEditableTableFormProps) => {
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 500)

  useEffect(() => {
    initSetTableHeight()
    listenTableHeight()
    return () => {
      removeListenTableHeight()
    }
  }, [])

  /**
   * 监听窗口高度变化，调整table高度
   */
  const listenTableHeight = () => {
    window.addEventListener('resize', initSetTableHeight)
  }

  /**
   * 移除窗口变化监听。(监听窗口变化，目的是调整table高度用)
   */
  const removeListenTableHeight = () => {
    window.removeEventListener('resize', initSetTableHeight)
  }

  /**
   * 初始设置table列表高度
   */
  const initSetTableHeight = () => {
    setTableHeight(window.innerHeight - 500)
  }

  /**
   * 查看模板和新增及编辑模板公用的列
   */
  const commonColumns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80
    },
    {
      title: `模版字段${props.type !== 'view' ? '(点击单元格可编辑)' : ''}`,
      dataIndex: 'keyName',
      key: 'keyName',
      width: '26%',
      editable: true,
      className: 'globalColumnEllipsis'
    },
    {
      title: `字段名称${props.type !== 'view' ? '(点击单元格可编辑)' : ''}`,
      dataIndex: 'name',
      key: 'name',
      width: '26%',
      editable: true,
      className: 'globalColumnEllipsis'
    },
    {
      title: '模版类型',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      editable: false,
      render: (text: string, record: any) => renderTypeColnum(text, record)
    },
    {
      title: `模版含义${props.type !== 'view' ? '(点击单元格可编辑)' : ''}`,
      dataIndex: 'remark',
      key: 'remark',
      editable: true,
      className: 'globalColumnEllipsis'
    }
  ]

  /**
   * 新增/编辑模板操作列
   */
  const operationColumn = {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    render: (record: any) => (
      <Popconfirm
        title="确定要删除这一行吗?"
        onConfirm={() => handleDelete(record.key)}>
        <a href="javascript:;">删除</a>
      </Popconfirm>
    )
  }

  /**
   * table列
   */
  const columns =
    props.type === 'view' ? commonColumns : [...commonColumns, operationColumn]

  const components =
    props.type === 'view'
      ? {}
      : {
          body: {
            row: EditableFormRow,
            cell: EditableCell
          }
        }

  /**
   * 删除指定的行
   */
  const handleDelete = (key: number) => {
    props.deleteRow(key)
  }

  /**
   * 字段类型下拉选中后，更新列表中的字段类型
   */
  const handleChange = (value: any, record: any) => {
    props.updateDataSource(value, record)
  }

  /**
   * 渲染字段类型列(type)
   */
  const renderTypeColnum = (name: string, record: any) => {
    if (props.type !== 'view') {
      return (
        <Select
          style={{ width: '100%' }}
          value={record.type}
          onChange={(value: any) => handleChange(value, record)}>
          {renderTypeOptions()}
        </Select>
      )
    } else {
      return <div>{name}</div>
    }
  }

  /**
   * 渲染字段类型列的下拉选项
   */
  const renderTypeOptions = () => {
    return filedTypeOptions.map((i: IOPtion) => {
      return <Option key={i.value}>{i.label}</Option>
    })
  }

  /**
   * 单元格的保存方法
   */
  const handleSave = (row: any) => {
    const newDataSource = props.dataSource.map((i: any) => {
      return {
        ...i,
        ...(i.key === row.key ? row : {})
      }
    })
    props.save(newDataSource)
  }

  const newColumns = columns.map((col: any) => {
    if (!col.editable || props.type === 'view') {
      return col
    } else {
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave
        })
      }
    }
  })

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'globalEditableRow'}
        bordered
        pagination={false}
        scroll={{ y: tableHeight }}
        dataSource={props.dataSource}
        columns={newColumns}
      />
    </div>
  )
}

const EditableTable = Form.create<IEditableTableFormProps>({
  name: 'EditableTableForm'
})(EditableTableForm)

const EditModalForm = (props: IEditModalProps) => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [showTips, setShowTips] = useState(false)
  const [showTrimTips, setShowTrimTips] = useState(false)
  const {
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldsValue
  } = props.form

  useEffect(() => {
    resetFields()
    // 关闭模态窗后，重置table中的数据源，避免行内表单校验提示不消失的问题
    if (props.visible) {
      setDataSource(props.fields)
    } else {
      setDataSource([])
    }
  }, [props.visible, props.fields])

  const formItemLayout = {
    labelCol: {
      xl: { span: 4 },
      xxl: { span: 4 }
    },
    wrapperCol: {
      xl: { span: 16 },
      xxl: { span: 16 }
    }
  }

  /**
   * 删除指定的行
   */
  const deleteRow = (rowKey: number) => {
    const newDataSource = dataSource.filter((i: any) => i.key !== rowKey)
    const datas = newDataSource.map((i: any, index: number) => {
      return {
        ...i,
        key: index+1,
        dataIndex: index+1
      }
    })
    setDataSource(datas)
  }

  /**
   * 新增/编辑模板点击取消按钮事件
   */
  const handleCancel = () => {
    resetFields()
    setShowTips(false)
    props.cancel()
  }

  /**
   * 保存时，校验模板字段中的字段名及含义是否为空
   */
  const validDataSource = (data: any[], fieldValue:any) => {
    if (fieldValue.templateName.trim().length===0){
      setShowTrimTips(true)
      return false
    }
    if (fieldValue.remark.trim().length===0){
      setShowTrimTips(true)
      return false
    }
    if (data.length === 0) {
      setShowTrimTips(true)
      return false
    }   
    return data.every((i: any) => {
      return i.name !== '' && i.remark !== ''
    })
  }

  /**
   * 新增/编辑模板提交事件
   * 模版保存提交
   */
  const handleSubmit = () => {
    validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['templateName', 'remark'])
        if (validDataSource(dataSource, fieldValue)) {
          const data = formatData(fieldValue)
          const datas = formatDataSource(dataSource)
          props.submit({
            dataSource: datas,
            ...data,
            ...(props.title === '编辑模板' ? { id: props.property.id } : {})
          })
          // resetFields()
          setShowTips(false) 
          setShowTrimTips(false)
        } else {
          setShowTips(true)
        }
      }
    })
  }

  const formatDataSource = (datas:any[])=>{
    return datas.map((item:any)=>{
      return {
        ...item,
        name: item.name.trim(),
        remark: item.remark.trim()
      }
    })
  }

  const formatData = (fieldValue:any)=>{
    const data = {
      templateName: fieldValue.templateName.trim(),
      remark: fieldValue.remark.trim()
    }
    return data
  }


  /**
   * 新增模板时，若没有添加字段，则显示错误信息
   */
  const renderErrorTips = () => {
    if (showTrimTips){
      return <span className={styles.errorTips}>不能输入空格</span>
    }
    if (showTips) {
      return <span className={styles.errorTips}>请至少添加一个字段</span>
    }
  }

  /**
   * 新增行
   */
  const addRow = () => {
    const tmpData = {
      id: dataSource.length + 1,
      key: dataSource.length + 1,
      dataIndex: dataSource.length + 1,
      keyName: `name_${dataSource.length}`,
      name: `name_${dataSource.length}`,
      type: 'text',
      remark: `remark_${dataSource.length}`
    }
    const newDataSource = [...dataSource, tmpData]
    const datas = newDataSource.map((i: any, index: number) => {
      return {
        ...i,
        key: index + 1,
        dataIndex: index + 1
      }
    })
    setDataSource(datas)
    setShowTips(false)
  }

  /**
   * 渲染模态窗底部按钮
   */
  const renderFooter = () => {
    if (props.type !== 'view') {
      return (
        <Row>
          <Col span={6} className={styles.addRowButton}>
            <Button onClick={addRow}>新增行</Button>
          </Col>
          <Col span={8} offset={10}>
            {renderErrorTips()}
            <Button htmlType="reset" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              保存
            </Button>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row>
          <Button type="primary" htmlType="submit" onClick={handleCancel}>
            确定
          </Button>
        </Row>
      )
    }
  }

  /**
   * 渲染模板属性
   */
  const renderModalProperty = () => {
    if (props.type !== 'view') {
      return (
        <>
          <Form.Item {...formItemLayout} label="模板名" required>
            {getFieldDecorator('templateName', {
              initialValue: props.property.templateName,
              rules: [{ required: true, message: '请输入模板名' }]
            })(
              <Input
                placeholder="请输入模板名"
                size="small"
                maxLength={defaultNameMaxLength}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="模板描述" required>
            {getFieldDecorator('remark', {
              initialValue: props.property.remark,
              rules: [{ required: true, message: '请输入模板描述' }]
            })(
              <Input
                placeholder="请输入模板描述"
                size="small"
                maxLength={defaultRemarkMaxLength}
              />
            )}
          </Form.Item>
        </>
      )
    } else {
      return (
        <>
          <Row gutter={20} className={styles.rowItem}>
            <Col span={4} className={styles.label}>
              模板名： 
            </Col>
            <Col span={20}>{props.property.templateName}</Col>
          </Row>
          <Row gutter={20} className={styles.rowItem}>
            <Col span={4} className={styles.label}>
              模板描述： 
            </Col>
            <Col span={20}>{props.property.remark}</Col>
          </Row>
        </>
      )
    }
  }

  /**
   * 更新字段列表
   */
  const handleSave = (datas: any[]) => {
    setDataSource(datas)
  }

  /**
   * 字段类型，下拉选中时，更新字段列表中相应的值
   */
  const updateDataSource = (value: string, record: any) => {
    const newDataSource = dataSource.map((i: any) => {
      return {
        ...i,
        ...(record.key === i.key ? { type: value.trim() } : {})
      }
    })
    setDataSource(newDataSource)
  }

  return (
    <>
      <Modal
        title={props.title}
        visible={props.visible}
        width={960}
        closable={false}
        footer={renderFooter()}>
        {renderModalProperty()}
        <EditableTable
          dataSource={dataSource}
          save={handleSave}
          type={props.type}
          deleteRow={deleteRow}
          updateDataSource={updateDataSource}
        />
      </Modal>
    </>
  )
}

const EditModal = Form.create<IEditModalProps>({ name: 'EditModalForm' })(
  EditModalForm
)

export default EditModal
