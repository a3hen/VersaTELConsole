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

// import { set, cloneDeep } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import {
  SnapshotCreateModal,
  SnapshotRestoreModal,
  ImageCreateModal,
  ImageRestoreModal,
} from 'components/Modals/BackupModal'
import FORM_TEMPLATES from 'utils/form.templates'
// import { set, isEmpty } from 'lodash'

export default {
  'resourcebackups.snapshot.create': {
    on({
      store,
      detail,
      type,
      cluster,
      namespace,
      workspace,
      success,
      devops,
      ...props
    }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)

            if (res.message === 'success') {
              Notify.success({ content: `${t('Created Successfully')}` })
            } else {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res.message}`,
              })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: SnapshotCreateModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace, type, detail }),
        ...props,
      })
    },
  },
  'resourcebackups.snapshotrestore.create': {
    on({
      store,
      detail,
      type,
      cluster,
      namespace,
      workspace,
      success,
      devops,
      ...props
    }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)

            if (res.message === 'success') {
              Notify.success({ content: `${t('Created Successfully')}` })
            } else {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res.message}`,
              })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: SnapshotRestoreModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace, type, detail }),
        ...props,
      })
    },
  },
  'resourcebackups.image.create': {
    on({
      store,
      detail,
      type,
      cluster,
      namespace,
      workspace,
      success,
      devops,
      ...props
    }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)

            if (res.message === 'success') {
              Notify.success({ content: `${t('Created Successfully')}` })
            } else {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res.message}`,
              })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: ImageCreateModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace, type, detail }),
        ...props,
      })
    },
  },
  'resourcebackups.imagerestore.create': {
    on({
      store,
      detail,
      type,
      cluster,
      namespace,
      workspace,
      success,
      devops,
      ...props
    }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)

            if (res.message === 'success') {
              Notify.success({ content: `${t('Created Successfully')}` })
            } else {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res.message}`,
              })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: ImageRestoreModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace, type, detail }),
        ...props,
      })
    },
  },
}
