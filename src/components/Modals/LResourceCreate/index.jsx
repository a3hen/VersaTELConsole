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

import LNodeStore from 'stores/linstornode'
import StoragepoolStore from 'stores/storagepool'

@observer
export default class LResourceCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    LResourceTemplates: PropTypes.array,
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
    module: 'lresources',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.linstornodeStore = new LNodeStore()
    this.storagepoolStore = new StoragepoolStore()

    this.fetchNodes()
    this.fetchStoragepools()

    // this.state = {
    //   unselectedNodes: {},
    //   selectedNodes: [],
    // }
  }

  fetchNodes = params => {
    return this.linstornodeStore.fetchList({
      ...params,
    })
  }

  fetchStoragepools = params => {
    return this.storagepoolStore.fetchList({
      ...params,
    })
  }

  // get nodes() {
  //   const allNodes = this.linstornodeStore.list.data.map(node => {
  //     if(node.storagePoolNum > 1) {
  //       return ({
  //         label: node.name,
  //         value: node.name,
  //         visual: true,
  //       })
  //     }else{
  //       return ({
  //         label: node.name,
  //         value: node.name,
  //         visual: false,
  //       })
  //     }
  //   })
  //   const nodes = allNodes.filter(node => node.visual)
  //   return nodes
  // }

  get nodes() {
    const nodes = this.linstornodeStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return nodes
  }

  get storagepools() {
    const storagepools = this.storagepoolStore.list.data.map(storagepool => ({
      label: storagepool.name.concat(' - ', storagepool.node),
      value: [storagepool.name, storagepool.node],
    }))
    return storagepools
  }

  // handleStoragepoolChange = value => {
  //   const { selectedNodes } = this.state
  //   const selectedNodesList = value.map(value => value[1])
  //   this.setState({ selectedNodes: selectedNodesList })
  //   const newNodes = this.nodes.filter(node => selectedNodes.indexOf(node.value) === -1)
  //   this.setState({ unselectedNodes: newNodes })
  //   console.log(newNodes)
  // }

  handleCreate = LResourceTemplates => {
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(LResourceTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  LResourceNameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    // const { workspace, cluster, namespace } = this.props
    const name = get(this.props.formTemplate, 'name')

    if (this.props.edit && name === value) {
      return callback()
    }

    this.props.store.checkName({ name: value }).then(resp => {
      if (resp.exist) {
        return callback({
          message: t('Resource name exists'),
          field: rule.field,
        })
      }
      callback()
    })
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Create Resource'

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
        <Form.Item
          label={t('LINSTOR_STORAGEPOOLS')}
          desc={t('Select Storagepool to create diskful resource')}
          rules={[{ required: true, message: t('Please select Storagepool') }]}
        >
          <Select
            name="storagepool"
            options={this.storagepools}
            onFetch={this.fetchStoragepools}
            // onChange={this.handleStoragepoolChange}
            searchable
            clearable
            multi
          />
        </Form.Item>
        <Form.Item
          label={t('LINSTOR_NODES')}
          desc={t('Select LINSTOR Node to create diskless resource')}
          // rules={[{ required: true, message: t('Please select LINSTOR Node') }]}
        >
          <Select
            name="node"
            options={this.nodes}
            onFetch={this.fetchNodes}
            searchable
            clearable
            multi
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
