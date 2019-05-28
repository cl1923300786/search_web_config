import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './EsSearchConfigModal.module.less'

const EsSearchViewModal = (props: any) => {

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
        <Col span={6} className={styles.label}>标准号：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.std_no}} />
        </Col> 
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>中文标题：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.zh_title}} />
        </Col> 
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>英文标题：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.eng_title}} />
        </Col>    
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>使用状态：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.status}} />
        </Col> 
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>截止日期：</Col>
        <Col span={12}>{props.property.expire_date}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>CCS分类列表：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.ccs_type}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>ics分类列表：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.ics_type}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>归口单位：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.belongs_org}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>实施单位：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.issue_org}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>起草人：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.issuer}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>实施日期：</Col>
        <Col span={12}>{props.property.issus_date}</Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>备案号：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.record}} />
        </Col>
      </Row>

      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>出处：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.source}} />
        </Col>
      </Row>
     
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>发布单位：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.publish_org}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>标准组织：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.std_org}} />
        </Col>
      </Row>  
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>替代标准号：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.substract_std}} />
        </Col>
      </Row> 
       <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>被替代标准号：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.substracted_std}} />
        </Col>
      </Row> 
       <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>采用的标准：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.usage_std}} />
        </Col>
      </Row> 
       <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>被采用的标准：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.used_std}} />
        </Col>
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>语言类型：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.language_type}} />
        </Col>
      </Row>
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>发布日期：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.publish_date}} />
        </Col>
      </Row>
     
       <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>摘要：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.std_abs}} />
        </Col>
        
      </Row>
      
      
    </Modal>
  )
}

export default EsSearchViewModal
