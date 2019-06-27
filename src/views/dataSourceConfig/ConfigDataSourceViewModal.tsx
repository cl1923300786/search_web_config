import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './AddSourceConfig.module.less'

const ConfigDataSourceViewModal = (props: any) => {
  const handleClick = () => {
    props.close()
  }

  const renderContent = () => {
      
    if (props.dbNameMappingData && props.templates && props.selectedTemplate && props.selectedTableName) {
      return (
        <>
          <Row gutter={5} className={styles.rowItem}>
            <Col span={5}> 数据库表名 </Col>
            <Col span={5}> {props.selectedTableName} </Col>
          </Row>
          <Row gutter={5} className={styles.rowItem}>
            <Col span={5}> 模板名 </Col>
            <Col span={5}>
              {
                props.templates.filter((item: any) => {
                  if (item.id === props.selectedTemplate) {
                    return true
                  } else {
                    return false
                  }
                })[0].templateName
              }
            </Col>
          </Row>
          <Row gutter={5} className={styles.rowItem}>
            <Col span={5}> 字段间的映射关系 </Col>
          </Row>
          <Row gutter={5} className={styles.rowItem}>
            <Col span={4}> 数据库字段名 </Col>
            <Col span={4}> 模板字段 </Col>
            <Col span={4}> 模板字段名 </Col>
            <Col span={4}> 模板字段类型 </Col>
            <Col span={4}> 模板字段含义 </Col>
          </Row>
          {props.dbNameMappingData.map((item: any, index: number) => {
            return (
              <Row key={index} gutter={6} className={styles.rowItem}>
                <Col span={4}>{item.columnName} </Col>
                <Col span={4}>{item.keyName} </Col>
                <Col span={4}>{item.name} </Col>
                <Col span={4}>{item.type} </Col>
                <Col span={4}>{item.remark} </Col>
              </Row>
            )
          })}
        </>
      )
    }
  }

  const renderFooter = () => {
    return (
      <Row>
        <Col>
          <Button type="primary" onClick={handleClick}>
            确定
          </Button>
        </Col>
      </Row>
    )
  }

  return (
    <Modal title={props.title} visible={props.visible} width={800} closable={false} footer={renderFooter()}>
      {renderContent()}
    </Modal>
  )
}

export default ConfigDataSourceViewModal
