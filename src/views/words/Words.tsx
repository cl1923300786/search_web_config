import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification, Button, Divider, Modal, Row, Col } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import WordsModal from './WordsModal'
import moment from 'moment'
import styles from './Words.module.less'
import ContentParseModal from './ContentParseModal'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'
import WordsViewModal from './WordsViewModal'
import { API_URL } from '../../config/Constant'
import { async } from 'q';
import { any } from 'prop-types';

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

const Words = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [wordsForm, setWordsForm] = useState(defaultWordsForm)
  const [modalTitle, setModalTitle] = useState('新增词')
  const [viewWordsModal, setViewWordsModal] = useState(false)
  const [parseContentModal, setParseContentModal] = useState(false)
  const [pageParams, setPageParams] = useState(defaultPageParams)
  const [viewParseModal, setViewParseModal] = useState(contentParseForm)

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
    {
      title: '词',
      dataIndex: 'word',
      key: 'word',
      width: '14&'
    },
    {
        title: '词性',
        dataIndex: 'wordPos',
        key: 'wordPos',
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
            onClick={() => viewWords(record)}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a style={{ color: '#1890ff' }} onClick={() => editWords(record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <a style={{ color: '#f5222d' }} onClick={() => deleteConirm(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // useEffect(() => {
  //   getWords({ pageNumber: 0, pageCount: 10 })
  // }, [])


  useEffect(() => {
    getWordsAndPageInfo()
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
   * 获取用户列表
   */
  const getWords = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/words/fetchWordsByTime',
      api: API_URL,
      method: 'post',
      data: {
        ...param,
        time: moment().format('YYYY-MM-DD')
      },
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      setData(res.data.data)
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
      pageParams.pageCount=res.data.data.length
      pageParams.total=res.data.data.length
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
    defaultPageParams.pageCount=10
    setPageParams(defaultPageParams)
    getWordsAndPageInfo()
    
  }

  /**
   * 新增/编辑用户请求
   */
  const saveWords = async (param: any) => {
    console.log(param)
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/words/updateWord',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips(param.id ? '编辑词表成功' : '新增词表成功', '')
      const pageP = {
        pageNumber: pageParams.pageNumber-1,
        pageCount: pageParams.pageCount
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
   * 查看用户
   */
  const viewWords = (item: any) => {
    setWordsForm(item)
    setViewWordsModal(true)
  }

  /**
   * 编辑词表
   */
  const editWords = (item: any) => {
    setWordsForm(item)
    setModalTitle('编辑词')
    setVisible(true)
  }

  const deleteConirm = (item: any) => {
    Modal.confirm({
      title: '确定要删除这条记录吗?',
      content: '删除后不可恢复',
      onOk() {
        deleteWords(item.word)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  /**
   * 删除用户请求
   */
  const deleteWords = async (word: string) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: `/words/deleteWord`,
      api: API_URL,
      method: 'post',
      data: {
        word: word
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips('删除词表成功')
      const pageP = {
        pageNumber: pageParams.pageNumber-1,
        pageCount: pageParams.pageCount
      }
      getWords(pageP)
    } else {
      errorTips(
        '删除词表失败',
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
   * 编辑用户模态窗点击取消
   */
  const handleCancel = () => {
    setVisible(false)
  }

  /**
   * 新增/编辑词表模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    handleCancel()
    const param = {
      ...params,
      id: wordsForm.id
    }
    saveWords(param)
  }

  /**
   * 新增用户
   */
  const addWords = () => {
    setWordsForm(defaultWordsForm)
    setVisible(true)
  }

  /**
   * 展示解析文本窗口
   */
  const showParseTextModal = () => {
    setParseContentModal(true)
  }

  /**
   * 解析文本
   */
  const parseText = async (content: string) => {
    setLoading(true)
    console.log(content)
    const { res } = await requestFn(dispatch, state, {
      url: `/words/parseText`,
      api: API_URL,
      method: 'post',
      data: {
        content: content
      }
    })
    setLoading(false)
    console.log(res.data.data)
    if (res && res.status === 200 && res.data) {
      const modal={
        words: extractWords(res.data.data.words),
        keyWords: extractKeysWords(res.data.data.keyWords),
        summary: res.data.data.summary
      }
      setViewParseModal(modal)
    } else {
      errorTips(
        '解析文本失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  const extractWords= (words:any[])=>{
    var result=''
    words.map(i => { 
      result+=i.word+" ,"
    })
    if (result.length>0){
      result = result.substr(0,result.length-1)
    }
    return result
  }

  const extractKeysWords= (words:any[])=>{
    var result=''
    words.map(i => { 
      result+=i+" ,"
    })
    if (result.length>0){
      result = result.substr(0,result.length-1)
    }
    return result
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
    getWords({
      pageNumber: pageNumber - 1,
      pageCount: pageParams.pageCount,
      name: pageParams.name
    })
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} />
      <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addWords}>
            新增
          </Button>
        </Col>
        <Col span={6}>
          <Button type="primary"  onClick={showParseTextModal}>
            解析文本
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
      <WordsModal
        visible={visible}
        title={modalTitle}
        property={wordsForm}
        cancel={handleCancel}
        submit={handleSubmit}
      />
      <WordsViewModal
        visible={viewWordsModal}
        title="查看"
        property={wordsForm}
        close={() => setViewWordsModal(false)}
      />
       <ContentParseModal
        visible={parseContentModal}
        title="解析文本"
        property={viewParseModal}
        parseText={parseText}
        close={() => setParseContentModal(false)}
      />
    </>
  )
}

export default Words
