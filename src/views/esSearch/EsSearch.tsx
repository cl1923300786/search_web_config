import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification, Button, Divider, Modal, Row, Col } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import styles from './EsSearch.module.less'
import EsConfigModal from './EsConfigModal'
import EsSearchViewModal from './EsSearchViewModal'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'
import { API_URL } from '../../config/Constant';
import { any } from 'prop-types';

const defaultConfigForm = {
  ip: '',
  port: '',
  user: '',
  password: '',
  database: '',
  table: ''
}

const searchedItemForm = {
  id: '',
  title: '',
  content: '',
  freshTime: ''
}

const defaultPageParams = {
  pageNumber: 0,
  pageCount: 10,
  total: 500,
  name: ''
}

const EsSearch = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [configForm, setConfigForm] = useState(defaultConfigForm)
  const [modalTitle, setModalTitle] = useState('添加数据源')
  const [pageParams, setPageParams] = useState(defaultPageParams)
  const [searchedWord, setSearchedWord] = useState()
  const [itemForm, setItemForm] = useState(searchedItemForm)
  const [viewEsSearchModal, setViewEsSearchModal] = useState(false)

  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()
  const [data, setData] = useState()

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '14%'
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '14&'
    },
    {
        title: '正文',
        dataIndex: 'content',
        key: 'content',
        width: '14&'
    },
    {
      title: '时间',
      dataIndex: 'freshTime',
      key: 'freshTime',
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '14%',
      render: (text: string, record: any) => (
        <div>
          <a
            style={{ color: 'rgba(0, 0, 0, .45)' }}
            onClick={() => viewItems(record)}>
            查看
          </a>
          
        </div>
      )
    }
  ]


  /**
   * 查询ES
   */
  const searchWord = async (param: any) => {
    setLoading(true)
    setSearchedWord(param)
    const { res } = await requestFn(dispatch, state, {
      url: '/search/query',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    setLoading(false)
    console.log("11: ")
    console.log(res.data.result.hits)
    if (res && res.status === 200 && res.data) {
      setData(formatHits(res.data.result.hits))
    }else{
      console.log("请求错误")
    }
  }

  const formatHits = (hits: any[]) => {
    return hits.map(i => {
      console.log(i.highlight.title!='')
      return {
        id: i.doc.id,
        title: i.highlight.title!=null? i.highlight.title :i.doc.title,
        content: i.highlight.content!=null? i.highlight.content :i.doc.content,
        freshTime: i.doc.createTime
      }
    })
  }


  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    searchWord({  q: searchParams.name })
  }

  /**
   * 重置搜索(重置搜索条件、页码)
   */
  const resetList = () => {
     setPageParams(defaultPageParams)    
     setItemForm(searchedItemForm)   
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
    } else {
      errorTips(
        '数据源',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 查看用户
   */
  const viewItems = (item: any) => {
    setItemForm(item)
    setViewEsSearchModal(true)
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
   * 数据源配置模态窗点击取消
   */
  const handleCancel = () => {
    setVisible(false)
  }

  /**
   * 配置数据源模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    handleCancel()
    const param = {
      ...params,
      name: params.name
    }
    saveDatabaseConfig(param)
  }

  /**
   * 新增数据源配置
   */
  const addDataBaseConfig = () => {
    setConfigForm(defaultConfigForm)
    setVisible(true)
  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNumber: number, size: number | undefined) => {
    console.log("???")
    console.log(searchedWord)
    setLoading(true)
    const params = {
      ...pageParams,
      pageNumber: pageNumber,
      name: pageParams.name
    }
    setPageParams(params)
    const param ={
      ...searchedWord,
      pageNo: pageNumber - 1
    }
    searchWord(param)
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} />
      <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addDataBaseConfig}>
            数据源配置
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
      <EsConfigModal
        visible={visible}
        title={modalTitle}
        property={configForm}
        cancel={handleCancel}
        submit={handleSubmit}
      />
      <EsSearchViewModal
        visible={viewEsSearchModal}
        title="查看"
        property={itemForm}
        close={() => setViewEsSearchModal(false)}/>  
      />
      
    </>
  )
}

export default EsSearch
