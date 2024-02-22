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

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE , PATTERN_IQN_NAME} from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import RemoteBackupStore from 'stores/remotebackup'
import SnapShotStore from 'stores/snapshot'

@observer
export default class RemoteBackupClusterCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    RemoteBackupTemplates: PropTypes.array,
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
    module: 'remotebackup',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.RemoteBackupStore = new RemoteBackupStore()
    this.SnapShotStore = new SnapShotStore()

    this.fetchResource()
    this.fetchTResource()

    this.state = {
      isLoading: false, // isloading
    }
  }

  fetchResource = params => {
    return this.RemoteBackupStore.fetchList({
      ...params,
    })
  }

  fetchTResource = params => {
    return this.SnapShotStore.fetchList({
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

  get resources() {
    const resources = this.RemoteBackupStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  get tresources() {
    const resources = this.SnapShotStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  // handleStoragepoolChange = value => {
  //   const { selectedNodes } = this.state
  //   const selectedNodesList = value.map(value => value[1])
  //   this.setState({ selectedNodes: selectedNodesList })
  //   const newNodes = this.nodes.filter(node => selectedNodes.indexOf(node.value) === -1)
  //   this.setState({ unselectedNodes: newNodes })
  // }

  handleCreate = RemoteBackupTemplates => {
    this.setState({ isLoading: true }) // isloading
    RemoteBackupTemplates.remoteName = this.props.remotename
    set(
      this.props.formTemplate,
      JSON.stringify(RemoteBackupTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  NameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    // const { workspace, cluster, namespace } = this.props
    const name = get(this.props.formTemplate, 'hostname')

    if (this.props.edit && name === value) {
      return callback()
    }

    const isNameExistInTargetData = this.props.host_data.some(item => item.hostName === value)
    if (isNameExistInTargetData) {
      return callback({
        message: t('Hostname exists'),
        field: rule.field,
      })
    }
    callback()
  }

  iqnValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    // const { workspace, cluster, namespace } = this.props
    const name = get(this.props.formTemplate, 'iqn')

    if (this.props.edit && name === value) {
      return callback()
    }

    const isNameExistInTargetData = this.props.host_data.some(item => item.iqn === value)
    if (isNameExistInTargetData) {
      return callback({
        message: t('iqn exists'),
        field: rule.field,
      })
    }
    callback()
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    console.log("manual.props",this.props)

    const title = 'Manual Remote Backup'

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="backup"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
        isSubmitting={this.state.isLoading} // isloading
      >
        <Form.Item
          label={t('backup_resource')}
          desc={t('RB_MAN')}
          rules={[{ required: true }]}
        >
          <Select
            name="resNames"
            options={this.tresources}
            searchable
            multi
            clearable
            // defaultValue="test"
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
