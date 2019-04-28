import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Input, InputNumber, Radio, Form, Modal, Button, Select, DatePicker, Steps, Switch, Spin } from 'antd'




import { useDispatch, IState, useMappedState } from '../../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../../store/Actions'


const Option = Select.Option


const AddDatabaseSourceConfigForm = (props: any) => {


  const state: IState = useMappedState(useCallback((globalState: IState) => globalState, []))
  const dispatch: Dispatch<Actions> = useDispatch()
  const [dataSourceTypes, setDataSourceTypes] = useState<any[]>([])
  const [tableNames, setTableNames] = useState<any[]>([])
  
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
 

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
      
      <Form.Item key="databaseType" label="数据库类型">
      {getFieldDecorator('dataSourceType', {
        initialValue: props.databaseType
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          labelInValue
          placeholder="请选择数据库类型"  
          filterOption={false}
          // onSearch={getLabels}
          // onChange={handleLabelSelectChange}
        >
         <Option key=''>mysql</Option>
        </Select>
      )}
    </Form.Item>,
     <Form.Item key="ip"  label="ip" required>
      {getFieldDecorator('ip', {
        rules: [{ required: true, message: '请输入ip' }],
        initialValue: props.ip
      })(<Input placeholder="请输入ip" />)}
     </Form.Item>,
     <Form.Item key="port"  label="port" required>
      {getFieldDecorator('port', {
        rules: [{ required: true, message: '请输入port' }],
        initialValue: props.ip
      })(<Input placeholder="请输入port" />)}
     </Form.Item>,
     <Form.Item key="databaseName"  label="databaseName" required>
     {getFieldDecorator('databaseName', {
       rules: [{ required: true, message: '请输入数据库名' }],
       initialValue: props.databaseName
     })(<Input placeholder="请输入数据库名" />)}
    </Form.Item>,
      <Form.Item key="userName"  label="userName" required>
      {getFieldDecorator('userName', {
        rules: [{ required: true, message: '请输入用户名' }],
        initialValue: props.userName
      })(<Input placeholder="请输入用户名" />)}
     </Form.Item>,
       <Form.Item key="password"  label="password" required>
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
      
      <Form.Item key="tableName" label="数据库表名">
      {getFieldDecorator('tableName', {
        initialValue: formVal.tableName
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          labelInValue
          placeholder="请选择数据库表名"  
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
       
      }
    })
  }


}




