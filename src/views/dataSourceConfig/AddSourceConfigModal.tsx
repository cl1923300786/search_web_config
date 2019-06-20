import React, { useState, useEffect, useCallback } from 'react'
import {
  Row,
  Input,
  Form,
  Modal,
  Button,
  Select,
  Steps,
  Col,
  notification,
  Radio,
  Popover
} from 'antd'

import styles from './AddSourceConfig.module.less'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'

import { API_URL } from '../../config/Constant'
import { FormComponentProps } from 'antd/lib/form'
import {
  defaultNameMaxLength
} from '../../config/Constant'

const Option = Select.Option
const Step = Steps.Step

interface IAddSourceConfigProps extends FormComponentProps {
  visible: boolean
  formValues: any
  fetchTableNames: (params: any) => void
  tableNames: any[]
  columnNames: any
  cancel: () => void
  submit: (params: any) => void
  currentStep: number
  addStep: () => void
  goPrefixStep:()=>void
  getTableNames: (params: any) => Promise<void>
  selectedSourceType: string
  setSelectedSourceTypeAct: (params: any) => void
  templates: any
  selectedTableName: (params: any) => void
  selectTableName: any
  selectTemplate: any
  selectedTemplate: (id: any) => void
  dbNameMappingData: any[]
  setMappingData: (params: any) => void
  databaseConfig: any
}

