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

import { PATTERN_RB_TIME, PATTERN_VTEL_SIZE , PATTERN_IQN_NAME} from 'utils/constants'

// import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import RemoteBackup1Store from 'stores/remotebackup1.js'
import { NEW_PATTERN_VTEL_SIZE } from "../../../utils/constants";

@observer
export default class RemoteBackup1ClusterCreateModal extends React.Component {
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
    const resources = this.RemoteBackup1Store.list.data.map(node => ({
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

  handleCreate = RemoteBackup1Templates => {
    this.setState({ isLoading: true }) // isloading
    RemoteBackup1Templates.scheduleName = this.props.scheduleName
    if (RemoteBackup1Templates.keepLocal === undefined) {
      RemoteBackup1Templates.keepLocal = ''
    }
    if (RemoteBackup1Templates.retries === undefined) {
      RemoteBackup1Templates.retries = ''
    }
    if (RemoteBackup1Templates.full === undefined) {
      RemoteBackup1Templates.full = ''
    }
    if (RemoteBackup1Templates.incremental === undefined) {
      RemoteBackup1Templates.incremental = ''
    }
    set(
      this.props.formTemplate,
      JSON.stringify(RemoteBackup1Templates)
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

    const r_incremental = this.props.incremental
    const r_keepLocal = this.props.keepLocal
    const r_onFailure = this.props.onFailure

    console.log("this.props",this.props)

    const data = [
      {
        label: '每小时: 0 * * * *',
        value: '0 * * * *',
      },
      {
        label: '每天: 0 0 * * *',
        value: '0 0 * * *',
      },
      {
        label: '每月: 0 0 1 * *',
        value: '0 0 1 * *',
      },
      {
        label: '每个周一到周五: 0 0 1 * 1-5',
        value: '0 0 1 * 1-5',
      },
    ]

    const title = 'Edit Remote Backup Cluster'

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
          label={t('Automatic full backup intervals')}
          desc={t('Select a time interval')}
          rules={[
            { required: false },
            {
              pattern: PATTERN_RB_TIME,
              message: t('时间间隔格式错误', { message: t('Select a time interval') }),
            },
          ]}
        >
          <Select
            name="full"
            options={data}
            searchable
            clearable
            defaultValue=""
          />
        </Form.Item>
        <Form.Item
          label={t('Automatic incremental backup intervals')}
          desc={t('Select a time interval')}
          rules={[
            { required: false },
            {
              pattern: PATTERN_RB_TIME,
              message: t('时间间隔格式错误', { message: t('Select a time interval') }),
            },
          ]}
        >
          <Select
            name="incremental"
            options={data}
            searchable
            clearable
            defaultValue=""
          />
        </Form.Item>
        <Form.Item
          label={t('locally reserved snapshots')}
          desc={t('RB_SP_NUMBER')}
          rules={[
            { required: false, message: t('Please input number of snapshots') },
            {
              pattern: NEW_PATTERN_VTEL_SIZE,
              message: t('份数填写错误', { message: t('RB_SP_NUMBER') }),
            },
          ]}
        >
          <Input name="keepLocal" maxLength={63} placeholder={r_keepLocal} />
        </Form.Item>
        <Form.Item
          label={t('failed retries')}
          desc={t('Please enter the number of retries for transfer failures')}
          rules={[
            { required: false, message: t('请输入传输失败重试次数') },
            {
              pattern: NEW_PATTERN_VTEL_SIZE,
              message: t('次数填写错误', { message: t('Please enter the number of retries for transfer failures') }),
            },
          ]}
        >
          <Input name="retries" maxLength={63} placeholder={r_onFailure} />
        </Form.Item>
      </Modal.Form>
    )
  }
}
