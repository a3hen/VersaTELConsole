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
// import ResourceStore from 'stores/lresource'
import DisklessStore from 'stores/disklessresource'
import DiskfulStore from 'stores/diskfulresource'

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

    this.fetchResource()

    this.state = {
      list_data: [],
      r_diskful: 0,
      r_diskless: 0,
      isLoading: false, // isloading
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
        let r_diskless = []
        let r_diskful = []
        const nodeLess = data[0].NodeLess
        const nodeRun = data[0].nodeRun

        if (Array.isArray(nodeLess)) {
          r_diskless = nodeLess
        } else if (typeof nodeLess === 'string' && nodeLess !== '') {
          r_diskless = [nodeLess]
        }

        if (Array.isArray(nodeRun)) {
          r_diskful = nodeRun.filter(n => !r_diskless.includes(n))
        } else if (typeof nodeRun === 'string' && nodeRun !== '') {
          r_diskful = [nodeRun]
        }

        this.setState({ data, r_diskless, r_diskful })
      })
  }

  fetchResource = params => {
    return this.iSCSIMapping1Store.fetchList({
      ...params,
      limit: 999,
    })
  }

  get resources() {
    const targetNode = this.iSCSIMapping1Store.list.data.filter(node => node.name === this.props.targetname)[0];
    if (!targetNode) return []

    const resources = targetNode.storageList.map(storage => ({
      label: storage,
      value: storage,
    }))

    return resources
  }

  handleCreate = iSCSIMapping1Templates => {
    this.setState({ isLoading: true }) // isloading
    iSCSIMapping1Templates.name = this.props.targetname
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(iSCSIMapping1Templates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'UnBind Storage'

    console.log("this.iSCSIMapping1Store.list.data",this.iSCSIMapping1Store.list.data)
    console.log("this.props",this.props)

    if (!this.state.data) {
      return null
    }

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="resource"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
        isSubmitting={this.state.isLoading} // isloading
      >
        <Form.Item
          label={t('RESOURCE')}
          desc={t('Select resource to unbind storage')}
        >
          <Select
            name="resName"
            options={this.resources}
            onFetch={this.fetchResource}
            searchable
            clearable
            // multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
