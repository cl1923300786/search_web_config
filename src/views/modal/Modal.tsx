import React, { useState } from 'react'
import { Button } from 'antd'
import EditModal from './editModal/EditModal'

const Modal = () => {
  const [visible, setVisible] = useState(false)

  const addModal = () => {
    setVisible(true)
  }

  /**
   * 编辑模板模态窗点击取消
   */
  const handleCancel = () => {
    setVisible(false)
  }

  /**
   * 新增/编辑模板模态窗，点击确定
   */
  const handleSubmit = (params: any) => {
    handleCancel()
  }

  return (
    <div>
      <Button onClick={() => addModal()}>新增模板</Button>
      <EditModal
        visible={visible}
        cancel={handleCancel}
        submit={handleSubmit}
      />
    </div>
  )
}

export default Modal
