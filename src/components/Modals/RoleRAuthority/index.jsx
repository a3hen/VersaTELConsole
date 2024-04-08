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

    this.fetchNodes()
  }

  fetchNodes = params => {
    return this.linstornodeStore.fetchList({
      ...params,
    })
  }

  handleCreate = LResourceTemplates => {
    let resourceData = this.props.data
    if (typeof resourceData === 'string') {
      resourceData = [resourceData]
    }
    const dataToSubmit = {
      ...this.props.formTemplate,
      ...LResourceTemplates,
      role: this.props.select_role,
      resource: resourceData,
    }
    // set(
    //   this.props.formTemplate,
    //   // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
    //   JSON.stringify(LResourceTemplates)
    // )
    this.props.onOk(dataToSubmit)
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
    console.log("r_proos",this.props)

    const title = '资源赋权'

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="resource"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
      >
        {Array.isArray(this.props.data) ? (
          <div>
            已选中的资源:
            {this.props.data.map((item, index) => (
              <span key={index}>{item}{index < this.props.data.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        ) : (
          <div>
            已选中的资源: 资源名:{' '}
            {this.props.data ? this.props.data.name : '未指定'}
          </div>
        )}
        <Form.Item
          label={t('权限操作')}
          desc={t(
            '请选择需要对已选择的资源进行的操作'
          )}
          // rules={[{ required: true, message: t('Please select VersaSDS Node') }]}
        >
          <Select
            name="operater"
            options={[
              { label: '赋权', value: "add" },
              // { label: '解权', value: "delete" },
            ]}
            searchable={false}
            clearable={false}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
