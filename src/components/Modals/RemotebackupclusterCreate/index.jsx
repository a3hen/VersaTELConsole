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

import { PATTERN_VTEL_NAME, PATTERN_RB_URL , PATTERN_IQN_NAME} from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import RemoteBackupStore from 'stores/remotebackup'
import { PATTERN_REMOTECLUSTER_NAME } from "../../../utils/constants";

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

    this.fetchResource()

    this.state = {
      isLoading: false, // isloading
    }
  }

  fetchResource = params => {
    return this.RemoteBackupStore.fetchList({
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

  // handleStoragepoolChange = value => {
  //   const { selectedNodes } = this.state
  //   const selectedNodesList = value.map(value => value[1])
  //   this.setState({ selectedNodes: selectedNodesList })
  //   const newNodes = this.nodes.filter(node => selectedNodes.indexOf(node.value) === -1)
  //   this.setState({ unselectedNodes: newNodes })
  // }

  handleCreate = RemoteBackupTemplates => {
    this.setState({ isLoading: true }) // isloading
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
    const name = get(this.props.formTemplate, 'remoteName')

    if (this.props.edit && name === value) {
      return callback()
    }

    const isNameExistInTargetData = this.props.data.some(item => item.remoteName === value)
    if (isNameExistInTargetData) {
      return callback({
        message: t('remotename exists'),
        field: rule.field,
      })
    }
    callback()
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    console.log("create.props",this.props)

    const title = 'Create Remote Backup Cluster'

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="cluster"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
        isSubmitting={this.state.isLoading} // isloading
      >
        <Form.Item
          label={t('remotecluster name')}
          desc={t(
            '仅支持字母、数字、中横线，且中横线不能在字段的首尾，长度必须大于等于2'
          )}
          rules={[
            { required: true, message: t('Please input cluster name') },
            {
              pattern: PATTERN_REMOTECLUSTER_NAME,
              message: t('名称格式错误', { message: t('仅支持字母、数字、中横线，且中横线不能在字段的首尾，长度必须大于等于2') }),
            },
            { validator: this.NameValidator },
          ]}
        >
          <Input name="remoteName" maxLength={63} placeholder="远程集群名" />
        </Form.Item>
        <Form.Item
          label={t('remotecluster id')}
          desc={t('RB_CLUSTER_ID')}
          rules={[
            { required: true, message: t('请输入集群id') },
            // { validator: this.IdValidator },
          ]}
        >
          <Input name="clusterId" maxLength={63} placeholder="远程集群id" />
        </Form.Item>
        <Form.Item
          label={t('remotecluster URL')}
          desc={t('VTEL_URL_DESC')}
          rules={[
            { required: true, message: t('请输入集群URL') },
            {
              pattern: PATTERN_RB_URL,
              message: t('URL格式错误', { message: t('VTEL_URL_DESC') }),
            },
          ]}
        >
          <Input name="url" maxLength={63} placeholder="远程集群URL" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
