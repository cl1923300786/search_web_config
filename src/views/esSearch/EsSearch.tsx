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
import { API_URL } from '../../config/Constant'

const defaultConfigForm = {
  ip: '',
  port: '',
  userName: '',
  password: '',
  dbName: '',
  tableName: ''
}

const searchedItemForm = {
  id: '',
  belongs_org: '',
  ccs_type: '',
  eng_title: '',
  expire_date: '',
  ics_type: '',
  issue_org: '',
  issuer: '',
  issus_date: '',
  language_type: '',
  publish_date: '',
  publish_org: '',
  record: '',
  source: '',
  status: '',
  std_abs: '',
  std_no: '',
  std_org: '',
  substract_std: '',
  substracted_std: '',
  usage_std: '',
  used_std: '',
  zh_title: ''
}

const defaultPageParams = {
  pageNumber: 1,
  pageCount: 10,
  total: 1,
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
      title: '标准号',
      dataIndex: 'std_no',
      key: 'std_no',
      width: '14%',
      className: styles.contentHighLight,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: '标题',
      dataIndex: 'zh_title',
      key: 'zh_title',
      width: '14%',
      className: styles.contentHighLight,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: '发布单位',
      dataIndex: 'publish_org',
      key: 'publish_org',
      width: '14%',
      className: styles.contentHighLight,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: '备案号',
      dataIndex: 'record',
      key: 'record',
      width: '14%',
      className: styles.contentHighLight,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '14%',
      className: styles.contentHighLight,
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: '发布日期',
      dataIndex: 'publish_date',
      key: 'publish_date',
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
      url: '/search/queryStd',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    setLoading(false)
    console.log('searchWord: ', param.pageNo, res.data)
    if (res && res.status === 200 && res.data) {
      defaultPageParams.total = res.data.result.totalHits
      defaultPageParams.pageNumber = param.pageNo
        ? param.pageNo + 1
        : defaultPageParams.pageNumber
      if (param.pageNo == 0) {
        defaultPageParams.pageNumber = 1
      }
      setPageParams(defaultPageParams),
        setData(formatHits(res.data.result.hits))
    } else {
      console.log('请求错误')
    }
  }

  const formatHits = (hits: any[]) => {
    return hits.map((i, index) => {
      return {
        id: i.doc.id,
        dataIndex: index,
        key: index,
        belongs_org:
          i.highlight['belongs_org.zh'] != null
            ? i.highlight['belongs_org.zh']
            : i.doc.belongs_org,
        ccs_type:
          i.highlight['ccs_type.zh'] != null
            ? i.highlight['ccs_type.zh']
            : i.doc.ccs_type,
        eng_title:
          i.highlight['eng_title.zh'] != null
            ? i.highlight['eng_title.zh']
            : i.doc.eng_title,
        expire_date:
          i.highlight['expire_date.zh'] != null
            ? i.highlight['expire_date.zh']
            : i.doc.expire_date,
        ics_type:
          i.highlight['ics_type.zh'] != null
            ? i.highlight['ics_type.zh']
            : i.doc.ics_type,
        issue_org:
          i.highlight['issue_org.zh'] != null
            ? i.highlight['issue_org.zh']
            : i.doc.issue_org,
        issuer:
          i.highlight['issuer.zh'] != null
            ? i.highlight['issuer.zh']
            : i.doc.issuer,
        issus_date:
          i.highlight['issus_date.zh'] != null
            ? i.highlight['issus_date.zh']
            : i.doc.issus_date,
        language_type:
          i.highlight['language_type.zh'] != null
            ? i.highlight['language_type.zh']
            : i.doc.language_type,
        publish_date:
          i.highlight['publish_date.zh'] != null
            ? i.highlight['publish_date.zh']
            : i.doc.publish_date,
        publish_org:
          i.highlight['publish_org.zh'] != null
            ? i.highlight['publish_org.zh']
            : i.doc.publish_org,
        record:
          i.highlight['record.zh'] != null
            ? i.highlight['record.zh']
            : i.doc.record,
        source:
          i.highlight['source.zh'] != null
            ? i.highlight['source.zh']
            : i.doc.source,
        status:
          i.highlight['status.zh'] != null
            ? i.highlight['status.zh']
            : i.doc.status,
        std_abs:
          i.highlight['std_abs.zh'] != null
            ? i.highlight['std_abs.zh']
            : i.doc.std_abs,
        std_no:
          i.highlight['std_no.zh'] != null
            ? i.highlight['std_no.zh']
            : i.doc.std_no,
        std_org:
          i.highlight['std_org.zh'] != null
            ? i.highlight['std_org.zh']
            : i.doc.std_org,
        substract_std:
          i.highlight['substract_std.zh'] != null
            ? i.highlight['substract_std.zh']
            : i.doc.substract_std,
        substracted_std:
          i.highlight['substracted_std.zh'] != null
            ? i.highlight['substracted_std.zh']
            : i.doc.substracted_std,
        usage_std:
          i.highlight['usage_std.zh'] != null
            ? i.highlight['usage_std.zh']
            : i.doc.usage_std,
        used_std:
          i.highlight['used_std.zh'] != null
            ? i.highlight['used_std.zh']
            : i.doc.used_std,
        zh_title:
          i.highlight['zh_title.zh'] != null
            ? i.highlight['zh_title.zh']
            : i.doc.zh_title
      }
    })
  }

  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    searchWord({ q: searchParams.name })
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
      url: '/search/config/save',
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
    console.log('???', pageNumber)
    setLoading(true)
    const params = {
      ...pageParams,
      pageNumber,
      name: pageParams.name
    }
    setPageParams(params)
    const param = {
      ...searchedWord,
      pageNo: pageNumber - 1
    }
    searchWord(param)
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} type=""/>
      {/* <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addDataBaseConfig}>
            数据源配置
          </Button>
        </Col>
      </Row> */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showQuickJumper: true,
          // defaultCurrent: 1,
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
        close={() => setViewEsSearchModal(false)}
      />
    </>
  )
}

export default EsSearch
