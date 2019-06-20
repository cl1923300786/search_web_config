import React from 'react'
import { Row, Col, Modal, Button } from 'antd'
import styles from './AddSourceConfig.module.less'

const DataSourceViewModal = (props: any) => {

  const handleClick = () => {
    props.close()
  }

  const renderContent=()=>{
    if(props.property.mappingIndex){
      return props.property.mappingIndex.map((item:any, index:number)=>{
        return (
          <Row key={index} gutter={6} className={styles.rowItem}>
            <Col span={6}>{item.source} </Col>
            <Col span={6}>{item.index} </Col>
            <Col span={6}>{item.type} </Col>
            <Col span={6}>{item.remark} </Col>
          </Row>
        )
      })
    }
    
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
        <Col span={6} className={styles.label}>模版名：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.fieldTemplate?props.property.fieldTemplate.templateName:""}} />
        </Col> 
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>创建时间：</Col>
        <Col span={12} className={styles.contentHighLight}>
          <div dangerouslySetInnerHTML={{__html: props.property.createTime}} />
        </Col> 
      </Row> 
      
      <Row className={styles.rowItem} style={{ marginTop: '10px' ,fontWeight: "bold"}}>        
        <Col span={6} className={styles.label}>数据库字段映射详情</Col>
      </Row> 
      <Row className={styles.rowItem}>
        <Col span={6} className={styles.label}>数据库字段名</Col>
        <Col span={6} className={styles.label}>模版字段名</Col>
        <Col span={6} className={styles.label}>模版类型</Col>
        <Col span={6} className={styles.label}>模版描述</Col>
      </Row> 
      
      {  renderContent()  }

    </Modal>
  )
}

export default DataSourceViewModal
