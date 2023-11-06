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
import ResourceStore from 'stores/lresource'

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
    this.ResourceStore = new ResourceStore()

    this.fetchResource()

    this.state = {
      list_data: [],
      r_diskful: 0,
      r_diskless: 0,
    }
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.props.targetname }),
    }

    fetch('/kapis/versatel.kubesphere.io/v1alpha1/getnode', requestOptions)
      .then(response => response.json())
      .then(data => {
        let r_diskless = 0
        let r_diskful = 0
        const nodeLess = data.data[0].NodeLess
        const nodeRun = data.data[0].nodeRun

        if (Array.isArray(nodeLess)) {
          r_diskless = nodeLess.length
        } else if (typeof nodeLess === 'string' && nodeLess !== '') {
          r_diskless = 1
        }

        if (Array.isArray(nodeRun)) {
          r_diskful = nodeRun.length
        } else if (typeof nodeRun === 'string' && nodeRun !== '') {
          r_diskful = 1
        }

        this.setState({ data, r_diskless, r_diskful })
      })
  }

  fetchResource = params => {
    return this.iSCSIMapping1Store.fetchList({
      ...params,
    })
  }

  fetchResource = params => {
    return this.ResourceStore.fetchList({
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

  // get lresource() {
  //   const nodes = this.ResourceStore.list.data.map(node => ({
  //     label: node.name,
  //     value: node.name,
  //   }))
  //   return nodes
  // }
  get lresource() {
    const nodes = this.ResourceStore.list.data
      .filter(node => {
        const assignedNodeIsEmpty = node.assignedNode === ''
        const assignedNodeIsNotEmpty = node.assignedNode !== ''
        const mirrorWayMatches = parseInt(node.mirrorWay, 10) === this.state.r_diskful

        return ((assignedNodeIsEmpty && this.state.r_diskless === 0) ||
            (assignedNodeIsNotEmpty && this.state.r_diskless === 1)) &&
          mirrorWayMatches
      })
      .map(node => ({
        label: node.name,
        value: node.name,
      }))
    console.log("nodes",nodes)

    return nodes
  }

  handleCreate = iSCSIMapping1Templates => {
    iSCSIMapping1Templates.name = this.props.targetname
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

    console.log('bind_this.props', this.props)
    console.log(
      'this.ResourceStore.list.data',
      this.ResourceStore.list.data
    )
    console.log("this.ResourceStore.list.data",this.ResourceStore.list.data)
    console.log("this.state",this.state)

    if (!this.state.data) {
      return null
    }

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
            options={this.lresource}
            onFetch={this.fetchResource}
            searchable
            clearable
            multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
