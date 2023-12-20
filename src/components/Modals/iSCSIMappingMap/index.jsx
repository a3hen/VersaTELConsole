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
import { Input, Form, Select, Radio, Checkbox } from '@kube-design/components'

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
    this.fetchHostName()

    this.state = {
      selectedHostnames: [],
      isLoading: false, // isloading
    }
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
    const nodes = this.iSCSIMappingStore.list.data
      .filter(node => !this.props.hostname.includes(node.hostName)) // Filter out existing hostnames
      .map(node => ({
        label: node.hostName,
        value: node.hostName,
      }))
    return nodes
  }

  handleCreate = iSCSIMapping2Templates => {
    this.setState({ isLoading: true }) // isloading
    this.props.formTemplate.resname = this.props.resname
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(iSCSIMapping2Templates)
    )
    if (Array.isArray(this.props.formTemplate.hostname)) {
      this.props.formTemplate.hostname = this.props.formTemplate.hostname.filter(item => item !== 'all')
    }
    this.props.onOk(this.props.formTemplate)
  }

  handleSelectChange = selectedValues => {
    if (selectedValues.includes('all')) {
      this.fetchHostName().then(() => {
        const nodes = this.iSCSIMappingStore.list.data.map(node => node.hostName)
        nodes.unshift('all')
        this.setState({ selectedHostnames: nodes })
      })
    } else if (this.state.selectedHostnames.includes('all')) {
      this.setState({ selectedHostnames: [] })
    }
  }
  // handleSelectChange = selectedValues => {
  //   if (selectedValues.includes('all')) {
  //     this.fetchHostName().then(() => {
  //       const nodes = this.iSCSIMappingStore.list.data.map(node => node.hostName)
  //       nodes.unshift('all')
  //       this.setState({ selectedHostnames: nodes })
  //     })
  //   } else {
  //     const selectedHostnames = this.state.selectedHostnames.filter(hostname => selectedValues.includes(hostname))
  //     this.setState({ selectedHostnames })
  //
  //     if (selectedHostnames.length !== this.iSCSIMappingStore.list.data.length) {
  //       const index = selectedHostnames.indexOf('all')
  //       if (index > -1) {
  //         selectedHostnames.splice(index, 1)
  //       }
  //       this.setState({ selectedHostnames })
  //     }
  //   }
  // }
  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Mapping'

    const data = [
      {
        label: '开启',
        value: '开启',
      },
      {
        label: '关闭',
        value: '关闭',
      },
    ]

    const hostnameOptions = [
      {
        label: '全选',
        value: 'all',
      },
      ...this.hostname,
    ]

    console.log("this.props",this.props)

    set(this.props.formTemplate, 'hostname', this.state.selectedHostnames)

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
        isSubmitting={this.state.isLoading} // isloading
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
            defaultValue="关闭"
          />
        </Form.Item>
        <Form.Item>
          <div>
            UNMAP 命令用于释放不再需要的数据块。通过启用 UNMAP 支持，可以释放不再使用的存储空间。
            <span style={{ color: 'red' }}>
              要启用此功能，请确保 LUN 的底层硬件设备支持 Disacard，或者 LUN
              基于精简置备存储池。 未达到上述条件，请<strong>不要</strong>
              启用此支持功能，否则会导致该 LUN 映射失败以及整个 iSCSI
              目标不可用。
            </span>
          </div>
        </Form.Item>

        <Form.Item
          label={t('REGISTERED_HOST')}
          desc={t('Select registered host')}
          rules={[{ required: true }]}

        >
          <Select
            name="hostname"
            // options={this.hostname}
            onFetch={this.fetchHostName}
            options={hostnameOptions}
            onChange={this.handleSelectChange}
            searchable
            clearable
            multi
          />
        </Form.Item>
        {/*<Checkbox*/}
        {/*  name="test"*/}
        {/*  onChange={(isChecked) => {*/}
        {/*    if (isChecked) {*/}
        {/*      this.fetchHostName().then(() => {*/}
        {/*        const nodes = this.iSCSIMappingStore.list.data.map(node => node.hostName)*/}
        {/*        this.setState({ selectedHostnames: nodes })*/}
        {/*      })*/}
        {/*    } else {*/}
        {/*      this.setState({ selectedHostnames: [] })*/}
        {/*    }*/}
        {/*  }}*/}
        {/*>*/}
        {/*  全选*/}
        {/*</Checkbox>*/}
      </Modal.Form>
    )
  }
}
