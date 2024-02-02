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
import { Input, Form, Select, Icon } from '@kube-design/components'

import { Modal } from 'components/Base'

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE } from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import RemoteBackup1Store from 'stores/remotebackup1'

@observer
export default class RemoteBackup1ClusterDeleteModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    RemoteBackup1Templates: PropTypes.array,
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
    module: 'remotebackup1',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.RemoteBackup1Store = new RemoteBackup1Store()

    this.fetchResource()

    this.state = {
      isLoading: false, // isloading
    }
  }

  fetchResource = params => {
    return this.RemoteBackup1Store.fetchList({
      ...params,
    })
  }

  get resources() {
    const resources = this.RemoteBackup1Store.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return resources
  }

  handleCreate = RemoteBackup1Templates => {
    this.setState({ isLoading: true }) // isloading
    RemoteBackup1Templates.schedulename = this.props.scheduleName
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(RemoteBackup1Templates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  handleInputChange = e => {
    this.setState({ confirm: e.target.value })
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'delete the remote backup task'

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
        isSubmitting={this.state.isLoading} // isloading
        disableOk={this.state.confirm !== this.props.scheduleName}
      >
        <p style={{ marginBottom: '10px', opacity: 0.7 }}>请输入此备份任务的名称 {this.props.scheduleName} 以确认您了解此操作的风险。</p>
        <Input
          name="confirm"
          value={this.state.confirm}
          onChange={this.handleInputChange}
          placeholder={this.props.scheduleName}
          autoFocus={true}
        />
      </Modal.Form>
    )
  }
}
