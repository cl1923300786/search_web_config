import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification, Button, Divider, Modal, Row, Col } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import moment from 'moment'
import AddSourceConfigModal from './AddSourceConfigModal'
import styles from './SourceConfig.module.less'
import DataSourceViewModal from './DataSourceViewModal'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'

import { API_URL } from '../../config/Constant'

const defaultDataSourceConfigForm = {
  dataSourceType: '',
  currentStep: 0,
  databaseConfig: {
    host: '',
    port: '',
    dbName: '',
    username: '',
    password: '',
    tableName: ''
  }
}

const defaultDatabaseConfig = {
  dbType: '',
  host: '',
  port: '',
  dbName: '',
  username: '',
  password: '',
  tableName: ''
}

const defaultWordsForm = {
  id: '',
  word: '',
  wordPos: '',
  freshTime: moment().format('YYYY-MM-DD HH:mm:ss')
}

const defaultPageParams = {
  pageNo: 1,
  pageSize: 10,
  total: 1,
  name: ''
}

const SourceConfig = () => {
  const [loading, setLoading] = useState(false)
  const [sourceConfigvisible, setSourceConfigvisible] = useState(false)
  const [wordsForm, setWordsForm] = useState(defaultWordsForm)
  const [modalTitle, setModalTitle] = useState('新增词')
  const [viewWordsModal, setViewWordsModal] = useState(false)
  const [pageParams, setPageParams] = useState(defaultPageParams)
  const [configForm, setConfigForm] = useState(defaultDataSourceConfigForm)
  const [step, setStep] = useState(0)
  const [tableNames, setTableNames] = useState<any[]>([])
  const [databaseConfig, setDatabaseConfig] = useState(defaultDatabaseConfig)
  const [selectedSourceType, setSelectedSourceType] = useState('db')
  const [viewDataSourceModal, setViewDataSourceModal] = useState(false)
  const [itemForm, setItemForm] = useState(defaultDatabaseConfig)
  const [searchedWord, setSearchedWord] = useState()
  const [templates, setTemplates] = useState()

  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()
  const [data, setData] = useState<any[]>([])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '14%'
    },
    {
      title: '数据库类型',
      dataIndex: 'dbType',
      key: 'dbType',
      width: '14%'
    },
    {
      title: 'host',
      dataIndex: 'host',
      key: 'host',
      width: '14%'
    },
    {
      title: '数据库名',
      dataIndex: 'dbName',
      key: 'dbName',
      width: '14%'
    },
    {
      title: '表名',
      dataIndex: 'tableName',
      key: 'tableName',
      width: '14%'
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '14%'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '14%',
      render: (text: string, record: any) => (
        <div>
          <a
            style={{ color: 'rgba(56, 105, 255, .45)' }}
            onClick={() => viewDataSource(record)}>
            查看
          </a>
        </div>
      )
    }
  ]

  useEffect(() => {
    getDataSourceList({ pageNo: 1, pageSize: 10 })
    fetchAllTemplates()
  }, [])

  /**
   *   获取所有的数据源模版
   */
  const fetchAllTemplates = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/db/list',
      api: API_URL,
      method: 'get'
    })
    if (res && res.status === 200 && res.data) {
      setTemplates(res.data.result.records)
    } else {
      errorTips(
        '获取数据模版失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 获取配置数据源列表
   */
  const getDataSourceList = async (param: any) => {
    console.log('getDataSourceList', param)
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/db/list',
      api: API_URL,
      method: 'get',
      params: param
    })
    setLoading(false)
    console.log('getDataSourceList', res)
    if (res && res.status === 200 && res.data) {
      setPageParams({
        ...pageParams,
        total: res.data.result.totalCount,
        pageNo: res.data.result.pageNo
      })
      handleDataSource(res.data.result.records)
    } else {
      errorTips(
        '获取数据源列表失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 出来接口返回的数据源(主要添加dataIndex)
   */
  const handleDataSource = (records: any[]) => {
    const arr = records.map((i: any) => {
      return {
        ...i,
        key: i.id,
        dataIndex: i.id
      }
    })
    setData(arr)
  }

  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    setSearchedWord(searchParams.name)
    getDataSourceList({ q: searchParams.name, pageNo: 1, pageSize: 10 })
  }

  /**
   * 重置搜索(重置搜索条件、页码)
   */
  const resetList = () => {
    setSearchedWord('')
    getDataSourceList({ pageNo: 1, pageSize: 10 })
  }

  /**
   * 查看用户
   */
  const viewDataSource = (item: any) => {
    setItemForm(item)
    setViewDataSourceModal(true)
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
   * 编辑用户模态窗点击取消
   */
  const handleCancel = () => {
    setSourceConfigvisible(false)
  }

  /**
   * 添加新的数据源
   */
  const handleSubmit = (params: any) => {
    console.log('handleSubmit')
    if (selectedSourceType === 'db') {
      const param = {
        tableName: params.tableName[0],
        ...databaseConfig
      }
      saveDatabaseConfig1(param)
    } else if (selectedSourceType === 'file') {
      saveDatabaseConfig1(checkParam(params))
    }
  }

  const checkParam = (params: any) => {
    const index = params.filePath.indexOf(':')
    const path =
      index < 5 ? params.filePath.substring(index + 1) : params.filePath
    const host = path.substring(0, path.indexOf(':'))
    const path1 = path.substring(path.indexOf(':') + 1)
    const port = path1.substring(0, path1.indexOf('/'))
    const path2 = path1.substring(path1.indexOf('/') + 1)
    return {
      host,
      port,
      filePath: path2,
      username: params.username,
      password: params.password
    }
  }

  /**
   * 添加新的数据源
   */
  const saveDatabaseConfig1 = async (param: any) => {
    setLoading(true)
    const uri = `/search/config/${selectedSourceType}/save`
    console.log('saveDatabaseConfig1', uri, param)
    const { res } = await requestFn(dispatch, state, {
      url: uri,
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    console.log('saveDatabaseConfig1 res111', res)
    if (res && res.status === 200 && res.data) {
      if (res.data.code === 0) {
        successTips('数据源配置成功')
        handleCancel()
        resetDatabaseValue()
      } else {
        errorTips(
          '数据源配置失败',
          res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
        )
      }
    } else {
      errorTips(
        '数据源配置失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  const resetDatabaseValue = () => {
    setDatabaseConfig(defaultDatabaseConfig)
    setStep(0)
  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNo: number, size: number | undefined) => {
    setLoading(true)
    const params = {
      ...pageParams,
      pageNo,
      time: moment().format('YYYY-MM-DD'),
      name: pageParams.name
    }
    setPageParams(params)
    getDataSourceList({
      pageNo,
      pageSize: pageParams.pageSize,
      name: pageParams.name,
      q: searchedWord
    })
  }

  const addSourceConfig = () => {
    setStep(0)
    setTableNames([])
    setDatabaseConfig(defaultDatabaseConfig)
    setSelectedSourceType('db')
    setSourceConfigvisible(true)
  }

  const addStep = () => {
    setStep(step + 1)
  }

  /**
   *   获取数据库表名
   */
  const getTableNames = async (param: any) => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/dbinfo',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    console.log('getTableNames', param)
    console.log('getTableNames', res)
    if (res && res.status === 200 && res.data.tables) {
      setTableNames(formatChoiceList(res.data.tables))
      addStep()
    } else {
      errorTips(
        '数据库连接失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  const formatChoiceList = (datas: any[]) => {
    return datas.map((v) => {
      return {
        key: v,
        label: v,
        value: v
      }
    })
  }

  const fetchTableNames = (param: any) => {
    setDatabaseConfig(param)
    getTableNames(param)
  }

  const setSelectedSourceTypeAct = (param: any) => {
    setSelectedSourceType(param)
  }

  return (
    <>
      <SearchComponent
        onSearch={search}
        reset={resetList}
        type="请输入表名关键字"
      />
      <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addSourceConfig}>
            配置数据源
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
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
      <AddSourceConfigModal
        visible={sourceConfigvisible}
        title={modalTitle}
        formValues={configForm}
        fetchTableNames={fetchTableNames}
        tableNames={tableNames}
        cancel={handleCancel}
        submit={handleSubmit}
        currentStep={step}
        addStep={addStep}
        getTableNames={getTableNames}
        selectedSourceType={selectedSourceType}
        setSelectedSourceTypeAct={setSelectedSourceTypeAct}
        templates={templates}
      />
      <DataSourceViewModal
        visible={viewDataSourceModal}
        title="查看"
        property={itemForm}
        close={() => setViewDataSourceModal(false)}
      />
    </>
  )
}

export default SourceConfig
