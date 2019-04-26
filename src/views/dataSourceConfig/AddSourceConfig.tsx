import React, { useState, useEffect, useCallback } from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button,
  DatePicker,
  Select,
  Steps
} from 'antd'



const Option = Select.Option
const Step = Steps.Step

const AddSourceConfigForm = (props: any) => {

  const defaultDataSourceConfigForm = {
    'dataSourceType':'',
    'current_step':0,
    'databaseConfig':{
      'ip':'',
      'port':'',
      'databaseName':'',
      'userName':'',
      'password':'',
      'tableName':''
    }
  }
  
  const defaultDatabaseConfig = {
      'ip':'',
      'port':'',
      'databaseName':'',
      'userName':'',
      'password':'',
      'tableName':''
  }

  const { getFieldDecorator, getFieldsValue, validateFields } = props.form

  useEffect(() => {
    renderDataSourceTypesOptions()
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

  const [dataSourceConfigForm, setDataSourceConfigForm] = useState(defaultDataSourceConfigForm)
  const [dataSourceTypes, setDataSourceTypes] = useState<any[]>([])
  const [tableNames, setTableNames] = useState<any[]>([])
  const [databaseConfig, setDatabaseConfig] = useState<any[]>(defaultDatabaseConfig)
  const [databaseVisiable, setDatabaseVisiable] = useState(false)


  const renderFooter = () => {
    return (
      <Row>
        <Button htmlType="reset" onClick={handleCancel}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          保存
        </Button>
      </Row>
    )
  }

   /**  选择数据源类型
   */
  const renderDataSourceTypesOptions = () => {
    return dataSourceTypes.map((i: any) => {
      return <Option key={i.value}>{i.id}</Option>
    })
  }

 /**  选择数据库表
   */
  const renderTableNamesOptions = () => {
    return tableNames.map((i: any) => {
      return <Option key={i.value}>{i.value}</Option>
    })
  }

  const handleCancel = () => {
    resetFields()
    props.cancel()
  }

  const handleSubmit = () => {
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['ip', 'port', 'user', 'password', 'database', 'table'])
        props.submit(fieldValue)
      }
    })
  }

  /**
   *   first step
   */
  const renderFirstStep = ()=>{
    return [
      <Form.Item key="dataSourceType" {...formItemLayout} label="数据源类型">
      {getFieldDecorator('dataSourceType', {
        initialValue: dataSourceTypes
      })(
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          labelInValue
          placeholder="请选择数据源类型"
          filterOption={false}
          // onSearch={getLabels}
          // onChange={handleLabelSelectChange}
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
    return [
      
      <Form.Item key="databaseType" {...formItemLayout} label="数据库类型">
      {getFieldDecorator('dataSourceType', {
        initialValue: formVal.databaseType
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
     <Form.Item key="databaseName" {...formItemLayout} label="databaseName" required>
     {getFieldDecorator('databaseName', {
       rules: [{ required: true, message: '请输入数据库名' }],
       initialValue: formVal.databaseName
     })(<Input placeholder="请输入数据库名" />)}
    </Form.Item>,
      <Form.Item key="userName" {...formItemLayout} label="userName" required>
      {getFieldDecorator('userName', {
        rules: [{ required: true, message: '请输入用户名' }],
        initialValue: formVal.userName
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

  const handleFirstNextStep = () => {
    validateFields((err: any, values: any) => {
      if (!err) {
        const fieldValue = getFieldsValue([
          'dataSourceType'
        ])
      
      }
    })
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

  const handleNextStep = () => {
    
    if(dataSourceConfigForm.surrent_step===0){
      renderFirstStep
    }
    dataSourceConfigForm.surrent_step=dataSourceConfigForm.surrent_step+1
   }

  const renderContent = (current: number, formVal: any) => {
    if (current === 0) {
      renderFirstStep(formVal)
    } else (current === 1){
      renderSecondStep(formVal)
    } else (current === 2){
      renderThirdStep(formVal)
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
          <Col span={6} className={styles.prevStepButton}>
            <Button onClick={handlePreviousStep}>上一步</Button>
          </Col>
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
      footer={renderFooter(props.step)}
    >
      <Row className={styles.steps}>
        <Col offset={6} span={12}>
          <Steps current={props.step}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>
      </Row>
      {renderContent(props.step, formCurrentValue)}
    </Modal>

    <AddDatabaseSourceConfigModal
        visible={databaseVisiable}
        title="添加数据源"
        property={databaseConfig}
      //   parseText={parseText}
       close={() => setParseContentModal(databaseVisiable)}
    />
  )
}

const AddSourceConfigModal = Form.create({ name: 'AddSourceConfigForm' })(AddSourceConfigForm)

export default AddSourceConfigModal
