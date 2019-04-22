import React, { useState, useEffect, useCallback } from 'react'
import { Table, notification } from 'antd'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'

const User = () => {
  const [loading, setLoading] = useState(false)
  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()
  const [data, setData] = useState([])

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    setLoading(true)
    const { res } = await requestFn(dispatch, state, {
      url: '/v1/users',
      method: 'get',
    })
    setLoading(false)
    if (res && res.status === 200 && res.data) {
      console.log(res.data)
      setData(res.data.users)
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

  const columns = [{
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '生日',
    dataIndex: 'birthDay',
    key: 'birthDay'
  }, {
    title: '住址',
    dataIndex: 'city',
    key: 'city'
  }]

  return (
    <>
    <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          total: 1500,
          pageSize: 10,
          showTotal: (dataCount) => `共 ${dataCount} 条数据`
        }}
      />
    </>
  )
}

export default User
