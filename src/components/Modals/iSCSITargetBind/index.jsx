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
import { Input, Form, Select } from '@kube-design/components'

import { Modal } from 'components/Base'

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE } from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import iSCSIMapping1Store from 'stores/iSCSImapping1'
import DiskfulResourceStore from 'stores/diskfulresource'
import DisklessResourceStore from 'stores/disklessresource'

@observer
export default class iSCSIMapping1DeleteModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    iSCSIMapping1Templates: PropTypes.array,
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
    module: 'iSCSImapping1',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.iSCSIMapping1Store = new iSCSIMapping1Store()
    this.DisklessresourceStore = new DisklessResourceStore()
    this.DiskfulresourceStore = new DiskfulResourceStore()

    this.fetchResource()
    this.fetchDiskfulResource()
    this.fetchDisklessResource()
  }

  fetchResource = params => {
    return this.iSCSIMapping1Store.fetchList({
      ...params,
    })
  }

  fetchAllResources = params => {
    return Promise.all([
      this.fetchDiskfulResource(params),
      this.fetchDisklessResource(params),
    ])
  }

  fetchDisklessResource = params => {
    return this.DisklessresourceStore.fetchList({
      ...params,
    })
  }

  fetchDiskfulResource = params => {
    return this.DiskfulresourceStore.fetchList({
      ...params,
    })
  }

  get resources() {
    const resources = this.iSCSIMapping1Store.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  get diskless() {
    const nodes = this.DisklessresourceStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return nodes
  }

  get diskful() {
    const nodes = this.DiskfulresourceStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return nodes
  }

  handleCreate = iSCSIMapping1Templates => {
    iSCSIMapping1Templates.name = this.props.name
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(iSCSIMapping1Templates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Bind Storage'

    console.log('this.props', this.props)
    console.log(
      'this.DisklessresourceStore.list.data',
      this.DisklessresourceStore.list.data
    )
    console.log(
      'this.DiskfulresourceStore.list.data',
      this.DiskfulresourceStore.list.data
    )

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
          label={t('RESOURCE')}
          desc={t('Select resource to bind storage')}
        >
          <Select
            name="resName"
            options={this.diskful}
            onFetch={this.fetchAllResources}
            searchable
            clearable
            multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
