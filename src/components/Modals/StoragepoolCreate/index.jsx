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

import { PATTERN_VTEL_NAME, PATTERN_SP_VOL_NAME } from 'utils/constants'

import LNodeStore from 'stores/linstornode'
import StoragepoolStore from 'stores/storagepool'
import VGResourceStore from 'stores/vgresource'
import TPResourceStore from 'stores/tpresource'
import LResourceStore from 'stores/lresource'

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
    this.linstorresourceStore = new LResourceStore()
    this.tpsStore = new TPResourceStore()
    this.vgsStore = new VGResourceStore()
    this.spStore = new StoragepoolStore()

    this.fetchNodes()
    this.fetchResource()
    this.fetchVgs()
    this.fetchTps()
    this.fetchSps()
  }

  state = {
    lvmType: 'LVM',
    selectedNode: null,
  }

  handleLvmTypeChange = (value) => {
    this.setState({ lvmType: value })
  }

  fetchNodes = params => {
    return this.linstornodeStore.fetchList({
      ...params,
    })
  }

  fetchResource = params => {
    return this.linstorresourceStore.fetchList({
      ...params,
    })
  }

  fetchSps = params => {
    return this.spStore.fetchList({
      ...params,
    })
  }

  fetchVgs = params => {
    return this.vgsStore.fetchList({
      node: this.props.node,
      ...params,
    })
  }

  fetchTps = params => {
    return this.tpsStore.fetchList({
      name: this.props.name,
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

  get vgs() {
    const spNames = this.sps.map(sp => sp.poolName)
    const new_list = this.vgsStore.list.data.filter(node => node.node === this.state.selectedNode && !spNames.includes(node.vg));
    const vgs = new_list.map(node => ({
      label: node.vg,
      value: node.vg,
    }))
    return vgs
  }

  get tps() {
    const sppoolname = this.sps.map(sp => sp.poolName)
    const new_list = this.tpsStore.list.data.filter(node => node.node === this.state.selectedNode);
    const tps = new_list.map(node => ({
      label: node.vg + '/' + node.name,
      value: node.vg + '/' + node.name,
      vg: node.vg,
    }))
    const new_tps = tps.filter(tp => !sppoolname.includes(tp.value))
    return new_tps
  }

  get sps() {
    const new_list = this.spStore.list.data.filter(node => node.node === this.state.selectedNode);
    const sps = new_list.map(node => ({
      label: node.name,
      value: node.name,
    }))
    return new_list
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
    const volumeOptions = this.state.lvmType === 'LVM' ? this.vgs : this.tps
    const title = 'Create Storagepoo' + 'l'
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
          desc={t('Select VersaSDS Node')}
          rules={[
            { required: true, message: t('Please select VersaSDS Node') },
          ]}
        >
          <Select
            name="node"
            options={this.nodes}
            onFetch={this.fetchNodes}
            searchable
            clearable
            onChange={value => this.setState({ selectedNode: value })}
          />
        </Form.Item>
        <Form.Item
          label={t('LVM Type')}
          desc={t('Select LVM Type')}
          rules={[
            { required: true, message: t('Please select LVM Type') },
          ]}
        >
          <Select
            name="type"
            options={lvmType}
            defaultValue="LVM"
            clearable
            onChange={this.handleLvmTypeChange}
          />
        </Form.Item>
        <Form.Item
          label={t('Volume name')}
          desc={t('LVM_VOLUME_NAME_DESC')}
          rules={[
            { required: true, message: t('Please select Volume name') },
          ]}
        >
          <Input
            name="volume"
            maxLength={63}
            placeholder="name"
          />
          {/*<Select*/}
          {/*  name="volume"*/}
          {/*  options={volumeOptions}*/}
          {/*  onFetch={this.fetchVgs}*/}
          {/*  searchable*/}
          {/*  clearable*/}
          {/*/>*/}
        </Form.Item>
        {/*<Form.Item*/}
        {/*  label={t('Volume name')}*/}
        {/*  desc={t('LVM_VOLUME_NAME_DESC')}*/}
        {/*  rules={[*/}
        {/*    { required: true, message: t('Please input Volume name') },*/}
        {/*    {*/}
        {/*      pattern: PATTERN_SP_VOL_NAME,*/}
        {/*      message: t('Invalid name', { message: t('SP_VOL_NAME_DESC') }),*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <Input name="volume" maxLength={63} placeholder="LVM name" />*/}
        {/*</Form.Item>*/}
      </Modal.Form>
    )
  }
}
