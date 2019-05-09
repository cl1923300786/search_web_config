import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification, Button, Divider, Modal, Row, Col } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import moment from 'moment'
import AddSourceConfigModal from './AddSourceConfigModal'
import styles from './SourceConfig.module.less'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'

import { API_URL } from '../../config/Constant'
import { async } from 'q';
import { any } from 'prop-types';

const defaultDataSourceConfigForm = {
  dataSourceType:'',
  currentStep:0,
  databaseConfig:{
    ip:'',
    port:'',
    dbName:'',
    username:'',
    password:'',
    tableName:''
  }
}

const defaultDatabaseConfig = {
  dbType:'',
  ip:'',
  port:'',
  dbName:'',
  username:'',
  password:'',
  tableName:''
}

const defaultWordsForm = {
  id: '',
  word: '',
  wordPos: '',
  freshTime: moment().format('YYYY-MM-DD HH:mm:ss')
}



const contentParseForm = {
  words: '',
  keyWords: '',
  summary: ''
}

const defaultPageParams = {
  pageNumber: 0,
  pageCount: 10,
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
  const [selectedSourceType, setSelectedSourceType] = useState()


  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()
  const [data, setData] = useState([])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '14%'
    },
    // {
    //   title: '数据源类型',
    //   dataIndex: 'sourceType',
    //   key: 'sourceType',
    //   width: '14%'
    // },
    {
        title: '数据库类型',
        dataIndex: 'dbType',
        key: 'dbType',
        width: '14%'
    },
    {
        title: 'ip',
        dataIndex: 'ip',
        key: 'ip',
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
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '14%',
      render: (text: string, record: any) => (
        <div>
          <a
            style={{ color: 'rgba(56, 105, 255, .45)' }}
            onClick={() => viewWords(record)}
          >
            查看
          </a>
          
        </div>
      )
    }
  ]


  useEffect(() => {
    getDataSourceList({ pageNumber: 0, pageCount: 10 })
  }, [])

   /**
   * 获取用户列表
   */
  const getWordsAndPageInfo = async () => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/words/wordsAndPageInfo',
      api: API_URL,
      method: 'get'
    })
    setLoading(false)
    console.log(res)
    if (res && res.status === 200 && res.data) {
      defaultPageParams.total=res.data.data.pageInfo,
      setData(res.data.data.data)
    }else{
      console.log("请求错误")
    }
  }

 /**
   * 获取配置数据源列表
   */
  const getDataSourceList = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/db/list',
      api: API_URL,
      method: 'get'
    })
    setLoading(false)
    console.log('getDataSourceList',res)
    if (res && res.status === 200 && res.data) {
      setData(res.data.result)
    }else{
      console.log("请求错误")
    }
  }

  /**
   *  根据词查询
   */
  const searchWord = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/words/queryByWord',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      },
    })
    setLoading(false)
    console.log("###")
    console.log(res.data.data)
    if (res && res.status === 200 && res.data) {
      setData(res.data.data)
    }else{
      console.log("请求错误")
    }
  }

  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    searchWord({"word": searchParams.name})
    defaultPageParams.total=1
  }

  /**
   * 重置搜索(重置搜索条件、页码)
   */
  const resetList = () => {
    setPageParams(defaultPageParams)
    getWordsAndPageInfo()
    
  }


  /**
   * 查看用户
   */
  const viewWords = (item: any) => {
    setWordsForm(item)
    setViewWordsModal(true)
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
    if(selectedSourceType==="db"){
      const param = {
        tableName:params.tableName[0],
        ...databaseConfig
      }
      saveDatabaseConfig1(param)
    }else if(selectedSourceType==="file"){
      saveDatabaseConfig1(params)
    }
    
  }

  /**
   * 添加新的数据源
   */
  const saveDatabaseConfig1 = async (param: any) => {
    setLoading(true)
    var uri="/search/config/"+selectedSourceType+"/save"
    console.log("saveDatabaseConfig1",uri,param)
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
      successTips('数据源配置成功')
      handleCancel()
      resetDatabaseValue()
    } else {
      errorTips(
        '数据源配置失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

   /**
   * 添加新的数据源
   */
  const saveDatabaseConfig = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: "/search/config/save",
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips('数据源配置成功')
      handleCancel()
      resetDatabaseValue()
    } else {
      errorTips(
        '数据源配置失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }
  
  const resetDatabaseValue = ()=>{
    setDatabaseConfig(defaultDatabaseConfig)
    setStep(0)

  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNumber: number, size: number | undefined) => {
    setLoading(true)
    const params = {
      ...pageParams,
      pageNumber: pageNumber,
      time: moment().format('YYYY-MM-DD'),
      name: pageParams.name
    }
    setPageParams(params)
    getDataSourceList({
      pageNumber: pageNumber - 1,
      pageCount: pageParams.pageCount,
      name: pageParams.name
    })
  }

  const addSourceCinfig = ()=>{
    setSourceConfigvisible(true)
  }

  const addStep= () =>{
    setStep(step+1)
  }

  /**
   *   获取数据库表名
   */
  const getTableNames=async (param:any) =>{
    const { res } = await requestFn(dispatch, state, {
      url: `/search/config/dbinfo`,
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
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

  const formatChoiceList=(datas:any[])=>{
    return datas.map(v=>{
      return {
        key: v,
        label:v,
        value:v
      }
    })
  }

  const fetchTableNames =(param:any)=>{
    setDatabaseConfig(param)
    getTableNames(param)
  }

  const setSelectedSourceTypeAct =(param:any)=>{
    setSelectedSourceType(param)
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} />
      <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addSourceCinfig}>
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
          current: pageParams.pageNumber,
          total: pageParams.total,
          pageSize: pageParams.pageCount,
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
      />
    </>
  )
}

export default SourceConfig
