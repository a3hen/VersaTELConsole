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

import { set } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input, Form, Select } from '@kube-design/components'

import { Modal } from 'components/Base'

import { PATTERN_VTEL_NAME } from 'utils/constants'

import LNodeStore from 'stores/linstornode'

@observer
export default class StoragepoolCreateModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    LNodeTemplates: PropTypes.array,
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
    module: 'storagepools',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.linstornodeStore = new LNodeStore()

    this.fetchNodes()
  }

  fetchNodes = params => {
    return this.linstornodeStore.fetchList({
      ...params,
    })
  }

  get nodes() {
    const nodes = this.linstornodeStore.list.data.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return nodes
  }

  handleCreate = LNodeTemplates => {
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(LNodeTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  // SPNameValidator = (rule, value, callback) => {
  //   if (!value) {
  //     return callback()
  //   }

  //   // const { workspace, cluster, namespace } = this.props
  //   const name = get(this.props.formTemplate, 'name')

  //   if (this.props.edit && name === value) {
  //     return callback()
  //   }

  //   this.props.store.checkName({ name: value }).then(resp => {
  //     if (resp.exist) {
  //       return callback({
  //         message: t('Storagepool name exists'),
  //         field: rule.field,
  //       })
  //     }
  //     callback()
  //   })
  // }

  render() {
    const {
      // title,
      // detail,
      visible,
      // module,
      onCancel,
      formTemplate,
      // LNodeTemplates,
      // isSubmitting,
    } = this.props

    const title = 'Create Storagepool'
    const lvmType = [
      {
        disabled: false,
        isFedManaged: false.valueOf,
        label: 'LVM',
        value: 'LVM',
      },
      {
        disabled: false,
        isFedManaged: false.valueOf,
        label: 'LVM THIN',
        value: 'LVM THIN',
      },
    ]

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
            { required: true, message: t('Please input Storagepool name') },
            {
              pattern: PATTERN_VTEL_NAME,
              message: t('Invalid name', { message: t('VTEL_NAME_DESC') }),
            },
            // { validator: this.SPNameValidator },
          ]}
        >
          <Input name="name" maxLength={63} placeholder="name" />
        </Form.Item>
        <Form.Item
          label={t('LINSTOR_NODES')}
          desc={t('Select LINSTOR Node')}
          rules={[{ required: true, message: t('Please select LINSTOR Node') }]}
        >
          <Select
            name="node"
            options={this.nodes}
            onFetch={this.fetchNodes}
            searchable
            clearable
          />
        </Form.Item>
        <Form.Item label={t('LVM Type')} desc={t('Select LVM Type')}>
          <Select name="type" options={lvmType} defaultValue="LVM" clearable />
        </Form.Item>
        <Form.Item
          label={t('Volume name')}
          desc={t('LVM_VOLUME_NAME_DESC')}
          rules={[
            { required: true, message: t('Please input Volume name') },
            {
              pattern: PATTERN_VTEL_NAME,
              message: t('Invalid name', { message: t('VTEL_NAME_DESC') }),
            },
          ]}
        >
          <Input name="volume" maxLength={63} placeholder="LVM name" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
