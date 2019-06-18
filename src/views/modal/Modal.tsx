import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Divider, Popconfirm, notification } from 'antd'
import EditModal from './editModal/EditModal'
import styles from './Modal.module.less'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'
import { API_URL } from '../../config/Constant'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'

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

export interface IModalProperty {
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

const defaultPageParams = {
  pageNo: 1,
  pageSize: 10,
  total: 1,
  name: ''
}

const Modal = () => {
  const [visible, setVisible] = useState(false)
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 366)
  const [dataSource, setDataSource] = useState(defaultDataSource)
  const [modalTitle, setModalTitle] = useState('新增模板')
  const [modalProperty, setModalProperty] = useState(defaultModalProperty)
  const [fields, setFields] = useState<any[]>([])
  const [actionType, setActionType] = useState('view')
  const [pageParams, setPageParams] = useState(defaultPageParams)
  const [searchWord, setSearchWord] = useState()

  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()

  useEffect(() => {
    initSetTableHeight()
    listenTableHeight()
    getTemplates(defaultPageParams)
    return () => {
      removeListenTableHeight()
    }
  }, [])

  /**
   * 获取模版列表
   */
  const getTemplates = async (param: any) => {
    console.log('getTemplates param', param)
    const { res } = await requestFn(dispatch, state, {
      url: '/search/template/field/list',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    console.log(res.data)
    if (res && res.status === 200 && res.data) {
      setPageParams({ ...param, total: res.data.result.totalCount })
      parseData(res.data.result.records)
    } else {
      console.log('请求错误')
    }
  }

  const parseData = (datas: any[]) => {
    const result = datas.map((item: any, index: number) => {
      return {
        ...item,
        d: index,
        key: index,
        dataIndex: index
      }
    })
    setDataSource(result)
  }

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
  const handleDelete = async (record: any) => {
    const { res } = await requestFn(dispatch, state, {
      url: `/search/template/field/delete/${record.id}`,
      api: API_URL,
      method: 'get'
    })
    if (res && res.status === 200 && res.data) {
      freshDeteleAct(record)
    } else {
      errorTips(
        '删除模版失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   *  删除后，界面数据更新
   */
  const freshDeteleAct = (record: any) => {
    const newDataSource = dataSource.filter((i: any) => record.id !== i.id)
    const datas = newDataSource.map((i: any, index: number) => {
      return {
        ...i,
        key: index + 1,
        dataIndex: index + 1
      }
    })
    setDataSource(datas)
    setPageParams({ ...pageParams, total: pageParams.total - 1 })
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
    setModalProperty(defaultModalProperty)
    setVisible(false)
  }

  /**
   * 新增/编辑模板模态窗，点击确定
   */
  const handleSubmit = async (params: any) => {
    const set =new Set()
    const data = params.dataSource.filter((item:any)=>{
      if(set.has(item.name)){
        return true
      }else{
        set.add(item.name)
      }
    }).length
    if(data>0){
      errorTips("模版字段重复","需修改")
      return
    }
    if(modalProperty.templateName!=params.templateName){
      const length = dataSource.filter((item:any)=>{
        return item.templateName===params.templateName
      }).length
      if(length>0){
        errorTips("模版名已存在","需修改")
        return
      }
    }
    
    submitData(params)
    
  }


  const submitData = async (params: any)=>{
    const url = params.id
      ? '/search/template/field/update'
      : '/search/template/field/save'
      const indexField = params.dataSource.map((item: any) => {
        return {
          name: item.name,
          remark: item.remark,
          type: item.type
        }
      })
      const { res } = await requestFn(dispatch, state, {
        url,
        api: API_URL,
        method: 'post',
        data: {
          ...params,
          indexField
        }
      })
      if (res && res.status === 200 && res.data) {
        if (res.data.code==0){
          successTips(params.id ? '编辑模版成功' : '新增模版成功', '')
          if (searchWord) {
            getTemplates({ ...pageParams, q: searchWord })
          } else {
            getTemplates({ ...pageParams })
          }
          handleCancel()
        }else{
          errorTips(res.data.msg[0])
        }       
      } else {
        errorTips(
          params.id ? '编辑模版失败' : '新增模版失败',
          res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
        )
      }     
  }

  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      description
    })
  }

  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    setSearchWord(searchParams.name)
    setPageParams(defaultPageParams)
    const params = {
      q: searchParams.name,
      ...defaultPageParams
    }
    getTemplates(params)
  }

  const reset = () => {
    setDataSource([])
    setSearchWord('')
    getTemplates({ ...defaultPageParams })
  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNo: number, size: number | undefined) => {
    const params = {
      ...pageParams,
      pageNo,
      name: pageParams.name
    }
    setPageParams(params)
    if (searchWord) {
      getTemplates({ ...params, q: searchWord })
    } else {
      getTemplates({ ...params })
    }
  }

  return (
    <div>
      <SearchComponent type="请输入模板名" reset={reset} onSearch={search} />
      <div className={styles.rowButton}>
        <Button type="primary" icon="plus-circle" ghost onClick={addModal}>
          新增模板
        </Button>
        {/* <Button type="primary" icon="upload" ghost onClick={loadModal}>
          导入模板
        </Button> */}
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: tableHeight }}
        className="globalTableTd"
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          current: pageParams.pageNo,
          total: pageParams.total,
          pageSize: pageParams.pageSize,
          showTotal: (dataCount) => `共 ${dataCount} 条数据`,
          onChange: onPageChange
        }}
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

export { Modal }
