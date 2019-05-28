import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification, Button, Divider, Modal, Row, Col } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import UserModal from './UserModal'
import moment from 'moment'
import styles from './User.module.less'
import {
  SearchComponent,
  IParams
} from '../../components/search/SearchComponent'
import UserViewModal from './UserViewModal'
import { API_URL } from '../../config/Constant'

const defaultUserForm = {
  id: '',
  name: '',
  birthDay: moment().format('YYYY-MM-DD HH:mm:ss'),
  city: ''
}

const defaultPageParams = {
  number: 0,
  size: 10,
  total: 500,
  name: ''
}

const User = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [userForm, setUserForm] = useState(defaultUserForm)
  const [modalTitle, setModalTitle] = useState('新增用户')
  const [viewUserModal, setViewUserModal] = useState(false)
  const [pageParams, setPageParams] = useState(defaultPageParams)

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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '14&'
    },
    {
      title: '生日',
      dataIndex: 'birthDay',
      key: 'birthDay',
      width: '20%'
    },
    {
      title: '住址',
      dataIndex: 'city',
      key: 'city'
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
            onClick={() => viewUser(record)}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a style={{ color: '#1890ff' }} onClick={() => editUser(record)}>
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

  useEffect(() => {
    getUsers({ number: 0, size: 10 })
  }, [])

  /**
   * 获取用户列表
   */
  const getUsers = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/v1/users',
      api: API_URL,
      method: 'get',
      params: {
        ...param
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      setData(res.data.users)
    }
  }

  /**
   * 点击查询
   */
  const search = (searchParams: IParams) => {
    getUsers({ number: 0, size: 10, name: searchParams.name })
  }

  /**
   * 重置搜索(重置搜索条件、页码)
   */
  const resetList = () => {
    setPageParams(defaultPageParams)
    getUsers({ number: 0, size: 10 })
  }

  /**
   * 新增/编辑用户请求
   */
  const saveUsers = async (param: any) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: param.id ? `/v1/users/${param.id}` : '/v1/users',
      api: API_URL,
      method: param.id ? 'patch' : 'post',
      data: {
        ...param
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      successTips(param.id ? '编辑用户成功' : '新增用户成功', '')
      getUsers({ number: 0, size: 10 })
    } else {
      errorTips(
        param.id ? '编辑用户失败' : '新增用户失败',
        res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！'
      )
    }
  }

  /**
   * 查看用户
   */
  const viewUser = (item: any) => {
    setUserForm(item)
    setViewUserModal(true)
  }

  /**
   * 编辑用户
   */
  const editUser = (item: any) => {
    setUserForm(item)
    setModalTitle('编辑用户')
    setVisible(true)
  }

  const deleteConirm = (item: any) => {
    Modal.confirm({
      title: '确定要删除这条记录吗?',
      content: '删除后不可恢复',
      onOk() {
        deleteUser(item.id)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  /**
   * 删除用户请求
   */
  const deleteUser = async (id: string) => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: `/v1/users/${id}`,
      api: API_URL,
      method: 'delete'
    })
    setLoading(false)
    if (res && res.status === 204 && res.data) {
      successTips('删除用户成功')
      getUsers({ number: 0, size: 10 })
    } else {
      errorTips(
        '删除用户失败',
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
   * 新增/编辑用户模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    handleCancel()
    const param = {
      ...(userForm.id ? { id: userForm.id } : {}),
      name: params.name,
      birthDay: moment(params.birthDay).format('YYYY-MM-DD'),
      city: params.city
    }
    saveUsers(param)
  }

  /**
   * 新增用户
   */
  const addUser = () => {
    setUserForm(defaultUserForm)
    setVisible(true)
  }

  /**
   * 列表翻页
   */
  const onPageChange = (pageNumber: number, size: number | undefined) => {
    setLoading(true)
    const params = {
      ...pageParams,
      number: pageNumber - 1,
      name: pageParams.name
    }
    setPageParams(params)
    getUsers({
      number: pageNumber - 1,
      size: pageParams.size,
      name: pageParams.name
    })
  }

  return (
    <>
      <SearchComponent onSearch={search} reset={resetList} type=""/>
      <Row className={styles.buttonRow}>
        <Col span={6}>
          <Button type="primary" icon="plus-circle" onClick={addUser}>
            新增
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
          current: pageParams.number + 1,
          total: pageParams.total,
          pageSize: pageParams.size,
          showTotal: (dataCount) => `共 ${dataCount} 条数据`,
          onChange: onPageChange
        }}
      />
      <UserModal
        visible={visible}
        title={modalTitle}
        property={userForm}
        cancel={handleCancel}
        submit={handleSubmit}
      />
      <UserViewModal
        visible={viewUserModal}
        title="查看"
        property={userForm}
        close={() => setViewUserModal(false)}/>
    </>
  )
}

export default User
