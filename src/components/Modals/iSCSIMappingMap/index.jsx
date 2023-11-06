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

import { get, set } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input, Form, Select, Radio } from '@kube-design/components'

import { Modal } from 'components/Base'

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE } from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import iSCSIMapping2Store from 'stores/iSCSImapping2'
import iSCSIMappingStore from 'stores/iSCSImapping'

@observer
export default class iSCSIMapping2MapModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    iSCSIMapping2Templates: PropTypes.array,
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
    module: 'iSCSImapping2',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.iSCSIMapping2Store = new iSCSIMapping2Store()
    this.iSCSIMappingStore = new iSCSIMappingStore()
    this.fetchResource()
    this.fetchDiskfulResource()
    this.fetchDisklessResource()
  }

  fetchResource = params => {
    return this.iSCSIMapping2Store.fetchList({
      ...params,
    })
  }

  fetchHostName = params => {
    return this.iSCSIMappingStore.fetchList({
      ...params,
    })
  }

  get resources() {
    const resources = this.iSCSIMapping2Store.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  get hostname() {
    const nodes = this.iSCSIMappingStore.list.data.map(node => ({
      label: node.hostname,
      value: node.hostname,
    }))
    return nodes
  }

  handleCreate = iSCSIMapping2Templates => {
    const dataToSubmit = { ...this.props, ...iSCSIMapping2Templates }
    this.props.onOk(dataToSubmit)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Mapping'

    const data = [
      {
        label: '开启',
        value: '1',
      },
      {
        label: '关闭',
        value: '0',
      },
    ]

    console.log('this.props', this.props)

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="database"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
      >
        <Form.Item
          label={t('UNMAP_SUPPORT')}
          desc={t('Select to turn on/off unmap support')}
          rules={[{ required: true }]}
        >
          <Select
            name="unMap"
            options={data}
            searchable
            clearable
            defaultValue=""
          />
        </Form.Item>
        <Form.Item
          label={t('REGISTERED_HOST')}
          desc={t('Select registered host')}
          rules={[{ required: true }]}
        >
          <Select
            name="hostname"
            options={this.hostname}
            onFetch={this.fetchHostName}
            searchable
            clearable
            multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
