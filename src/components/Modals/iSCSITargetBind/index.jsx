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
    this.DisklessStore = new DisklessStore()
    this.DiskfulStore = new DiskfulStore()
    // this.ResourceStore = new ResourceStore()

    this.fetchResource()
    this.fetchdiskful()
    this.fetchdiskless()
    // this.fetchlResource()

    this.state = {
      list_data: [],
      r_diskful: 0,
      r_diskless: 0,
      isLoading: false, // isloading
      r_isLoading: false,
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

        this.setState({
          data,
          r_diskless,
          r_diskful,
          // 如果r_diskful不为0，则认为加载已完成
          isLoading: r_diskful.length === 0 && r_diskless.length === 0,
        })
      })
  }

  fetchResource = params => {
    return this.iSCSIMapping1Store.fetchList({
      ...params,
      limit: 999,
    })
  }
  fetchdiskless = params => {
    return this.DisklessStore.fetchList({
      ...params,
      limit: 999,
    })
  }
  fetchdiskful = params => {
    return this.DiskfulStore.fetchList({
      ...params,
      limit: 999,
    })
  }

  // fetchlResource = params => {
  //   return this.ResourceStore.fetchList({
  //     ...params,
  //     limit: 999,
  //   })
  // }

  get resources() {
    const resources = this.iSCSIMapping1Store.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  get lresource() {
    const diskful = this.DiskfulStore.list.data || []
    const diskless = this.DisklessStore.list.data || []

    const sameNameItemsDiskful = diskful.filter(item1 =>
      diskful.some(item2 => item1.name === item2.name && item1 !== item2)
    )

    let resultDiskful = diskful.reduce((acc, item) => {
      let foundItem = acc.find(i => i.name === item.name)
      if (foundItem) {
        foundItem.diskfulnode.push(item.node)
      } else {
        acc.push({
          name: item.name,
          diskfulnode: [item.node]
        })
      }
      return acc
    }, [])

    resultDiskful = resultDiskful.reduce((unique, o) => {
      if (
        !unique.some(
          obj =>
            obj.name === o.name &&
            obj.diskfulnode.toString() === o.diskfulnode.toString()
        )
      ) {
        unique.push(o)
      }
      return unique
    }, [])

    const sameNameItemsDiskless = diskless.filter(item1 =>
      diskless.some(item2 => item1.name === item2.name && item1 !== item2)
    )

    let resultDiskless = diskless.length > 1 ? diskless.reduce((acc, item) => {
      let foundItem = acc.find(i => i.name === item.name)
      if (foundItem) {
        foundItem.disklessnode.push(item.node)
      } else {
        acc.push({
          name: item.name,
          disklessnode: [item.node]
        })
      }
      return acc
    }, []) : diskless.map(item => ({
      name: item.name,
      disklessnode: [item.node]
    }))

    resultDiskless = resultDiskless.reduce((unique, o) => {
      if(!unique.some(obj => obj.name === o.name && obj.disklessnode.toString() === o.disklessnode.toString())) {
        unique.push(o)
      }
      return unique
    },[])


    const result = resultDiskful.map(item => {
      const disklessItem = resultDiskless.find(i => i.name === item.name)
      return {
        ...item,
        disklessnode: disklessItem ? disklessItem.disklessnode : [],
      }
    })


    const newArray = result
      .filter(item =>
        this.state.r_diskful.length === item.diskfulnode.length &&
        this.state.r_diskful.every(val => item.diskfulnode.includes(val)) &&
        this.state.r_diskless.length === item.disklessnode.length &&
        this.state.r_diskless.every(val => item.disklessnode.includes(val))
      )
      .filter(item => !item.name.includes('linstordb') && !item.name.includes('pvc-'))
      .map(item => ({
        label: item.name,
        value: item.name,
      }))


    return (this.props.data && this.props.data.length > 0)
      ? newArray.filter(item => !this.props.data.some(dataItem => dataItem.storageList && dataItem.storageList.includes(item.value)))
      : newArray
  }

  handleCreate = iSCSIMapping1Templates => {
    iSCSIMapping1Templates.name = this.props.targetname
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(iSCSIMapping1Templates)
    )
    this.setState({ isLoading: true }) // isloading
    this.props.onOk(this.props.formTemplate)
  }

  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  render() {
    const { visible, onCancel, formTemplate } = this.props
    const isLoading = this.state.r_isLoading

    const title = 'Bind Storage'

    if (isLoading) {
      return <div>Loading...</div>
    }

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
