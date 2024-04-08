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

import { set, cloneDeep } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/RoleCreate'
import RoleEditModal from 'components/Modals/EditAuthorization'
import DeleteModal from 'components/Modals/RoleDelete'
import RoleSpAuthorityModal from 'components/Modals/RoleSpAuthority'
import RoleRAuthorityModal from 'components/Modals/RoleRAuthority'
import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'role.create': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          if (devops) {
            data.metadata.namespace = devops
          }

          store
            .create(data, { cluster, namespace, workspace, devops })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: t('CREATE_SUCCESSFUL') })
              success && success()
            })
        },
        modal: CreateModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace }),
        ...props,
      })
    },
  },
  'role.edit': {
    on({ store, detail, success, ...props }) {
      const { module } = store
      const formTemplate = Object.assign(
        FORM_TEMPLATES[module]({ namespace: props.namespace }),
        cloneDeep(detail._originData)
      )

      set(formTemplate, 'metadata.resourceVersion', detail.resourceVersion)

      formTemplate.roleTemplates = detail.roleTemplates

      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          delete formTemplate.roleTemplates

          set(
            formTemplate,
            'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
            JSON.stringify(data)
          )

          store.update(detail, formTemplate).then(() => {
            Modal.close(modal)
            Notify.success({ content: t('UPDATE_SUCCESSFUL') })
            success && success()
          })
        },
        modal: RoleEditModal,
        store,
        module,
        edit: true,
        formTemplate,
        ...props,
      })
    },
  },
  'role.delete': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          store.delete(detail).then(() => {
            Modal.close(modal)
            Notify.success({ content: t('DELETE_SUCCESSFUL') })
            success && success()
          })
        },
        modal: DeleteModal,
        module: store.module,
        detail,
        store,
        ...props,
      })
    },
  },
  'role.sp': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          console.log("data",data)
          if (!data) {
            Modal.close(modal)
            return
          }

          request
            .post(
              `/kapis/versatel.kubesphere.io/v1alpha1/allocatesp`,
              data
            )
            .then(res => {
              // Modal.close(modal)

              if (Array.isArray(res)) {
                Notify.error({
                  content: `${t('Operation Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Operation Successfully')}` })
              }
              // success && success()
            })
          Modal.close(modal)
        },
        modal: RoleSpAuthorityModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace }),
        ...props,
      })
    },
  },
  'role.resource': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          console.log("data",data)
          if (!data) {
            Modal.close(modal)
            return
          }

          const url =
            data.operater === 'add'
              ? `/kapis/versatel.kubesphere.io/v1alpha1/allocateres`
              : 'www.baidu.com'

          request.post(url, data).then(res => {
            // Modal.close(modal)

            if (Array.isArray(res)) {
              Notify.error({
                content: `${t('Operation Failed, Reason:')}${res[0].message}`,
              })
            } else {
              Notify.success({ content: `${t('Operation Successfully')}` })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: RoleRAuthorityModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace }),
        ...props,
      })
    },
  },
}
