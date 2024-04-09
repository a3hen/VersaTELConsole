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

import { PATTERN_VTEL_NAME, PATTERN_VTEL_SIZE , PATTERN_IQN_NAME, PATTERN_IP} from 'utils/constants'

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

    this.state = {
      vipCount: localStorage.getItem('vipCount')
        ? JSON.parse(localStorage.getItem('vipCount'))
        : 1,
      showStepOne: false,
      isLoading: false, // isloading
    }
  }

  handleVipChange = value => {
    this.setState({ vipCount: value === '1个连接IP' ? 1 : 2 })
    // 如果选择的是1个连接IP，清除第二个IP输入框的值
    if (value === '1个连接IP') {
      this.props.formTemplate.vip2 = ''
    }
  }

  showStepOne = () => {
    localStorage.setItem('vipCount', JSON.stringify(this.state.vipCount))
    this.setState({ showStepOne: true })
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
    const vipValues = Array.from({ length: this.state.vipCount }, (_, i) => this.props.formTemplate[`vip${i + 1}`])
    const dataToSubmit = { ...this.props, ...iSCSIMappingTemplates, vipList: vipValues }

    // Create a new object to pass to onOk
    const dataForOnOk = { ...dataToSubmit }
    if (
      this.props.target_data.some(
        item =>
          item.vipList.includes(dataForOnOk.vip1) ||
          item.vipList.includes(dataForOnOk.vip2)
      )
    ) {
      alert('填写的连接ip不能是被使用的ip！')
      return
    }
    if (dataForOnOk.vip2 && dataForOnOk.vip1 === dataForOnOk.vip2) {
      alert('填写的两个连接ip不能相同！')
      return
    }
    this.setState({ isLoading: true }) // isloading

    this.props.onOk(dataForOnOk)

    localStorage.removeItem('iqn')
    localStorage.removeItem('runningNode')
    localStorage.removeItem('secondaryNode')
    localStorage.removeItem('initialNode')
    localStorage.removeItem('isRunningNodeDisabled')
    localStorage.removeItem('vipCount')
  }

  onLoadingComplete = () => {
    this.setState({ isLoading: false })
  } // isloading

  handleCancel = () => {
    localStorage.removeItem('iqn')
    localStorage.removeItem('runningNode')
    localStorage.removeItem('secondaryNode')
    localStorage.removeItem('initialNode')
    localStorage.removeItem('isRunningNodeDisabled')
    localStorage.removeItem('vipCount')
    this.props.onCancel()
  } // 重构oncancel方法

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Target Registered'

    const { showStepOne } = this.state

    const data = [
      {
        label: '1个连接IP',
        value: '1个连接IP',
      },
      {
        label: '2个连接IP',
        value: '2个连接IP',
      },
    ]


    if (showStepOne) {
      return (
        <StepOne
          module={module}
          visible={visible}
          formTemplate={formTemplate}
          onOk={this.handleCreate}
          onCancel={onCancel}
          targetname={this.props.targetname}
          iqn={this.props.iqn}
          target_data={this.props.target_data}
          flag={true}
        />
      )
    }

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="target"
        data={formTemplate}
        onCancel={this.showStepOne}
        onClose={this.handleCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        cancelText={t('PREVIOUS_STEP')}
        visible={visible}
        isSubmitting={this.state.isLoading} // isloading
      >
        <Form.Item
          label={t('连接')}
          desc={t('Select the number of IPs')}
          rules={[
            { required: true, message: t('Please Select the number of IPs') },
          ]}
        >
          <Select
            name="vipnumbers"
            options={data}
            searchable
            clearable
            defaultValue="1个连接IP"
            onChange={this.handleVipChange}
          />
        </Form.Item>
        {Array.from({ length: this.state.vipCount }, (_, i) => (
          <Form.Item
            key={i}
            label={t(`连接IP ${i + 1}`)}
            rules={[
              { required: true, message: t('Please input IP') },
              {
                pattern: PATTERN_IP,
                message: t('IP地址格式错误', { message: t('VTEL_IP_DESC') }),
              },
            ]}
          >
            <Input name={`vip${i + 1}`} />
          </Form.Item>
        ))}
      </Modal.Form>
    )
  }
}