const AddSourceConfigForm = (props: IAddSourceConfigProps) => {
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
    },
    {
      title: '选择数据源模板',
      content: 'Four-content'
    },
    {
      title: '字段映射',
      content: 'Five-content'
    },
    {
      title: '数据预览',
      content: 'Six-content'
    }
  ]
  // const [mappingDbData, setMappingDbData] = useState(props.dbNameMappingData)
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
  const [ dataSourceTypes, setDataSourceTypes] = useState<any[]>([])
  const [ duplicatedName, setDuplicatedName] = useState()
  // const [ mappingData, setMappingData] = useState<any[]>([])

  const state: IState = useMappedState(
    useCallback((globalState: IState) => globalState, [])
  )
  const dispatch: Dispatch<Actions> = useDispatch()

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

  useEffect(() => {
    fetchDataSourceTypes()
  }, [])

  /**  获取数据源类型
   */
  const fetchDataSourceTypes = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/src_types',
      api: API_URL,
      method: 'get'
    })
    console.log("fetchDataSourceTypes",res)
    if (res && res.status === 200 && res.data) {
      setDataSourceTypes(formatSourceDataTypes(res.data.result))
    } else {
      console.log('请求错误')
    }
  }

  const formatSourceDataTypes = (data: any[]) => {
    return data.map((item) => {
      return {
        key: item.type,
        label: item.type,
        type: item.type,
        type_name_zh: item.typeNameZh
      }
    })
  }

  /**  选择数据源类型
   */
  const renderDataSourceTypesOptions = () => {
    return dataSourceTypes.map((i: any) => {
      return (
        <Option key={i.type} value={i.type}>
          {i.type_name_zh}
        </Option>
      )
    })
  }

  /**  选择数据库表
   */
  const renderTableNamesOptions = () => {
    return props.tableNames.map((i: any) => {
      return (
        <Option key={i.value} value={i.value}>
          {i.value}
        </Option>
      )
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
    // props.form.validateFields((err: any, values: any) => {
    //   if (!err) {
    //     const fieldValue = getFieldsValue(['tableName'])
    //     props.submit(fieldValue)
    //   }
    // })
    props.submit({})
  }

  const selectDataSourceType = (value: any) => {
    props.setSelectedSourceTypeAct(value)
  }

  /**
   *   first step
   */
  const renderFirstStep = (formVal: any) => {
    return [
      <Form.Item key="dataSourceType" {...formItemLayout} label="数据源类型">
        {getFieldDecorator('dataSourceType', {
          initialValue:
            dataSourceTypes && dataSourceTypes[0] && dataSourceTypes[0].type
              ? dataSourceTypes[0].type
              : 'db'
        })(
          <Select
            style={{ width: '100%' }}
            placeholder="请选择数据源类型"
            filterOption={false}
            // labelInValue
            onChange={selectDataSourceType}>
            {renderDataSourceTypesOptions()}
          </Select>
        )}
      </Form.Item>
    ]
  }

  const renderSecondStep = (formVal: any) => {
    if (props.selectedSourceType === 'db') {
      return configDataBase(formVal)
    } else if (props.selectedSourceType === 'file') {
      return configFileSystem1(formVal)
    }
  }

  /**
   *   配置数据库连接
   */
  const configDataBase = (formVal: any) => {
    return [
      <Form.Item key="dbType" {...formItemLayout} label="数据库类型">
        {getFieldDecorator('dbType', {
          initialValue: formVal.dbType
        })(
          <Select
            style={{ width: '100%' }}
            // placeholder="请选择数据库类型"
            defaultValue="mysql"
            filterOption={false}>
            <Option key="mysql">mysql</Option>
          </Select>
        )}
      </Form.Item>,
      <Form.Item key="host" {...formItemLayout} label="host" required>
        {getFieldDecorator('host', {
          rules: [{ required: true, message: '请输入host' }],
          initialValue: props.databaseConfig.host
        })(<Input placeholder="请输入host" maxLength={defaultNameMaxLength}/>)}
      </Form.Item>,
      <Form.Item key="port" {...formItemLayout} label="端口" required>
        {getFieldDecorator('port', {
          rules: [{ required: true, message: '请输入端口' }],
          initialValue: props.databaseConfig.port
        })(<Input placeholder="请输入端口" maxLength={defaultNameMaxLength}/>)}
      </Form.Item>,
      <Form.Item key="dbName" {...formItemLayout} label="数据库名" required>
        {getFieldDecorator('dbName', {
          rules: [{ required: true, message: '请输入数据库名' }],
          initialValue: props.databaseConfig.dbName
        })(<Input placeholder="请输入数据库名" maxLength={defaultNameMaxLength}/>)}
      </Form.Item>,
      <Form.Item key="username" {...formItemLayout} label="用户名" required>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入用户名' }],
          initialValue: props.databaseConfig.username
        })(<Input placeholder="请输入用户名" maxLength={defaultNameMaxLength}/>)}
      </Form.Item>,
      <Form.Item key="password" {...formItemLayout} label="密码" required>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
          initialValue: props.databaseConfig.password
        })(<Input type="password" placeholder="请输入请输入密码" maxLength={defaultNameMaxLength}/>)}
      </Form.Item>
    ]
  }

  /**
   *   配置文件系统
   */
  const configFileSystem1 = (formVal: any) => {
    return [
      <Form.Item
        key="filePath"
        {...formItemLayout}
        label="文件传输路径"
        required>
        {getFieldDecorator('filePath', {
          rules: [{ required: true, message: '文件传输路径' }],
          initialValue: formVal.filePath
        })(<Input placeholder="文件传输路径" />)}
      </Form.Item>,
      <Form.Item key="username" {...formItemLayout} label="用户名" required>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入用户名' }],
          initialValue: formVal.username
        })(<Input placeholder="请输入用户名" />)}
      </Form.Item>,
      <Form.Item key="password" {...formItemLayout} label="密码" required>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
          initialValue: formVal.password
        })(<Input type="password" placeholder="请输入请输入密码" />)}
      </Form.Item>
    ]
  }

  /**
   *   third step
   *   目前只针对MySQL配置
   */
  const renderThirdStep = (formVal: any) => {
    return [
      <Form.Item key="tableName" {...formItemLayout} label="数据库表名">
        {getFieldDecorator('tableName', {
          initialValue: props.tableNames[0].value
        })(
          <Select
            style={{ width: '100%' }}
            // mode="multiple"
            placeholder="请选择数据库表名"
            filterOption={false}>
            {renderTableNamesOptions()}
          </Select>
        )}
      </Form.Item>
    ]
  }

  const onChange = (value: any) => {
    props.selectedTemplate(value)
  }

  const renderTemplateOptions = () => {
    return props.templates.map((i: any, index: number) => {
      return (
        // @ts-ignore
        <Option key={index} value={i.id} label={i.templateName}>
          <div>
            <p
              aria-label={i.templateName}
              style={{ fontSize: '14px', marginBottom: '0' }}>
              模板名:{i.templateName}
            </p>
            <p
              style={{
                fontSize: '12px',
                marginBottom: '0',
                color: 'rgba(0, 0, 0, 0.45)'
              }}>
              模板描述:{i.remark}
            </p>
          </div>
        </Option>
      )
    })
  }

  /**
   *    数据库第4步，选择模版
   */
  const renderFourStep = (formVal: any) => {
    return (
      <>
        <Row gutter={20} className={styles.rowItem}>
          <Col
            offset={4}
            span={4}
            className={styles.label}
            style={{ textAlign: 'left', lineHeight: '34px' }}>
            请选择模板
          </Col>
          <Col span={8} className={styles.label}>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择模板"
              onChange={onChange}
              optionLabelProp="label">
              {renderTemplateOptions()}
            </Select>
          </Col>
        </Row>
      </>
    )
  }

  const handleChange = (value: any, item: any, data: any[]) => {
    // console.log('handleChange',mappingData,item,props.columnNames[value])
    const newDataSource = props.dbNameMappingData.map((i: any) => {
      return {
        ...i,
        ...(item.name === i.name
          ? { columnName: props.columnNames[value] }
          : {})
      }
    })
    props.setMappingData(newDataSource)
  }

  const renderSelectComponents = (data: any[]) => {
    return data.map((item: any, index: number) => {
      return (
        <Row key={index} gutter={20} className={styles.rowItem}>
          <Col span={6}>
            <Form.Item required className={styles.formItem}>
              {getFieldDecorator(`a_${index}`, {
                initialValue: item.columnName
              })(
                <Select
                  style={{ width: '100%' }}
                  onChange={(value: any) => handleChange(value, item, data)}>
                  {renderOptions(props.columnNames)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>{item.name}</Col>
          <Col span={6} className={styles.rowLabel}>
            {item.type}
          </Col>
          <Col span={6} className={styles.rowLabel}>
            {item.remark}
          </Col>
        </Row>
      )
    })
  }

  const renderOptions = (options: string[]) => {
    return options.map((i: string, index: number) => {
      return <Option key={index}>{i}</Option>
    })
  }

  /**
   *    数据库第5步，模板字段匹配
   */
  const renderFiveStep = (formVal: any) => {
    return (
      <>
        <Row gutter={20} className={styles.rowItem}>
          <Col span={6}> 数据库字段名 </Col>
          <Col span={6}> 模板字段名 </Col>
          <Col span={6} className={styles.label}>
            模板字段类型
          </Col>
          <Col span={6} className={styles.label}>
            模板字段含义
          </Col>
        </Row>
        {renderSelectComponents(props.dbNameMappingData)}
      </>
    )
  }

  const renderSixStep = (formVal: any) => {
    return (
      <>
        <Row gutter={6} className={styles.rowItem}>
          <Col span={6}> 数据库表名 </Col>
          <Col span={6}> {props.selectTableName} </Col>
        </Row>
        <Row gutter={6} className={styles.rowItem}>
          <Col span={6}> 模板名 </Col>
          <Col span={6}>
            {
              props.templates.filter((item: any) => {
                if (item.id === props.selectTemplate) {
                  return true
                } else {
                  return false
                }
              })[0].templateName
            }
          </Col>
        </Row>
        <Row gutter={6} className={styles.rowItem}>
          <Col span={6}> 字段间的映射关系 </Col>
        </Row>
        <Row gutter={6} className={styles.rowItem}>
          <Col span={6}> 数据库字段名 </Col>
          <Col span={6}> 模板字段名 </Col>
          <Col span={6}> 模板字段类型 </Col>
          <Col span={6}> 模板字段含义 </Col>
        </Row>
        {props.dbNameMappingData.map((item: any, index: number) => {
          return (
            <Row key={index} gutter={6} className={styles.rowItem}>
              <Col span={6}>{item.columnName} </Col>
              <Col span={6}>{item.name} </Col>
              <Col span={6}>{item.type} </Col>
              <Col span={6}>{item.remark} </Col>
            </Row>
          )
        })}
      </>
    )
  }

  /**
   *   数据库字段与模板字段匹配
   */
  const dbNameMappingFunc = () => {
    const datas = new Array()
    const usedNames = new Set()
    const popData = props.templates.find(
      (i: any) => i.id === props.selectTemplate
    ).indexField
    popData.forEach((item: any) => {
      let findFlag = false
      for (const i of props.columnNames) {
        if (!usedNames.has(i)) {
          const score = strSimilarity2Percent(i, item.name)
          if (score > 0.5) {
            const mappingData = {
              columnName: i,
              name: item.name,
              remark: item.remark,
              type: item.type
            }
            datas.push(mappingData)
            findFlag = true
            usedNames.add(i)
            break
          }
        }
      }
      if (!findFlag) {
        const data = props.columnNames
          .filter((i: any) => {
            if (usedNames.has(i)) {
              return false
            } else {
              return true
            }
          }).pop()     
        const mappingData = {
          columnName: data,
          name: item.name,
          remark: item.remark,
          type: item.type
        }
        datas.push(mappingData)
        usedNames.add(data)
      }
    })
    // setMappingData(datas)
    props.setMappingData(datas)
  }

  const strSimilarity2Number = (s: string, t: string) => {
    const n = s.length
    const m = t.length
    const d = new Array()
    let i = 0
    let j = 0
    let sj = ''
    let tj = ''
    let cost = 0
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
      d[i] = []
      d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
      d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
      sj = s.charAt(i - 1)
      for (j = 1; j <= m; j++) {
        tj = t.charAt(j - 1)
        if (sj === tj) {
          cost = 0
        } else {
          cost = 1
        }
        d[i][j] = minimum(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        )
      }
    }
    return d[n][m]
  }

  // 两个字符串的相似程度，并返回相似度百分比
  const strSimilarity2Percent = (s: string, t: string) => {
    const l = s.length > t.length ? s.length : t.length
    const d = strSimilarity2Number(s, t)
    return 1 - d / l
  }

  const minimum = (a: string, b: string, c: string) => {
    return a < b ? (a < c ? a : c) : b < c ? b : c
  }

  const checkFilePath = (value: any) => {
    let path = value.filePath
    if (path.indexOf(':') < 5) {
      path = path.substring(path.indexOf(':') + 1)
    }
    const host = path.substring(0, path.indexOf(':'))
    const port = path.substring(path.indexOf(':') + 1, path.indexOf('/'))
    const filePath = path.substring(path.indexOf('/') + 1)
    if (host && port) {
      return {
        host,
        port,
        filePath,
        username: value.username,
        password: value.password
      }
    } else {
      return null
    }
  }

  /**
   *   点击上一步按钮
   */
  const handlePrefixStep = ()=>{
    props.goPrefixStep()
  }

  /**
   *   点击下一步按钮
   */
  const handleNextStep = () => {
    switch (props.currentStep) {
      case 0:
        {
          const fieldValue = getFieldsValue(['dataSourceType'])
          props.setSelectedSourceTypeAct(fieldValue.dataSourceType)
          props.addStep()
        }
        break
      case 1:
        {
          if (props.selectedSourceType === 'file') {
            validateFields((err: any, values: any) => {
              if (!err) {
                const fieldValue = getFieldsValue([
                  'filePath',
                  'username',
                  'password'
                ])
                // 检验文件路径
                const value = checkFilePath(fieldValue)
                if (value) {
                  props.submit(fieldValue)
                } else {
                  notification.error({
                    message: '参数配置错误',
                    description: '文件传输路径有误'
                  })
                }
              }
            })
          } else {
            validateFields((err: any, values: any) => {
              if (!err) {
                const fieldValue = getFieldsValue([
                  'dbType',
                  'host',
                  'port',
                  'dbName',
                  'username',
                  'password'
                ])               
                if(validateData(fieldValue)){
                  props.fetchTableNames(fieldValue)
                }else{
                  errorTips("不能输入空格")
                }
              }
            })
          }
        }
        break
      case 2:
        {
          validateFields((err: any, values: any) => {
            if (!err) {
              const fieldValue = getFieldsValue(['tableName'])
              props.selectedTableName(fieldValue)
            }
          })
        }
        break
      case 3:
        {
          if (props.selectTemplate) {
            props.addStep()
            dbNameMappingFunc()
          }
        }
        break
      case 4:
        const data= checkMappingData()
        if(!data){
          props.addStep()
        }else{
          errorTips(`数据库字段  --- ${data.columnName} ---- 选择重复`,"请重新选择1")
        }  
        break
      // case 4:
      //   props.addStep()
      //   break
    }
  }

  const validateData = (fieldValue:any)=>{
    if(fieldValue.host.trim().length===0){
      return false
    }
    if(fieldValue.port.trim().length===0){
      return false
    }
    if(fieldValue.dbName.trim().length===0){
      return false
    }
    if(fieldValue.username.trim().length===0){
      return false
    }
    if(fieldValue.password.trim().length===0){
      return false
    }
    return true
  }

  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  const checkMappingData = ()=>{
    const data=props.dbNameMappingData.filter((item:any)=>{
      if (item.columnName){
        return true
      }else {
        return false
      }
    })
    const set=new Set()
    const duplicateData = data.filter((item:any)=>{
      if (set.has(item.columnName)){
        setDuplicatedName(item.columnName)
        return true
      }else{
        set.add(item.columnName)
        return false 
      }
    })
    if(duplicateData.length===0){
      props.setMappingData(data)
      return ''
    }else{
      return duplicateData[0]
    }
     
  }

  const renderContent = (current: number, formVal: any) => {
    if (current === 0) {
      return renderFirstStep(formVal)
    } else if (current === 1) {
      return renderSecondStep(formVal)
    } else if (current === 2) {
      return renderThirdStep(formVal)
    } else if (current === 3) {
      return renderFourStep(formVal)
    } else if (current === 4) {
      return renderFiveStep(formVal)
    } else if (current === 5) {
      return renderSixStep(formVal)
    }
  }

  const renderFooter = (current: number) => {
    if (current !== 5) {
      return (
        <Row>
          <Col span={8} offset={16}>
            <Button htmlType="reset" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" onClick={handlePrefixStep}>
              上一步
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
          <Col span={8} offset={16}>
            <Button htmlType="reset" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={handlePrefixStep}>
              上一步
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              提交
            </Button>
          </Col>
        </Row>
      )
    }
  }

  // @ts-ignore
  const customDot = (dot: any, { status, index }) => (
    <Popover content={<span>第 {index + 1}步</span>}>{dot}</Popover>
  )

  return (
    <Modal
      title="配置数据源"
      visible={props.visible}
      width={960}
      closable={false}
      footer={renderFooter(props.currentStep)}>
      <Row className={styles.steps}>
        <Col span={24}>
          <Steps current={props.currentStep} progressDot={customDot}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>
      </Row>
      {renderContent(props.currentStep, props.formValues)}
    </Modal>
  )
}

const AddSourceConfigModal = Form.create<IAddSourceConfigProps>({
  name: 'AddSourceConfigForm'
})(AddSourceConfigForm)

export default AddSourceConfigModal
