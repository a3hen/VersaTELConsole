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
import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE } from 'utils/constants'
import { Modal } from 'components/Base'

import RawDeviceStore from 'stores/rawdevice'
import VGResourceStore from 'stores/vgresource'

@observer
export default class TPCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    TPResourceTemplates: PropTypes.array,
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
    module: 'tpresources',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.deviceStore = new RawDeviceStore()
    this.vgsStore = new VGResourceStore()

    this.fetchDevices()
    this.fetchVgs()
  }

  state = {
    isDeviceSelected: false,
    isVGsSelected: false,
  }

  handleDeviceChange = (value) => {
    this.setState({
      isDeviceSelected: false,
      isVGsSelected: value.length > 0,
    })
  }


  handleVGsChange = (value) => {
    this.setState({
      isVGsSelected: value === undefined ? false : !value,
      isDeviceSelected: value === undefined ? false : !!value,
    })
  }

  fetchDevices = params => {
    return this.deviceStore.fetchList({
      node: this.props.node,
      ...params,
    })
  }

  fetchVgs = params => {
    return this.vgsStore.fetchList({
      node: this.props.node,
      ...params,
    })
  }

  get devices() {
    const new_list = this.deviceStore.list.data.filter(node => node.node === this.props.node);
    const devices = new_list.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return devices
  }

  get vgs() {
    const new_list = this.vgsStore.list.data.filter(node => node.node === this.props.node && node.lv === "false");
    const vgs = new_list.map(node => ({
      label: node.vg,
      value: node.vg,
    }))
    return vgs
  }

  handleCreate = TPResourceTemplates => {
    if (this.state.isDeviceSelected || this.state.isVGsSelected) {
      set(
        this.props.formTemplate,
        JSON.stringify(TPResourceTemplates)
      )
      this.props.onOk(this.props.formTemplate)
    } else {
      alert("请选择使用裸设备或Vg来创建ThinPool")
    }
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
        title={t('Create TP')}
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
          // rules={this.state.deviceRules}
        >
          <Select
            name="device"
            options={this.devices}
            onFetch={this.fetchDevices}
            searchable
            clearable
            multi
            disabled={this.state.isDeviceSelected}
            onChange={this.handleDeviceChange}
          />
        </Form.Item>
        <Form.Item
          label={t('VG')}
          desc={t('Select VG')}
          // rules={this.state.vgsRules}
        >
          <Select
            name="vg"
            options={this.vgs}
            onFetch={this.fetchVgs}
            searchable
            clearable
            disabled={this.state.isVGsSelected}
            onChange={this.handleVGsChange}
          />
        </Form.Item>
        <Form.Item
          label={t('Name')}
          desc={t('VTEL_NAME_DESC')}
          rules={[
            { required: true, message: t('Please input Resource name') },
            {
              pattern: PATTERN_VTEL_NAME,
              message: t('Invalid name', { message: t('VTEL_NAME_DESC') }),
            },
            { validator: this.LResourceNameValidator },
          ]}
        >
          <Input name="name" maxLength={63} placeholder="name" />
        </Form.Item>
        <Form.Item
          label={t('Size')}
          desc={t('VTEL_SIZE_DESC')}
          rules={[
            { required: true, message: t('Please input Resource size') },
            {
              pattern: PATTERN_VTEL_SIZE,
              message: t('Invalid size', { message: t('VTEL_SIZE_DESC') }),
            },
          ]}
        >
          <Input name="size" maxLength={63} placeholder="size" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
