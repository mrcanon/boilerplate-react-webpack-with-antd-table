import React, { Component, Fragment } from 'react'
import { Table, Form, Popconfirm } from 'antd'
import moment from 'moment'
import classnames from 'classnames'

import TableEditableCell, { EditableContext } from './TableEditableCell'

const data = []
for (let i = 0; i < 10; i++) {
  data.push({
    key: i.toString(),
    name: `Compenstaion ${i}`,
    abbreviation: `BS_${i}`,
    appliedMonth: '3, 5, 7',
    status: true,
    modifiedDate: 1561775410524
  })
}


class TableEditable extends Component {
  constructor(props) {
    super(props)
    this.state = { data, editingKey: '' }
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        editable: true,
        inputType: 'text',
        sorter: (a, b) => {
          return a.name.localeCompare(b.name)
        }
      },
      {
        title: 'Abbreviation',
        dataIndex: 'abbreviation',
        width: '10%',
        editable: true,
        inputType: 'text'
      },
      {
        title: 'Applied Month',
        dataIndex: 'appliedMonth',
        width: '15%',
        editable: true,
        inputType: 'text'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: '15%',
        editable: true,
        inputType: 'switch'
      },
      {
        title: 'Modified Date',
        dataIndex: 'modifiedDate',
        width: '15%',
        render: datetime => {
          return moment(datetime).format('MMM DD, YYYY')
        }
      },
      {
        title: this.onRenderAddRow,
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state
          const editable = this.isEditing(record)
          return editable ?
            (
              <Fragment>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:"
                      onClick={() => this.onSave(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                  </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.onCancel(record.key)}>
                  <a>Cancel</a>
                </Popconfirm>
              </Fragment>
            ) :
            (
              <Fragment>
                <a disabled={editingKey !== ''} onClick={() => this.onEdit(record.key)}>Edit</a>
                <a disabled={editingKey !== ''} onClick={() => this.onDelte(record.key)} style={{ marginLeft: 20, color: '#f00' }}>Delete</a>
              </Fragment>
            )
        },
      },
    ]
  }

  onRenderAddRow = () => {
    return <a href="javascript;" className={classnames({ 'ant-switch-disabled': this.state.editingKey !== '' })} onClick={this.onAddCompensation}>Add row</a>
  }

  isEditing = record => record.key === this.state.editingKey

  onAddCompensation = event => {
    event.preventDefault()
    if (this.state.editingKey === '') {
      const { data } = this.state;
      const count = data.length
      const newData = {
        key: count.toString(),
        name: null,
        abbreviation: `BS_${count}`,
        appliedMonth: '3, 5, 7',
        status: true,
        modifiedDate: 1561775410524
      }
  
      this.setState({
        editingKey: count.toString(),
        data: [newData, ...data]
      })
    }
  }

  onCancel = () => {
    this.setState({ editingKey: '' })
  }

  onSave(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const newData = [...this.state.data]
      const index = newData.findIndex(item => key === item.key)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
      } else {
        newData.push(row)
      }

      this.setState({ data: newData, editingKey: '' })
    })
  }

  onEdit(key) {
    this.setState({ editingKey: key })
  }

  onDelte(key) {
    console.log(key)
  }

  onChangeTable = (pagination, filters, sorter) => {
    console.log(this.state.editingKey)
    if (this.state.editingKey !== '') {
      const newData = [...this.state.data]
      const index = newData.findIndex(item => this.state.editingKey === item.key)

      if (index > -1) {
        newData.splice(index, 1)
      }

      this.setState({
        data: newData
      })
    }
  }

  render() {
    const components = {
      body: {
        cell: TableEditableCell
      }
    }

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: record => {
          return {
            record,
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            title: col.title,
            checkedChildren: "Active",
            unCheckedChildren: "Inactive",
            editing: this.isEditing(record),
          }
        }
      }
    })

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          onChange={this.onChangeTable}
          pagination={{
            onChange: this.onCancel
          }}
        />
      </EditableContext.Provider>
    )
  }
}

export default Form.create()(TableEditable)
