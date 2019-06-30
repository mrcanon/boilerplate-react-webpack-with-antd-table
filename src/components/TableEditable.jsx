import React, { Component } from 'react'
import { Table, Form } from 'antd'

import { EditableContext } from './TableEditableCell'

class TableEditable extends Component {
  render() {
    const {
      components,
      form,
      dataSource,
      columns,
      onCancel,
      onChangeTable
    } = this.props

    return (
      <EditableContext.Provider value={form}>
        <Table
          components={components}
          dataSource={dataSource}
          columns={columns}
          rowClassName="editable-row"
          onChange={onChangeTable}
          pagination={{
            onChange: onCancel
          }}
        />
      </EditableContext.Provider>
    )
  }
}

export default Form.create()(TableEditable)
