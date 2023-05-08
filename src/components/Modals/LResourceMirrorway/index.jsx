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
import DisklessResourceStore from 'stores/disklessresource'
import StepOne from 'components/Modals/LResourceMirrorwayOne'
import { data } from "autoprefixer";

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
    this.disklessresourceStore = new DisklessResourceStore()

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
      // label: storagepool.name.concat(' - ', storagepool.node),
      label: storagepool.uniqueID,
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
  // }

  state = {
    showStepOne: false,
    stepzeroValue: null // { node: null, mirrowWay: null }
  }

  showStepOne = () => {
    this.setState({ showStepOne: true })
  }

  handleStepOne = formValues => {
    const mirrorWay = this.props.mirrorWay
    this.setState({
      stepzeroValue: {
        node: formValues.node,
        mirrorWay: formValues.members,
      },
    })
console.log('formvalues', formValues, 'mirrorWay', mirrorWay)
    if (formValues.members > mirrorWay) {
      this.showStepOne()
    } else {
      this.props.onOk({
        resname: '',
        poolname: '',
        nodename: formValues.node[0],
        originalnum: 1,
        newnum: parseInt(formValues.members, 10),
      })
    }
  }

  handleCreate = LResourceTemplates => {
    const dataToSubmit = { ...this.props.formTemplate, ...LResourceTemplates }
    // set(
    //   this.props.formTemplate,
    //   // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
    //   JSON.stringify(LResourceTemplates)
    // )
    const stepzeroValues = this.state.stepzeroValue
    this.props.onOk({
      resname: '',
      poolname: dataToSubmit.storagepool[0][0],
      nodename: stepzeroValues.node[0],
      originalnum: 1,
      newnum: parseInt(stepzeroValues.mirrorWay, 10),
    })
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

    if (value.indexOf('pvc-') === 0) {
      return callback({
        message: t('Resource name cannot start with string "pvc-"'),
        field: rule.field,
      })
    }

    if (value === 'linstordb') {
      return callback({
        message: t('Resource name cannot be "linstordb"'),
        field: rule.field,
      })
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
    console.log('props',this.props)

    const title = 'Choose diskless node'

    const { showStepOne } = this.state

    if (showStepOne) {
      return (
        <StepOne
          module={module}
          visible={visible}
          formTemplate={formTemplate}
          onOk={this.handleCreate}
          onCancel={onCancel}
          node={this.state.stepzeroValue.node}
        />
      )
    }

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="database"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleStepOne}
        okText={t('OK')}
        visible={visible}
      >
        <Form.Item
          label={t('Member')}
          desc={t('choose_mirrorway_number')}
        >
          <Input name="members" maxLength={63} placeholder="size" />
        </Form.Item>
        <Form.Item
          label={t('LINSTOR_NODES')}
          desc={t('Select Resource mirrorway change node')}
          // rules={[{ required: true, message: t('Please select VersaSDS Node') }]}
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
