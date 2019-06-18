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
  const [selectTemplate, setSelectTemplate] = useState()
  const [columnNames, setColumnNames] = useState()
  const [selectTableName, setSelectTableName] = useState()
  const [dbNameMappingData, setDbNameMappingData] = useState<any[]>([])

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
      width: 100
    },
    {
      title: '数据库类型',
      dataIndex: 'dbType',
      key: 'dbType',
      width: 160
    },
    {
      title: 'host',
      dataIndex: 'host',
      key: 'host'
    },
    {
      title: '数据库名',
      dataIndex: 'dbName',
      key: 'dbName',
      width: 200
    },
    {
      title: '表名',
      dataIndex: 'tableName',
      key: 'tableName',
      width: 200
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 240
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text: string, record: any) => (
        <div>
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => viewDataSource(record)}>
            查看
          </span>
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
      url: '/search/template/field/list',
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
   * 获取配置数据源列表，分页查询配置的数据源
   */
  const getDataSourceList = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/db/list',
      api: API_URL,
      method: 'get',
      params: param
    })
    setLoading(false)
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
   * 配置数据源的table数据(主要添加dataIndex)
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
   * 查看数据源
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
   * 编辑数据源模态窗点击取消
   */
  const handleCancel = () => {
    setSourceConfigvisible(false)
  }

  /**
   * 添加新的数据源
   */
  const handleSubmit = (params: any) => {
    if (selectedSourceType === 'db') {
      const mappedArr = dbNameMappingData.map((item: any) => {
        return {
          source: item.columnName,
          index: item.name,
          type: item.type,
          remark: item.remark
        }
      })
      const param = {
        ...databaseConfig,
        tableName: selectTableName,
        remark: '',
        mappingIndex: mappedArr,
        fieldTemplate: {
          id: selectTemplate
        }
      }
      saveDatabaseConfig1(param)
    } else if (selectedSourceType === 'file') {
      saveDatabaseConfig1(checkParam(params))
    }
  }

  /**
   *   添加数据源参数的格式校验
   */
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
    const { res } = await requestFn(dispatch, state, {
      url: uri,
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
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

  /**
   *  重置数据源配置的参数信息
   */
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

  /**
   *  添加数据源配置的按钮方法
   */
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
    if (res && res.status === 200 && res.data) {
      if (res.data.code===0){
        setTableNames(formatChoiceList(res.data.tables))
        addStep()
      }else{
        errorTips(
          '数据库连接失败',
          res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
        )
      }
    } else {
      errorTips(
        '数据库连接失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   *   获取数据库表的字段名
   */
  const getTableColumnNames = async (param: any) => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/tableinfo',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    console.log("getTableColumnNames",res)
    if (res && res.status === 200 && res.data.columns) {
      setColumnNames(formatColumnsList(res.data.columns))
      addStep()
    } else {
      errorTips(
        '数据库连接失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  const selectedTableName = (params: any) => {
    setSelectTableName(params.tableName)
    getTableColumnNames({
      ...databaseConfig,
      tableName: params.tableName
    })
  }

  const formatColumnsList = (datas: any[]) => {
    return datas.map((v) => {
      return v.name
    })
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

  /**
   *  获取所有的表名
   */
  const fetchTableNames = (param: any) => {
    setDatabaseConfig(param)
    getTableNames(param)
  }

  /**
   * 设置选择的数据源类型
   */
  const setSelectedSourceTypeAct = (param: any) => {
    setSelectedSourceType(param)
  }

  const selectedTemplate = (id: any) => {
    setSelectTemplate(id)
  }

  const setMappingData = (param: any) => {
    setDbNameMappingData(param)
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
        formValues={configForm}
        fetchTableNames={fetchTableNames}
        tableNames={tableNames}
        columnNames={columnNames}
        cancel={handleCancel}
        submit={handleSubmit}
        currentStep={step}
        addStep={addStep}
        getTableNames={getTableNames}
        selectedSourceType={selectedSourceType}
        setSelectedSourceTypeAct={setSelectedSourceTypeAct}
        templates={templates}
        selectedTableName={selectedTableName}
        selectTableName={selectTableName}
        selectTemplate={selectTemplate}
        selectedTemplate={selectedTemplate}
        dbNameMappingData={dbNameMappingData}
        setMappingData={setMappingData}
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
