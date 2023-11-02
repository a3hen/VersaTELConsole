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

import {
  PATTERN_VTEL_NAME,
  PATTERN_VTEL_SIZE,
  PATTERN_IQN_NAME,
} from 'utils/constants'

import LNodeStore from 'stores/linstornode'
// import StoragepoolStore from 'stores/storagepool'
import iSCSIMappingStore from 'stores/iSCSImapping'
import StepTwo from 'components/Modals/iSCSITargetRegistered2'
import StepZero from 'components/Modals/iSCSITargetRegistered'

@observer
export default class iSCSIMappingRegisteredModal extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    module: PropTypes.string,
    iSCSIMappingTemplates: PropTypes.array,
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
    module: 'iSCSImapping',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.iSCSIMappingStore = new iSCSIMappingStore()
    this.linstornodeStore = new LNodeStore()

    this.fetchResource()
    this.fetchNodes()

    this.state = {
      showStepTwo: false,
      showStepZero: false,
      steponeValue: null,
      isRunningNodeDisabled: false,
      runningNode: [],
      secondaryNode: [],
      initialNode: [],
    }
  }

  showStepTwo = () => {
    this.setState({ showStepTwo: true })
  }

  showStepZero = () => {
    this.setState({ showStepZero: true })
  }

  handleStepTwo = formValues => {
    this.setState({
      steponeValue: {
        running_node: formValues.running_node,
        secondary_node: formValues.secondary_node,
        initial_node: formValues.initial_node,
      },
    })
    this.showStepTwo()
  }

  handleRunningNodeChange = value => {
    const runningNode = value.map(node => ({
      label: node,
      value: node,
    }))
    this.setState({ runningNode })
  }

  handleSecondaryNodeChange = value => {
    const valueArray = Array.isArray(value) ? value : [value]
    value = value || []

    const secondaryNode = valueArray.map(node => ({
      label: node,
      value: node,
    }))
    this.setState({ secondaryNode }, this.checkNodeSelection)
  }

  handleInitialNodeChange = value => {
    value = value || []
    this.setState({ initialNode: value }, this.checkNodeSelection)
  }

  checkNodeSelection = () => {
    const { secondaryNode, initialNode } = this.state
    const isRunningNodeDisabled =
      secondaryNode.length > 0 || initialNode.length > 0
    this.setState({ isRunningNodeDisabled })
  }

  fetchResource = params => {
    return this.iSCSIMappingStore.fetchList({
      ...params,
    })
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

  get resources() {
    const resources = this.iSCSIMappingStore.list.data.map(node => ({
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

  handleCreate = iSCSIMappingTemplates => {
    const dataToSubmit = {
      ...this.props.formTemplate,
      ...iSCSIMappingTemplates,
    }
    this.props.onOk(dataToSubmit)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Target Registered'

    const { showStepTwo } = this.state

    const { showStepZero } = this.state

    const { isLoading } = this.state

    const initialNodes = this.state.runningNode.filter(
      obj =>
        !this.state.secondaryNode.some(
          obj2 => obj.label === obj2.label && obj.value === obj2.value
        )
    )

    console.log('step1.this.props.formTemplate', this.props.formTemplates)
    console.log('step1.this.props', this.props)
    console.log('step1.this.state', this.state)

    if (isLoading) {
      return <div>Loading...</div>
    }
    if (showStepTwo) {
      return (
        <StepTwo
          module={module}
          visible={visible}
          formTemplate={formTemplate}
          onOk={this.handleCreate}
          onCancel={onCancel}
          targetname={this.props.targetname}
          iqn={this.props.iqn}
          running_node={this.state.steponeValue.running_node}
          secondary_node={this.state.steponeValue.secondary_node}
          initial_node={this.state.steponeValue.initial_node}
        />
      )
    }
    if (showStepZero) {
      return (
        <StepZero
          module={module}
          visible={visible}
          formTemplate={formTemplate}
          onOk={this.handleCreate}
          onCancel={onCancel}
        />
      )
    }

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="database"
        data={formTemplate}
        // onCancel={onCancel}
        onCancel={this.showStepZero}
        onOk={this.handleStepTwo}
        cancelText={t('PREVIOUS_STEP')}
        okText={t('NEXT_STEP')}
        visible={visible}
      >
        <Form.Item
          label={t('RUNNING_NODES')}
          desc={t('Select Running Node')}
          rules={[{ required: true, message: t('Please select Running Node') }]}
        >
          <Select
            name="running_node"
            options={this.nodes}
            onFetch={this.fetchNodes}
            searchable
            clearable
            multi
            onChange={this.handleRunningNodeChange}
            disabled={this.state.isRunningNodeDisabled}
          />
        </Form.Item>
        <Form.Item
          label={t('SECONDARY_NODES')}
          desc={t('Select Secondary Node')}
          rules={[
            { required: false, message: t('Please select Secondary Node') },
          ]}
        >
          <Select
            name="secondary_node"
            options={this.state.runningNode || []}
            searchable
            clearable
            multi
            onChange={this.handleSecondaryNodeChange}
            disabled={this.state.initialNode.length > 0}
          />
        </Form.Item>
        <Form.Item
          label={t('INITIAL_NODES')}
          desc={t('Select Initial Node')}
          rules={[{ required: true, message: t('Please select Initial Node') }]}
        >
          <Select
            name="initial_node"
            options={initialNodes}
            searchable
            clearable
            onChange={this.handleInitialNodeChange}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
