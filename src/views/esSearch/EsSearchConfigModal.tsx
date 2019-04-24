import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './EsSearchConfigModal.module.less'

const EsSearchConfigModal = (props: any) => {

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
      <Row>
        <Col span={6} className={styles.label}>ip：</Col>
        <Col span={12}>{props.property.ip}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>port：</Col>
        <Col span={12}>{props.property.port}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>用户名：</Col>
        <Col span={12}>{props.property.userName}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>密码：</Col>
        <Col span={12}>{props.property.passwd}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>数据库名：</Col>
        <Col span={12}>{props.property.databaseName}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>数据库表名：</Col>
        <Col span={12}>{props.property.tableName}</Col>
      </Row>
    </Modal>
  )
}

export default EsSearchConfigModal
