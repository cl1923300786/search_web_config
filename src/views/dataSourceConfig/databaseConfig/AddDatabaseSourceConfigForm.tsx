import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Input, InputNumber, Radio, Form, Modal, Button, Select, DatePicker, Steps, Switch, Spin } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import moment from 'moment'
import styles from './AddTaskSimple.module.less'
import { defaultSiteTypeOptions, defaultLanguageOptions } from '../../../config/Constant'
import { useDispatch, IState, useMappedState } from '../../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../../store/Actions'
import { requestFn } from '../../../utils/request'
import debounce from 'lodash/debounce'
import AddDatabaseSourceConfigModal from './dadabaseConfig/AddDatabaseSourceConfigModal'

const Option = Select.Option

const defaultDayOfYearNumber: number = moment().dayOfYear()

const AddDatabaseSourceConfigForm = (props: any) => {


  const state: IState = useMappedState(useCallback((globalState: IState) => globalState, []))
  const dispatch: Dispatch<Actions> = useDispatch()
  const [dataSourceTypes, setDataSourceTypes] = useState<any[]>([])
  const [tableNames, setTableNames] = useState<any[]>([])
  

 

 /**  选择数据库表
   */
  const renderTableNamesOptions = () => {
    return tableNames.map((i: any) => {
      return <Option key={i.value}>{i.value}</Option>
    })
  }

 

  /**
   *   second step
   *   目前只针对MySQL配置
   */
  const renderSecondStep = ()=>{
    return [
      
      <Form.Item key="databaseType" {...formItemLayout} label="数据库类型">
      {getFieldDecorator('dataSourceType', {
        initialValue: props.databaseType
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          labelInValue
          placeholder="请选择数据库类型"
          notFoundContent={labelSearching ? <Spin size="small" /> : null}
          filterOption={false}
          // onSearch={getLabels}
          // onChange={handleLabelSelectChange}
        >
         <Option key=''>mysql</Option>
        </Select>
      )}
    </Form.Item>,
     <Form.Item key="ip" {...formItemLayout} label="ip" required>
      {getFieldDecorator('ip', {
        rules: [{ required: true, message: '请输入ip' }],
        initialValue: props.ip
      })(<Input placeholder="请输入ip" />)}
     </Form.Item>,
     <Form.Item key="port" {...formItemLayout} label="port" required>
      {getFieldDecorator('port', {
        rules: [{ required: true, message: '请输入port' }],
        initialValue: props.ip
      })(<Input placeholder="请输入port" />)}
     </Form.Item>,
     <Form.Item key="databaseName" {...formItemLayout} label="databaseName" required>
     {getFieldDecorator('databaseName', {
       rules: [{ required: true, message: '请输入数据库名' }],
       initialValue: props.databaseName
     })(<Input placeholder="请输入数据库名" />)}
    </Form.Item>,
      <Form.Item key="userName" {...formItemLayout} label="userName" required>
      {getFieldDecorator('userName', {
        rules: [{ required: true, message: '请输入用户名' }],
        initialValue: props.userName
      })(<Input placeholder="请输入用户名" />)}
     </Form.Item>,
       <Form.Item key="password" {...formItemLayout} label="password" required>
       {getFieldDecorator('password', {
         rules: [{ required: true, message: '请输入密码' }],
         initialValue: props.password
       })(<Input placeholder="请输入请输入密码" />)}
      </Form.Item>
       
    ]
  }

  /**
   *   third step
   *   目前只针对MySQL配置
   */
  const renderThirdStep = (formVal: any)=>{
    return [
      
      <Form.Item key="tableName" {...formItemLayout} label="数据库表名">
      {getFieldDecorator('tableName', {
        initialValue: formVal.tableName
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          labelInValue
          placeholder="请选择数据库表名"
          notFoundContent={labelSearching ? <Spin size="small" /> : null}
          filterOption={false}
          // onSearch={getLabels}
          // onChange={handleLabelSelectChange}
        >
        {renderTableNamesOptions()}
        </Select>
      )}
    </Form.Item>
    ]
  }

 
  const handleSecondNextStep = () => {
    validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue([
          'databaseType',
          'ip',
          'port',
          'databaseName',
          'userName',
          'password'
        ])
        setFormCurrentValue({ ...formCurrentValue, ...fieldValue })
        props.goNextStep({ ...formCurrentValue, ...fieldValue })
      }
    })
  }


}

const AddDatabaseSourceConfigModal = Form.create({ name: 'AddDatabaseSourceConfigForm' })(AddDatabaseSourceConfigForm)

export default AddDatabaseSourceConfigModal
