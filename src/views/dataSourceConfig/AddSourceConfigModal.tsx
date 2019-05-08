import React, { useState, useEffect, useCallback } from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button,
  Select,
  Steps,
  Col
} from 'antd'

import styles from './AddSourceConfig.module.less'
import { requestFn } from '../../utils/request';
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'

import { API_URL } from '../../config/Constant';

const Option = Select.Option
const Step = Steps.Step



const AddSourceConfigForm = (props: any) => {
  
  const steps = [
    {
      title: '选择数据源类型',
      content: 'First-content'
    },
    {
      title: '配置数据源',
      content: 'Second-content'
    },
    {
      title: '选择数据库表名',
      content: 'Third-content'
    }
  ]

  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
  const [dataSourceTypes, setDataSourceTypes] = useState<any[]>([])
  const [selectedDataSourceType, setSelectedDataSourceType] = useState("内部数据库")

  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()

  useEffect(() => {
    fetchDataSourceTypes()
  }, [])

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 }
    }
  }

  

  /**  获取数据源类型
   */
  const fetchDataSourceTypes = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/src_types',
      api: API_URL,
      method: 'get'
    })
  
    if (res && res.status === 200 && res.data) {
      setDataSourceTypes(res.data.result)
    }else{
      console.log("请求错误")
    }
  }


 
   /**  选择数据源类型
   */
  const renderDataSourceTypesOptions = () => {
    console.log('renderDataSourceTypesOptions')
    console.log(dataSourceTypes)
    return dataSourceTypes.map((i: any) => {
      return <Option key={i} >{i}</Option>
    })
  }

 /**  选择数据库表
   */
  const renderTableNamesOptions = () => {
    return props.tableNames.map((i: any) => {
      return <Option key={i.value}>{i.value}</Option>
    })
  }

  const handleCancel = () => {
    // resetFields()
    props.cancel()
  }

  /**
   *   提交数据源配置
   */
  const handleSubmit = () => {
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['tableName'])
        props.submit(fieldValue)
      }
    })
  }

  const selectDataSourceType =(value:any)=>{
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(value)
    setSelectedDataSourceType(value)
  }

  /**
   *   first step
   */
  const renderFirstStep = (formVal:any)=>{
    console.log('renderFirstStep')
    console.log(formVal)
    return [
      <Form.Item key="dataSourceType" {...formItemLayout} label="数据源类型">
      {getFieldDecorator('dataSourceType', {
        initialValue: dataSourceTypes
      })(
        <Select
          style={{ width: '100%' }}
          placeholder="请选择数据源类型"
          filterOption={false}
          onChange={selectDataSourceType}
        >
          {renderDataSourceTypesOptions()}
        </Select>
      )}
    </Form.Item>
    ]
  }

  /**
   *   second step
   *   目前只针对MySQL配置
   */
  const renderSecondStep = (formVal: any)=>{
    console.log(selectedDataSourceType)
    console.log(selectedDataSourceType=="内部数据库")
    if (selectedDataSourceType=="内部数据库"){
      return configDataBase(formVal)
    }else if(selectedDataSourceType=="文件系统"){
      return configFileSystem(formVal)
    }
  }

  /**
   *   配置数据库连接
   */
  const configDataBase=(formVal: any)=>{
    console.log('configDataBase')
    return [
      <Form.Item key="dbType" {...formItemLayout} label="数据库类型">
      {getFieldDecorator('dbType', {
        initialValue: formVal.dbType
      })(
        <Select
          style={{ width: '100%' }}
          placeholder="请选择数据库类型"        
          filterOption={false}
        >
         <Option key='mysql'>mysql</Option>
        </Select>
      )}
    </Form.Item>,
     <Form.Item key="ip" {...formItemLayout} label="ip" required>
      {getFieldDecorator('ip', {
        rules: [{ required: true, message: '请输入ip' }],
        initialValue: formVal.ip
      })(<Input placeholder="请输入ip" />)}
     </Form.Item>,
     <Form.Item key="port" {...formItemLayout} label="port" required>
      {getFieldDecorator('port', {
        rules: [{ required: true, message: '请输入port' }],
        initialValue: formVal.ip
      })(<Input placeholder="请输入port" />)}
     </Form.Item>,
     <Form.Item key="dbName" {...formItemLayout} label="dbName" required>
     {getFieldDecorator('dbName', {
       rules: [{ required: true, message: '请输入数据库名' }],
       initialValue: formVal.dbName
     })(<Input placeholder="请输入数据库名" />)}
    </Form.Item>,
      <Form.Item key="username" {...formItemLayout} label="username" required>
      {getFieldDecorator('username', {
        rules: [{ required: true, message: '请输入用户名' }],
        initialValue: formVal.username
      })(<Input placeholder="请输入用户名" />)}
     </Form.Item>,
       <Form.Item key="password" {...formItemLayout} label="password" required>
       {getFieldDecorator('password', {
         rules: [{ required: true, message: '请输入密码' }],
         initialValue: formVal.password
       })(<Input placeholder="请输入请输入密码" />)}
      </Form.Item>
    ]
  }


  /**
   *   配置文件系统
   */
  const configFileSystem=(formVal: any)=>{
    console.log('configFileSystem')
    return [
      <Form.Item key="protocol" {...formItemLayout} label="文件传输协议">
      {getFieldDecorator('protocol', {
        initialValue: formVal.protocol
      })(
        <Select
          style={{ width: '100%' }}
          placeholder="文件传输协议"        
          filterOption={false}
        >
         <Option key='ftp'>ftp</Option>
         <Option key='http'>http</Option>
        </Select>
      )}
    </Form.Item>,
     <Form.Item key="ip" {...formItemLayout} label="ip" required>
      {getFieldDecorator('ip', {
        rules: [{ required: true, message: '请输入ip' }],
        initialValue: formVal.ip
      })(<Input placeholder="请输入ip" />)}
     </Form.Item>,
     <Form.Item key="path" {...formItemLayout} label="path" required>
      {getFieldDecorator('path', {
        rules: [{ required: true, message: '请输入path' }],
        initialValue: formVal.ip
      })(<Input placeholder="请输入path" />)}
     </Form.Item>,
      <Form.Item key="username" {...formItemLayout} label="username" required>
      {getFieldDecorator('username', {
        rules: [{ required: true, message: '请输入用户名' }],
        initialValue: formVal.username
      })(<Input placeholder="请输入用户名" />)}
     </Form.Item>,
       <Form.Item key="password" {...formItemLayout} label="password" required>
       {getFieldDecorator('password', {
         rules: [{ required: true, message: '请输入密码' }],
         initialValue: formVal.password
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
        initialValue: props.tableName
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          placeholder="请选择数据库表名"      
          filterOption={false}
        >
        {renderTableNamesOptions()}
        </Select>
      )}
    </Form.Item>
    ]
  }
 

  const handleNextStep = () => {
    console.log('handleNextStep222')   
    if(props.currentStep===1){
      validateFields((err: any, values: any) => {
        if (!err) {
          const fieldValue = getFieldsValue([
            'dbType',
            'ip',
            'port',
            'dbName',
            'username',
            'password'
          ])
          console.log(fieldValue)  
          props.fetchTableNames(fieldValue)         
        }
      })
    }else{
      props.addStep()
    }
    
  }


  const renderContent = (current: number, formVal: any) => {
    if (current === 0) {
      return renderFirstStep(formVal)
    } else if(current === 1) {
      return renderSecondStep(formVal);
    } else if(current === 2) {
      return renderThirdStep(formVal);
    }
  }

  const renderFooter = (current: number) => {
    if (current != 2) {
      return (
        <Row>
          <Col span={8} offset={16}>
            <Button htmlType="reset" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" onClick={handleNextStep}>
              下一步
            </Button>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row>
          {/* <Col span={6} className={styles.prevStepButton}>
            <Button onClick={handlePreviousStep}>上一步</Button>
          </Col> */}
          <Col span={8} offset={10}>
            <Button htmlType="reset" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              提交
            </Button>
          </Col>
        </Row>
      )
    }
  }

  return (
    <Modal
      title="配置数据源"
      visible={props.visible}
      width={800}
      closable={false}
      footer={renderFooter(props.currentStep)}
    >
      <Row className={styles.steps}>
        <Col offset={6} span={15}>
          <Steps current={props.currentStep}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>
      </Row>
      {renderContent(props.currentStep, props.formValues)}
    </Modal>
  )
}

const AddSourceConfigModal = Form.create({ name: 'AddSourceConfigForm' })(AddSourceConfigForm)

export default AddSourceConfigModal
