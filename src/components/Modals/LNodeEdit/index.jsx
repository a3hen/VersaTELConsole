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

import { PATTERN_IP, PATTERN_NODE_NAME } from 'utils/constants'

@observer
export default class LNodeCreateModal extends React.Component {
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
    module: 'linstornodes',
    onOk() {},
    onCancel() {},
  }

  handleCreate = LNodeTemplates => {
    this.props.formTemplate.name = this.props.detail.name
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(LNodeTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  LNodeNameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    // const { workspace, cluster, namespace } = this.props
    const name = get(this.props.formTemplate, 'name')

    if (this.props.edit && name === value) {
      return callback()
    }

    this.props.store
      .checkName({ name: value })
      // .checkName({ name: value, workspace, cluster, namespace })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Node name exists'), field: rule.field })
        }
        callback()
      })
  }

  render() {
    const {
      // title,
      detail,
      visible,
      module,
      onCancel,
      formTemplate,
      // LNodeTemplates,
      // isSubmitting,
    } = this.props
    // const { showEditAuthorization } = this.state
    console.log("this.props",this.props)

    const isLINSTORNode = module === 'linstornodes'
    const title = detail ? 'Modify VersaSDS Node' : 'Create VersaSDS Node'
    const nodeType = [
      {
        disabled: false,
        isFedManaged: false.valueOf,
        label: 'Combined',
        value: 'Combined',
      },
      {
        disabled: false,
        isFedManaged: false.valueOf,
        label: 'Controller',
        value: 'Controller',
      },
      {
        disabled: false,
        isFedManaged: false.valueOf,
        label: 'Satellite',
        value: 'Satellite',
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
          label={t('VersaSDS Node Type')}
          desc={t('Type of VersaSDS Node')}
        >
          <Select
            name="node_type"
            // cluster={this.props.cluster}
            options={nodeType}
            clearable
            defaultValue="Combined"
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
