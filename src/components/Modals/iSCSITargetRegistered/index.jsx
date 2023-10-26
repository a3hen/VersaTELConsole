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
import iSCSIMappingStore from 'stores/iSCSImapping'
import StepOne from 'components/Modals/iSCSITargetRegistered1'

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

    this.fetchResource()

    // this.state = {
    //   unselectedNodes: {},
    //   selectedNodes: [],
    // }
  }

  state = {
    showStepOne: false,
    stepzeroValue: null,
  }

  showStepOne = () => {
    this.setState({ showStepOne: true })
  }

  handleStepOne = formValues => {
    this.setState({
      stepzeroValue: {
        targetname: formValues.name,
        iqn: formValues.iqn,
      },
    })
    this.showStepOne()
  }

  fetchResource = params => {
    return this.iSCSIMappingStore.fetchList({
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
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(iSCSIMappingTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Target Registered'

    const { showStepOne } = this.state

    const { isLoading } = this.state

    console.log("step0.this.props.formTemplate",this.props.formTemplates)
    console.log("step0.this.state",this.state)

    if (isLoading) {
      return <div>Loading...</div>
    }
    if (showStepOne) {
      return (
        <StepOne
          module={module}
          visible={visible}
          formTemplate={formTemplate}
          onOk={this.handleCreate}
          onCancel={onCancel}
          targetname={this.state.stepzeroValue.targetname}
          iqn={this.state.stepzeroValue.iqn}
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
          label={t('Target Name')}
          desc={t('VTEL_NAME_DESC')}
          rules={[
            { required: true, message: t('Please input target name') },
            {
              pattern: PATTERN_VTEL_NAME,
              message: t('Invalid name', { message: t('VTEL_NAME_DESC') }),
            },
          ]}
        >
          <Input name="name" maxLength={63} placeholder="name" />
        </Form.Item>
        <Form.Item
          label={t('IQN')}
          desc={t('VTEL_IQN_DESC')}
          rules={[
            { required: true, message: t('Please input IQN') },
            {
              pattern: PATTERN_IQN_NAME,
              message: t('Invalid IQN', { message: t('VTEL_IQN_DESC') }),
            },
          ]}
        >
          <Input name="iqn" maxLength={63} placeholder="iqn" />
        </Form.Item>
      </Modal.Form>
    )
  }
}