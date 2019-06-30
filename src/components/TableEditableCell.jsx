import React, { Component } from 'react'
import { Input, InputNumber, Form, Switch } from 'antd'

export const EditableContext = React.createContext()

class TableEditableCell extends Component {
  getInput = () => {
    switch (this.props.inputType) {
      case 'number':
        return <InputNumber />
      case 'switch':
        return <Switch
          checkedChildren={this.props.checkedChildren}
          unCheckedChildren={this.props.unCheckedChildren}
          defaultChecked={this.props.record[this.props.dataIndex]}
        />
      default:
        return <Input />
    }
  }

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      checkedChildren,
      unCheckedChildren,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props

    if (editing) {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        </td>
      )
    } else if (dataIndex === 'status') {
      return (
        <td {...restProps}>
          <Switch
            checkedChildren={checkedChildren}
            unCheckedChildren={unCheckedChildren}
            defaultChecked={record[dataIndex]}
            disabled={true}
          />
        </td>
      )
    } else {
      return (
        <td {...restProps}>
          {children}
        </td>
      )
    }
  }

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

export default TableEditableCell