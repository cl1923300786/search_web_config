import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './WordsViewModal.module.less'


interface IWordsViewProps {
  visible: boolean
  title: string
  property: any
  close: () => void
}

const WordsViewModal = (props: IWordsViewProps) => {

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
        <Col span={6} className={styles.label}>词名称：</Col>
        <Col span={12}>{props.property.word}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>词性：</Col>
        <Col span={12}>{props.property.wordPos}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>插入日期：</Col>
        <Col span={12}>{props.property.freshTime}</Col>
      </Row>
    </Modal>
  )
}

export default WordsViewModal
