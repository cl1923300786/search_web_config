import React, { useEffect, useCallback, useState } from 'react'
import { Row, Col, Steps, Popover, Button, Select, Form, Input, notification } from 'antd'
import styles from './AddSourceConfig.module.less'
import { requestFn } from '../../utils/request'
import { useDispatch, IState, useMappedState } from '../../store/Store'
import { Dispatch } from 'redux'
import Actions from '../../store/Actions'
import { API_URL, defaultNameMaxLength } from '../../config/Constant'
import ConfigDataSourceViewModal from './ConfigDataSourceViewModal'

const Step = Steps.Step
const Option = Select.Option

const ConfigDataSourceForm = (props: any) => {
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

  const steps = [
    {
      title: '配置数据源',
      content: 'First-content'
    },
    {
      title: '数据源字段映射',
      content: 'Second-content'
    }
  ]

  const defaultDataSourceType = [
    {
      key: '',
      label: '',
      type: '',
      typeNameZh: ''
    }
  ]

  const defaultTemplates = [
    {
      id: '',
      indexField: [
        {
          keyName: '',
          name: '',
          remark: '',
          type: ''
        }
      ],
      indexMappings: {},
      remark: '',
      templateName: ''
    }
  ]

  const defaultDatabaseConfig = {
    dbType: 'mysql',
    host: '',
    port: '',
    dbName: '',
    username: '',
    password: '',
    tableName: ''
  }

  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
  const state: IState = useMappedState(useCallback((globalState: IState) => globalState, []))
  const dispatch: Dispatch<Actions> = useDispatch()

  // 预览模态框展示
  const [visible, setVisible] = useState(false)
  // 当前步数
  const [currentStep, setCurrentStep] = useState(1)
  // 数据源类型
  const [dataSourceTypes, setDataSourceTypes] = useState(defaultDataSourceType)
  // 选择的数据源类型
  const [selectedDataSourceType, setSelectedDataSourceType] = useState()
  // 数据库配置
  const [databaseConfig, setDatabaseConfig] = useState(defaultDatabaseConfig)
  // 数据库表名
  const [tableNames, setTableNames] = useState<any[]>([])
  // 数据表的列名
  const [columnNames, setColumnNames] = useState()
  // 选择的模版名
  const [selectedTemplate, setSelectedTemplate] = useState()
  // 选择的表名
  const [selectedTableName, setSelectedTableName] = useState()
  // 数据表的字段映射
  const [dbNameMappingData, setDbNameMappingData] = useState<any[]>([])
  // 模版列表
  const [templates, setTemplates] = useState<any[]>(defaultTemplates)

  useEffect(() => {
    fetchDataSourceTypes()
    fetchAllTemplates()
  }, [])

  /**  获取数据源类型
   */
  const fetchDataSourceTypes = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/src_types',
      api: API_URL,
      method: 'get'
    })
    if (res && res.status === 200 && res.data) {
      setDataSourceTypes(formatSourceDataTypes(res.data.result))
    } else {
      console.log('请求错误')
    }
  }

  /**
   *  数据源类型的结构校验
   */
  const formatSourceDataTypes = (data: any[]) => {
    return data.map(item => {
      return {
        key: item.type,
        label: item.type,
        type: item.type,
        typeNameZh: item.typeNameZh
      }
    })
  }

  /**
   *   获取所有的数据源模版
   */
  const fetchAllTemplates = async () => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/template/field/list',
      api: API_URL,
      method: 'get'
    })
    if (res && res.status === 200 && res.data) {
      setTemplates(res.data.result.records)
    } else {
      errorTips('获取数据模版失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
    }
  }

  /**
   *   显示的正文部分
   */
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        {
          return renderFirstStep()
        }
        break
      case 2:
        {
          return renderSecondStep()
        }
        break
    }
  }

  /**
   *   第一步的界面展示
   */
  const renderFirstStep = () => {
    return (
      <>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择数据源类型"
          filterOption={false}
          onChange={selectDataSourceType}
        >
          {renderDataSourceTypesOptions()}
        </Select>
        {configDataSource()}
      </>
    )
  }

  /**  选择数据源类型的下拉列表
   */
  const renderDataSourceTypesOptions = () => {
    return dataSourceTypes.map((i: any) => {
      return (
        <Option key={i.type} value={i.type}>
          {i.typeNameZh}
        </Option>
      )
    })
  }

  /**
   *   选择数据源类型
   */
  const selectDataSourceType = (value: any) => {
    setSelectedDataSourceType(value)
  }

  /**
   *   配置数据源的方法
   */
  const configDataSource = () => {
    switch (selectedDataSourceType) {
      case 'db': {
        return configDBSource()
      }
      case 'file': {
        return configFileSource()
      }
    }
  }

  /**
   *  配置数据库的方法
   */
  const configDBSource = () => {
    return [
      <Form.Item key="dbType" {...formItemLayout} label="数据库类型">
        {getFieldDecorator('dbType', {
          initialValue: databaseConfig.dbType
        })(
          <Select style={{ width: '100%' }} filterOption={false}>
            <Option key="mysql">mysql</Option>
          </Select>
        )}
      </Form.Item>,
      <Form.Item key="host" {...formItemLayout} label="host" required>
        {getFieldDecorator('host', {
          rules: [{ required: true, message: '请输入host' }],
          initialValue: databaseConfig.host
        })(<Input placeholder="请输入host" maxLength={defaultNameMaxLength} />)}
      </Form.Item>,
      <Form.Item key="port" {...formItemLayout} label="端口" required>
        {getFieldDecorator('port', {
          rules: [{ required: true, message: '请输入端口' }],
          initialValue: databaseConfig.port
        })(<Input placeholder="请输入端口" maxLength={defaultNameMaxLength} />)}
      </Form.Item>,
      <Form.Item key="dbName" {...formItemLayout} label="数据库名" required>
        {getFieldDecorator('dbName', {
          rules: [{ required: true, message: '请输入数据库名' }],
          initialValue: databaseConfig.dbName
        })(<Input placeholder="请输入数据库名" maxLength={defaultNameMaxLength} />)}
      </Form.Item>,
      <Form.Item key="username" {...formItemLayout} label="用户名" required>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入用户名' }],
          initialValue: databaseConfig.username
        })(<Input placeholder="请输入用户名" maxLength={defaultNameMaxLength} />)}
      </Form.Item>,
      <Form.Item key="password" {...formItemLayout} label="密码" required>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
          initialValue: databaseConfig.password
        })(<Input type="password" placeholder="请输入请输入密码" maxLength={defaultNameMaxLength} />)}
      </Form.Item>
    ]
  }

  /**
   *  配置文件的方法
   */
  const configFileSource = () => {}

  /**
   *  第二步配置界面的展示
   */
  const renderSecondStep = () => {
    return (
      <>
        {renderTableNames()}
        {renderModals()}
        {renderDBNameMapping()}
      </>
    )
  }

  /**
   *  数据库表名的选择列表
   */
  const renderTableNames = () => {
    return (
      <Form.Item key="tableName" {...formItemLayout} label="数据库表名">
        {getFieldDecorator('tableName', {
          initialValue: tableNames[0].value
        })(
          <Select
            style={{ width: '100%' }}
            // mode="multiple"
            placeholder="请选择数据库表名"
            filterOption={false}
            onChange={onTableNameChange}
          >
            {renderTableNamesOptions()}
          </Select>
        )}
      </Form.Item>
    )
  }

  /**
   *  监听数据库表名的变动
   */
  const onTableNameChange = (value: any) => {
    console.log('onTableNameChange', value)
    setSelectedTableName(value)
    getTableColumnNames({
      ...databaseConfig,
      tableName: value
    })
  }

  /**  选择数据库表
   */
  const renderTableNamesOptions = () => {
    return tableNames.map((i: any) => {
      return (
        <Option key={i.value} value={i.value}>
          {i.value}
        </Option>
      )
    })
  }

  /**
   *  上一步
   */
  const handlePrefixStep = () => {
    setCurrentStep(currentStep - 1)
  }

  /**
   *  下一步
   */
  const handleNextStep = () => {
    validateDBSourceData()
  }

  /**
   *   检验数据库数据的配置信息
   */
  const validateDBSourceData = () => {
    validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['dbType', 'host', 'port', 'dbName', 'username', 'password'])
        if (validateData(fieldValue)) {
          setDatabaseConfig({ ...fieldValue })
          fetchTableNames(fieldValue)
        } else {
          errorTips('不能输入空格')
        }
      }
    })
  }

  /**
   *   获取数据库表的字段名
   */
  const getTableColumnNames = async (param: any) => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/tableinfo',
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    if (res && res.status === 200 && res.data.columns) {
      const array = formatColumnsList(res.data.columns)
      array.push('')
      setColumnNames(array)
    } else {
      errorTips('数据库连接失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
    }
  }

  const formatColumnsList = (datas: any[]) => {
    return datas.map(v => {
      return v.name
    })
  }

  /**
   *    选择数据源模版
   */
  const renderModals = () => {
    return (
      <>
        <Row gutter={20} className={styles.rowItem}>
          <Col offset={4} span={4} className={styles.label} style={{ textAlign: 'left', lineHeight: '34px' }}>
            请选择模板
          </Col>
          <Col span={8} className={styles.label}>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择模板"
              onChange={onTemplateChange}
              optionLabelProp="label"
            >
              {renderTemplateOptions()}
            </Select>
          </Col>
        </Row>
      </>
    )
  }

  /**
   *  监听数据模版的变动
   */
  const onTemplateChange = (value: any) => {
    console.log('onTemplateChange', value)
    setSelectedTemplate(value)
    dbNameMappingFunc(value)
  }

  /**
   *  数据库字段映射的方法
   */
  const renderDBNameMapping = () => {
    if (selectedTemplate && selectedTableName) {
      return (
        <>
          <Row gutter={20} className={styles.rowItem}>
            <Col span={4}>数据库字段</Col>
            <Col span={4}>数据库字段名</Col>
            <Col span={4}>模板字段名</Col>
            <Col span={4}>模板字段类型</Col>
            <Col span={4}>模板字段含义</Col>
          </Row>
          {renderSelectComponents()}
        </>
      )
    }
  }

  /**
   * 渲染第五步中每一行的数据库字段映射关系
   */
  const renderSelectComponents = () => {
    return dbNameMappingData.map((item: any, index: number) => {
      return (
        <Row key={index} gutter={20} className={styles.rowItem}>
          <Col span={4}>
            <Form.Item required className={styles.formItem}>
              {getFieldDecorator(`a_${index}`, {
                initialValue: item.columnName
              })(
                <Select style={{ width: '100%' }} onChange={(value: any) => handleDBNameChange(value, item)} allowClear>
                  {renderDBNameOptions(columnNames)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={4} className={styles.rowLabel}>
            {item.keyName}{' '}
          </Col>
          <Col span={4} className={styles.rowLabel}>
            {item.name}{' '}
          </Col>
          <Col span={4} className={styles.rowLabel}>
            {' '}
            {item.type}{' '}
          </Col>
          <Col span={4} className={styles.rowLabel}>
            {' '}
            {item.remark}{' '}
          </Col>
        </Row>
      )
    })
  }

  /**
   *  监听数据库表名的变动
   */
  const handleDBNameChange = (value: any, item: any) => {
    const newDataSource = dbNameMappingData.map((i: any) => {
      return {
        ...i,
        ...(item.name === i.name ? { columnName: columnNames[value] } : {})
      }
    })
    setDbNameMappingData(newDataSource)
  }

  /**
   *  数据库名的下拉列表
   */
  const renderDBNameOptions = (options: string[]) => {
    return options.map((i: string, index: number) => {
      return <Option key={index}>{i}</Option>
    })
  }

  /**
   *    选择模版
   */
  const renderTemplateOptions = () => {
    return templates.map((i: any, index: number) => {
      return (
        <Option key={index} value={i.id} label={i.templateName}>
          <div>
            <p aria-label={i.templateName} style={{ fontSize: '14px', marginBottom: '0' }}>
              模板名:{i.templateName}
            </p>
            <p
              style={{
                fontSize: '12px',
                marginBottom: '0',
                color: 'rgba(0, 0, 0, 0.45)'
              }}
            >
              模板描述:{i.remark}
            </p>
          </div>
        </Option>
      )
    })
  }

  /**
   *   获取数据库所有的表
   */
  const fetchTableNames = async (fieldValue: any) => {
    const { res } = await requestFn(dispatch, state, {
      url: '/search/config/dbinfo',
      api: API_URL,
      method: 'post',
      data: {
        ...fieldValue
      }
    })
    if (res && res.status === 200 && res.data) {
      if (res.data.code === 0) {
        const data = formatChoiceList(res.data.tables)
        setTableNames(data)
        setSelectedTableName(data[0].value)
        getTableColumnNames({
          ...fieldValue,
          tableName: data[0].value
        })
        setCurrentStep(currentStep + 1)
      } else {
        errorTips('数据库连接失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
      }
    } else {
      errorTips('数据库连接失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
    }
  }

  const formatChoiceList = (datas: any[]) => {
    return datas.map(v => {
      return {
        key: v,
        label: v,
        value: v
      }
    })
  }

  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      description
    })
  }

  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  /**
   *  检验 dbNameMappingData
   */
  const checkMappingData = () => {
    const data = dbNameMappingData.filter((item: any) => {
      if (item.columnName) {
        return true
      } else {
        return false
      }
    })
    const set = new Set()
    const duplicateData = data.filter((item: any) => {
      if (set.has(item.columnName)) {
        return true
      } else {
        set.add(item.columnName)
        return false
      }
    })
    if (duplicateData.length === 0) {
      setDbNameMappingData(data)
      return ''
    } else {
      return duplicateData[0]
    }
  }

  /**
   *  数据库配置信息的参数校验
   */
  const validateData = (fieldValue: any) => {
    if (fieldValue.host.trim().length === 0) {
      return false
    }
    if (fieldValue.port.trim().length === 0) {
      return false
    }
    if (fieldValue.dbName.trim().length === 0) {
      return false
    }
    if (fieldValue.username.trim().length === 0) {
      return false
    }
    if (fieldValue.password.trim().length === 0) {
      return false
    }
    return true
  }

  /**
   *   数据库字段与模板字段匹配
   */
  const dbNameMappingFunc = (templateId: any) => {
    if (templateId && columnNames) {
      const datas = new Array()
      const usedNames = new Set()
      const popData = templates.find((i: any) => i.id === templateId).indexField
      popData.forEach((item: any) => {
        let findFlag = false
        for (const i of columnNames) {
          if (!usedNames.has(i)) {
            const score = strSimilarity2Percent(i, item.name)
            if (score > 0.5) {
              const mappingData = {
                columnName: i,
                ...item
              }
              datas.push(mappingData)
              findFlag = true
              usedNames.add(i)
              break
            }
          }
        }
        if (!findFlag) {
          const data = columnNames
            .filter((i: any) => {
              if (usedNames.has(i)) {
                return false
              } else {
                return true
              }
            })
            .pop()
          const mappingData = {
            columnName: data,
            ...item
          }
          datas.push(mappingData)
          usedNames.add(data)
        }
      })
      setDbNameMappingData(datas)
    }
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
        d[i][j] = minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
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

  /**
   *  数据源配置校验
   */
  const handleSubmit = () => {
    const duplicateData = checkMappingData()
    if (!duplicateData) {
      submitData()
    } else {
      errorTips(`数据库字段  --- ${duplicateData.columnName} ---- 选择重复`, '请重新选择1')
    }
  }

  /**
   *   数据源配置提交
   */
  const submitData = () => {
    if (selectedDataSourceType === 'db') {
      const mappedArr = dbNameMappingData.map((item: any) => {
        return {
          source: item.columnName,
          index: item.name,
          indexName: item.keyName,
          type: item.type,
          remark: item.remark
        }
      })
      const param = {
        ...databaseConfig,
        tableName: selectedTableName,
        remark: '',
        mappingIndex: mappedArr,
        fieldTemplate: {
          id: selectedTemplate
        }
      }
      saveDatabaseConfig(param)
    } else if (selectedDataSourceType === 'file') {
      // saveDatabaseConfig(checkFileParam(params))
    }
  }

  /**
   *   添加数据源参数的格式校验
   */
  // @ts-ignore
  const checkFileParam = (params: any) => {
    const index = params.filePath.indexOf(':')
    const path = index < 5 ? params.filePath.substring(index + 1) : params.filePath
    const host = path.substring(0, path.indexOf(':'))
    const path1 = path.substring(path.indexOf(':') + 1)
    const port = path1.substring(0, path1.indexOf('/'))
    const path2 = path1.substring(path1.indexOf('/') + 1)
    return {
      host,
      port,
      filePath: path2,
      username: params.username,
      password: params.password
    }
  }

  /**
   * 添加新的数据源
   */
  const saveDatabaseConfig = async (param: any) => {
    const uri = `/search/config/${selectedDataSourceType}/save`
    const { res } = await requestFn(dispatch, state, {
      url: uri,
      api: API_URL,
      method: 'post',
      data: {
        ...param
      }
    })
    if (res && res.status === 200 && res.data) {
      if (res.data.code === 0) {
        successTips('数据源配置成功')
        resetDatabaseValue()
      } else {
        errorTips('数据源配置失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
      }
    } else {
      errorTips('数据源配置失败', res && res.data && res.data.msg ? res.data.msg : '网络异常，请重试！')
    }
  }

  /**
   *  重置数据源配置的参数信息
   */
  const resetDatabaseValue = () => {
    setDatabaseConfig(defaultDatabaseConfig)
    setCurrentStep(0)
  }

  const viewDataSourceModal = () => {
    const data = checkMappingData()
    if (!data) {
      setVisible(true)
    } else {
      errorTips(`数据库字段  --- ${data.columnName} ---- 选择重复`, '请重新选择')
    }
  }

  const renderFooter = () => {
    if (currentStep == 1) {
      return (
        <Row>
          <Col span={8} offset={16}>
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
            <Button type="primary" htmlType="submit" onClick={viewDataSourceModal}>
              预览
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

  const setViewVisible = () => {
    setVisible(false)
  }

  // @ts-ignore
  const customDot = (dot: any, { status, index }) => <Popover content={<span>第 {index + 1}步</span>}>{dot}</Popover>

  return (
    <>
      <Row className={styles.buttonRow}>
        <Col span={6}>数据源管理/配置数据源</Col>
      </Row>
      <Row className={styles.steps}>
        <Col span={24}>
          <Steps current={currentStep} progressDot={customDot}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>
      </Row>
      {renderContent()}
      {renderFooter()}

      <ConfigDataSourceViewModal
        visible={visible}
        title="查看"
        selectedTableName={selectedTableName}
        selectedTemplate={selectedTemplate}
        templates={templates}
        dbNameMappingData={dbNameMappingData}
        close={setViewVisible}
      />
    </>
  )
}

const ConfigDataSource = Form.create<any>({
  name: 'ConfigDataSourceForm'
})(ConfigDataSourceForm)

export default ConfigDataSource
