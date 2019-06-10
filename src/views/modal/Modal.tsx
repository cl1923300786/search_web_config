import React, { useState, useEffect } from 'react'
import { Button, Table, Divider, Popconfirm } from 'antd'
import EditModal from './editModal/EditModal'
import styles from './Modal.module.less'
import { SearchComponent } from '../../components/search/SearchComponent'

const defaultDataSource = [
  {
    id: 1,
    key: 1,
    dataIndex: 1,
    templateName: '模板1',
    indexField: [
      {
        name: 'name',
        remark: '姓名',
        type: 'STRING'
      },
      {
        name: 'age',
        remark: '年龄',
        type: 'INT'
      }
    ],
    listField: null,
    pageField: null,
    remark: '测试模板1',
    createTime: '2019-06-06 11:23:45',
    updateTime: null
  },
  {
    id: 2,
    key: 2,
    dataIndex: 2,
    templateName: '模板2',
    indexField: [
      {
        name: 'test1',
        remark: 'test1',
        type: 'STRING'
      },
      {
        name: 'test11',
        remark: 'test11',
        type: 'STRING'
      }
    ],
    listField: null,
    pageField: null,
    remark: '测试模板2',
    createTime: '2019-06-06 11:23:45',
    updateTime: null
  }
]

type modalIdType = number | string

interface IModalProperty {
  id: modalIdType
  templateName: string
  remark: string
}

/**
 * 默认模板属性(名称、备注)
 */
const defaultModalProperty: IModalProperty = {
  id: '',
  templateName: '',
  remark: ''
}

const Modal = () => {
  const [visible, setVisible] = useState(false)
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 366)
  const [dataSource, setDataSource] = useState(defaultDataSource)
  const [modalTitle, setModalTitle] = useState('新增模板')
  const [modalProperty, setModalProperty] = useState(defaultModalProperty)
  const [fields, setFields] = useState<any[]>([])
  const [actionType, setActionType] = useState('view')

  useEffect(() => {
    initSetTableHeight()
    listenTableHeight()
    return () => {
      removeListenTableHeight()
    }
  }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 100
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: '20%'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '20%'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text: string, record: any) => renderActionButtons(record)
    }
  ]

  /**
   * 删除指定的行(指定的模板)
   */
  const handleDelete = (record: any) => {
    const newDataSource = dataSource.filter((i: any) => record.id !== i.id)
    const datas = newDataSource.map((i: any, index: number) => {
      return {
        ...i,
        key: index + 1,
        dataIndex: index + 1
      }
    })
    setDataSource(datas)
  }

  /**
   * 渲染操作列按钮
   */
  const renderActionButtons = (record: any) => {
    return (
      <>
        <Button size="small" onClick={() => openModal(record, 'view')}>
          查看
        </Button>
        <Divider type="vertical" />
        <Button size="small" onClick={() => openModal(record, 'edit')}>
          编辑
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="确定要删除这一行吗?"
          onConfirm={() => handleDelete(record)}>
          <Button size="small" type="danger">
            删除
          </Button>
        </Popconfirm>
      </>
    )
  }

  /**
   * 查看模板
   */
  const openModal = (record: any, type: string) => {
    const modalFields = record.indexField.map((i: any, index: number) => {
      return {
        ...i,
        key: index + 1,
        dataIndex: index + 1
      }
    })
    const property = {
      id: record.id,
      templateName: record.templateName,
      remark: record.remark
    }
    setModalProperty(property)
    setActionType(type)
    setFields(modalFields)
    setVisible(true)
    setModalTitle(type === 'view' ? '查看模板' : '编辑模板')
  }

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
    setTableHeight(window.innerHeight - 366)
  }

  /**
   * 新增模板
   */
  const addModal = () => {
    setVisible(true)
    setModalProperty(defaultModalProperty)
    setActionType('edit')
    setFields([])
    setModalTitle('新增模板')
  }

  /**
   * 编辑模板模态窗点击取消
   */
  const handleCancel = () => {
    setVisible(false)
  }

  /**
   * 新增/编辑模板模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    console.log(params)
    handleCancel()
  }

  const search = () => {
    console.log('搜索模板')
  }

  const reset = () => {
    console.log('重置搜索模板')
  }

  const loadModal = () => {
    console.log('导入模板')
  }

  return (
    <div>
      <SearchComponent type="请输入模板名" reset={reset} onSearch={search} />
      <div className={styles.rowButton}>
        <Button type="primary" icon="plus-circle" ghost onClick={addModal}>
          新增模板
        </Button>
        <Button type="primary" icon="upload" ghost onClick={loadModal}>
          导入模板
        </Button>
      </div>
      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: tableHeight }}
        className="globalTableTd"
      />
      <EditModal
        visible={visible}
        cancel={handleCancel}
        type={actionType}
        property={modalProperty}
        fields={fields}
        title={modalTitle}
        submit={handleSubmit}
      />
    </div>
  )
}

export default Modal
