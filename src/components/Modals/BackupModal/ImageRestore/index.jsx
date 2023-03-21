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
import { Modal } from 'components/Base'
import { Input, Form } from '@kube-design/components'
import { PATTERN_SP_VOL_NAME } from 'utils/constants'
// import { Modal, Text } from 'components/Base'

@observer
export default class ImageRestoreModal extends React.Component {
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
    module: 'resourcebackups',
    onOk() {},
    onCancel() {},
  }

  // constructor(props) {
  //   super(props)
  // }

  handleCreate = ResourceBackupTemplates => {
    set(
      this.props.formTemplate,
      // 'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
      JSON.stringify(ResourceBackupTemplates)
    )
    this.props.onOk(this.props.formTemplate)
  }

  render() {
    const { visible, onCancel, formTemplate } = this.props

    const title = 'Using image to restore resources'

    return (
      <Modal.Form
        width={600}
        title={t(title)}
        icon="snapshot"
        data={formTemplate}
        onCancel={onCancel}
        onOk={this.handleCreate}
        okText={t('OK')}
        visible={visible}
      >
        {/* <Text title={t('BACKUP_RESTORE_TIP')} description='' /> */}
        <Form.Item
          label={t('VG name')}
          desc={t('VG_NAME_DESC')}
          rules={[
            { required: true, message: t('Please input VG name') },
            {
              pattern: PATTERN_SP_VOL_NAME,
              message: t('Invalid name', { message: t('VG_VOL_NAME_DESC') }),
            },
          ]}
        >
          <Input name="vg" maxLength={63} placeholder="VG name" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
