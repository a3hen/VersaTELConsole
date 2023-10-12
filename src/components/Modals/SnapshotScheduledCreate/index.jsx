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
import SnapshotStore from 'stores/snapshot'

@observer
export default class SnapshotCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    SnapshotTemplates: PropTypes.array,
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
    module: 'snapshot',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.LSnapshotStore = new SnapshotStore()

    this.fetchResource()

    // this.state = {
    //   unselectedNodes: {},
    //   selectedNodes: [],
    // }
  }

  fetchResource = params => {
    return this.LSnapshotStore.fetchList({
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
    const resources = this.LSnapshotStore.list.data.map(node => ({
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

  handleCreate = SnapshotTemplates => {
    const resourcename = this.props.resourcename
    SnapshotTemplates.resource = resourcename
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(SnapshotTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Create Snapshot'

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
          label={t('SnapshotName')}
          desc={t('VTEL_NAME_DESC')}
          rules={[
            { required: true, message: t('Please input Snapshot name') },
            {
              pattern: PATTERN_VTEL_NAME,
              message: t('Invalid name', { message: t('VTEL_NAME_DESC') }),
            },
          ]}
        >
          <Input name="name" maxLength={63} placeholder="name" />
        </Form.Item>

        <Form.Item
          label={t('Time')}
          rules={[
            { required: true, message: t('Please select a time') },
            {
              pattern: /^(2[0-4]|1[0-9]|[1-9])$/,
              message: t(
                'Invalid input. Please input a number between 1 and 24'
              ),
            },
          ]}
        >
          <Input name="time" placeholder="Input a time" />
        </Form.Item>

        <Form.Item
          label={t('Count')}
          rules={[
            { required: true, message: t('Please select a count') },
            {
              pattern: /^([1-9]|10)$/,
              message: t(
                'Invalid input. Please input a number between 1 and 10'
              ),
            },
          ]}
        >
          <Input name="count" placeholder="Input a count" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
