import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './UserViewModal.module.scss'

const UserViewModal = (props: any) => {

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
        <Col span={6} className={styles.label}>id：</Col>
        <Col span={12}>{props.property.id}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>姓名：</Col>
        <Col span={12}>{props.property.name}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>生日：</Col>
        <Col span={12}>{props.property.birthDay}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>住址：</Col>
        <Col span={12}>{props.property.city}</Col>
      </Row>
    </Modal>
  )
}

export default UserViewModal
