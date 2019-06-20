import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  notification,
  Button,
  Divider,
  Modal,
  Row,
  Col,
  Upload,
  message
} from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import moment from 'moment'
import styles from './WordsManage.module.less'
import WordsModal from './WordsModal'
import WordsModalEdit from './WordsModalEdit'
import {
  SearchComponent
} from '../../components/search/SearchComponent'

import { API_URL } from '../../config/Constant'

const defaultWordsForm = {
  id: '',
  word: '',
  createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
}

const defaultPageParams = {
  pageNumber: 1,
  pageCount: 10,
  total: 1,
  name: ''
}

const WordsManagement = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [wordsForm, setWordsForm] = useState(defaultWordsForm)
  const [modalTitle, setModalTitle] = useState('新增词')
  const [pageParams, setPageParams] = useState(defaultPageParams)
  const [showItem, setShowItem] = useState(true)
  const [searchedWord, setSearchedWord] = useState()

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
      title: '词',
      dataIndex: 'word',
      key: 'word',
      width: '20%'
    },
    {
      title: '插入时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '20&'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '14%',
      //@ts-ignore
      render: (text:String,record: any) => (
        <div>
          <a style={{ color: '#1890ff' }} onClick={() => editWord(record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <a style={{ color: '#f5222d' }} onClick={() => deleteConfirm(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  useEffect(() => {
    const data1 = {
      pageNo: 1,
      pageSize: 10
    }
    getWords(data1)
  }, [])

  /**
   *   上传词表文件
   */
  const uploadWordsFile = {
    name: 'file',
    action: '/vocabulary/userdic/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  /**
   * 获取词表列表
   */
  const getWords = async (param: any) => {
    setLoading(true)
    console.log('getWords', param)
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/list',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    setLoading(false)
    console.log('getWords', res)
    if (res && res.status === 200 && res.data) {
      const pageP = {
        pageNumber: param.pageNo,
        pageCount: param.pageSize,
        total: res.data.result.totalCount,
        name: ''
      }
      setPageParams(pageP)
      handleWords(res.data.result.records)
    } else {
      console.log('请求错误')
    }
  }
  
  /**
   * 处理接口返回的关键词列表，主要天剑key和dataIndex
   */
  const handleWords = (records: any[]) => {
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
   *  根据词查询
   */
  const searchWord = async (param: any) => {
    setLoading(true)
    console.log('searchWord1', param)
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/list/',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    setLoading(false)
    console.log('searchWord:', res.data)
    if (res && res.status === 200 && res.data) {
      const pageP = {
        pageNumber: param.pageNo,
        pageCount: param.pageSize,
        total: res.data.result.totalCount,
        name: ''
      }
      setPageParams(pageP)
      // defaultPageParams.total=res.data.result.totalCount,
      setData(res.data.result.records)
    } else {
      console.log('请求错误')
    }
  }

  /**
   * 点击查询
   */
  const search = (searchParams: any) => {
    setShowItem(false)
    setSearchedWord(searchParams.name)
    const param = {
      pageNo: 1,
      pageSize: 10,
      q: searchParams.name
    }
    searchAct(param)
  }

  /**
   *  查询内容
   */
  const searchAct = (searchParams: any) => {
    searchWord(searchParams)
  }

  /**
   * 重置搜索(重置搜索条件、页码)
   */
  const resetList = () => {
    setShowItem(true)
    const param = {
      pageNo: 1,
      pageSize: 10
    }
    getWords(param)
  }

  /**
   * 新增，编辑词
   */
  const saveWords = async (param: any) => {
    console.log('saveWords:', param)
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/save',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    console.log('saveWords:', res)
    if (res && res.status === 200 && res.data) {
      successTips(param.id ? '编辑词表成功' : '新增词表成功', '')
      const pageP = {
        pageNo: pageParams.pageNumber,
        pageSize: pageParams.pageCount
      }
      getWords(pageP)
    } else {
      errorTips(
        param.id ? '编辑词表失败' : '新增词表失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 编辑词表
   */
  const editWord = (item: any) => {
    setWordsForm(item)
    setModalTitle('编辑词')
    setEditVisible(true)
  }

  /**
   * 编辑词表存储
   */
  const editWordSave = async (item: any) => {
    handleCancel()
    console.log('editWordSave:', item)
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/update',
      api: API_URL,
      method: 'post',
      data: {
        ...item
      }
    })
    setLoading(false)
    console.log('saveWords:', res)
    if (res && res.status === 200 && res.data) {
      successTips('编辑词表成功', '')
      const pageP = {
        pageNo: pageParams.pageNumber,
        pageSize: pageParams.pageCount
      }
      getWords(pageP)
    } else {
      errorTips('编辑词表失败', '请重试!')
    }
  }

  const deleteConfirm = (item: any) => {
    Modal.confirm({
      title: '确定要删除这条记录吗?',
      content: '删除后不可恢复',
      onOk() {
        deleteWords(item.id)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  /**
   * 删除用户请求
   */
  const deleteWords = async (id: string) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/delete/' + id,
      api: API_URL,
      method: 'get'
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips('删除词表成功')
      pageParams.total = pageParams.total - 1
      const pageP = {
        pageNo: pageParams.pageNumber,
        pageSize: pageParams.pageCount
      }
      getWords(pageP)
    } else {
      errorTips(
        '删除词表失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 错误提示
   */
  const errorTips = (messageString = '', description = '') => {
    notification.error({
      message: messageString,
      description
    })
  }

  /**
   * 成功提示
   */
  const successTips = (messageString = '', description = '') => {
    notification.success({
      message: messageString,
      description
    })
  }

  /**
   * 编辑用户模态窗点击取消
   */
  const handleCancel = () => {
    setVisible(false)
    setEditVisible(false)
  }

  /**
   * 新增/编辑词表模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    handleCancel()
    saveWords(params)
  }

  /**
   * 新增用户
   */
  const addWord = () => {
    setWordsForm(defaultWordsForm)
    setVisible(true)
  }

  /**
   * 刷新词表
   */
  const freshWord = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/vocabulary/userdic/sync',
      api: API_URL,
      method: 'get'
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips('更新词表成功', '')
    } else {
      errorTips('更新词表失败', '')
    }
  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNumber: number) => {
    setLoading(true)
    const params = {
      ...pageParams,
      pageNumber,
      time: moment().format('YYYY-MM-DD'),
      name: pageParams.name
    }
    setPageParams(params)
    console.log('onPageChange', showItem)
    if (showItem) {
      getWords({
        pageNo: pageNumber,
        pageSize: pageParams.pageCount,
        name: pageParams.name
      })
    } else {
      searchAct({
        pageNo: pageNumber,
        pageSize: pageParams.pageCount,
        q: pageParams.name ? pageParams.name : searchedWord
      })
    }
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} type=""/>
      <Row className={styles.buttonRow}>
        <Col span={3}>
          <Upload {...uploadWordsFile}>
            <Button type="primary">上传词表</Button>
          </Upload>
        </Col>
        <Col span={3}>
          <Button type="primary">
            <a
              href="http://10.168.3.216:8082/vocabulary/userdic/download"
              download="词表.txt">
              下载词表
            </a>
          </Button>
        </Col>
        <Col span={3}>
          <Button type="primary" onClick={addWord}>
            新增词
          </Button>
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={freshWord}>
            更新词表文件
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
          showTotal: (dataCount: any) => `共 ${dataCount} 条数据`,
          onChange: onPageChange
        }}
      />
      <WordsModal
        visible={visible}
        title={modalTitle}
        property={wordsForm}
        cancel={handleCancel}
        submit={handleSubmit}
      />
      <WordsModalEdit
        visible={editVisible}
        title={modalTitle}
        property={wordsForm}
        cancel={handleCancel}
        submit={editWordSave}
      />
    </>
  )
}

export default WordsManagement
