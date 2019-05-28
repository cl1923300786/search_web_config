import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './AddSourceConfig.module.less'

const DataSourceViewModal = (props: any) => {

  const handleClick = () => {
    props.close()
  }

  const renderFooter = () => {
    return (
      <Row>
        <Col>
          <Button type="primary" onClick={handleClick}>确定</Button>
        </Col>
      </Row>
    )
  }

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      width={800}
      closable={false}
      footer={renderFooter()}
    >

      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>数据库类型：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.dbType}} />
        </Col> 
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>host:</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.host}} />
        </Col> 
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>数据库名：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.dbName}} />
        </Col>    
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>表名：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.tableName}} />
        </Col> 
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>创建时间：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.createTime}} />
        </Col> 
      </Row> 
    </Modal>
  )
}

export default DataSourceViewModal
