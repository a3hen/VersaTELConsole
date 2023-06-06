/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import { set } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input, Form, Select } from '@kube-design/components'

import { Modal } from 'components/Base'

import RawDeviceStore from 'stores/rawdevice'

@observer
export default class PVCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    PVResourceTemplates: PropTypes.array,
    formTemplate: PropTypes.object,
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    module: 'pvresources',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.deviceStore = new RawDeviceStore()

    this.fetchDevices()
  }

  fetchDevices = params => {
    return this.deviceStore.fetchList({
      node: this.props.node,
      ...params,
    })
  }

  get devices() {
    const devices = this.deviceStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return devices
  }

  handleCreate = PVResourceTemplates => {
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(PVResourceTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  render() {
    const {
      // title,
      // detail,
      visible,
      // module,
      onCancel,
      formTemplate,
      // PVResourceTemplates,
      // isSubmitting,
      node,
    } = this.props

    return (
      <Modal.Form
        width={600}
        title={t('Create PV')}
        icon="database"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
      >
        <Form.Item label={t('Node')}>
          <Input name="node" defaultValue={node} disabled />
        </Form.Item>
        <Form.Item
          label={t('Raw Device')}
          desc={t('Select Device')}
          rules={[{ required: true, message: t('Please select Device') }]}
        >
          <Select
            name="name"
            options={this.devices}
            onFetch={this.fetchDevices}
            searchable
            clearable
            multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
