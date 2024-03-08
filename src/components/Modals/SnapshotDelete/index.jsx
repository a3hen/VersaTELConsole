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
import { Input, Form, Select, Icon } from "@kube-design/components";

import { Modal } from 'components/Base'

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE } from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import SSnapshotStore from 'stores/ssnapshot'

@observer
export default class SnapshotRollbackModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    SSnapshotTemplates: PropTypes.array,
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
    module: 'ssnapshot',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.SSnapshotStore = new SSnapshotStore()

    this.fetchResource()

    this.state = {
      confirm: '',
    }
  }

  fetchResource = params => {
    return this.SSnapshotStore.fetchList({
      ...params,
      limit: 999,
    })
  }

  get resources() {
    const resources = this.SSnapshotStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  handleCreate = SSnapshotTemplates => {
    // const oldres = this.props.oldres
    // const snapshotname = this.props.snapshotname
    SSnapshotTemplates.name = this.props.snapshotname
    SSnapshotTemplates.resource = this.props.resource
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(SSnapshotTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  handleInputChange = e => {
    this.setState({ confirm: e.target.value })
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Snapshot Delete'

    const closeIconStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '8px',
      width: '16px',
      height: '16px',
      padding: '0',
      borderRadius: '50%',
      boxShadow: '0 4px 8px 0 rgba(202, 38, 33, 0.2)',
      backgroundColor: '#ca2621',
    }

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon={<Icon name="close" type="light" style={closeIconStyle} />}
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        okButtonType="danger"
        visible={visible}
        disableOk={this.state.confirm !== this.props.snapshotname}
      >
        <p style={{ marginBottom: '10px', opacity: 0.7 }}>请输入此快照的名称 {this.props.snapshotname} 以确认您了解此操作的风险。</p>
        <Input
          name="confirm"
          value={this.state.confirm}
          onChange={this.handleInputChange}
          placeholder={this.props.snapshotname}
          autoFocus={true}
        />
      </Modal.Form>
    )
  }
}
