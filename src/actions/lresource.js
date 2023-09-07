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

import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/LResourceCreate'
import DeleteModalR from 'components/Modals/LResourceDelete'
import DisklessModalR from 'components/Modals/LResourceDiskless'
import MirrorwayModal from 'components/Modals/LResourceMirrorway'
import DeleteModal from 'components/Modals/Delete'
import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'lresources.delete': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
  'lresources.mirrorway': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      // const resourceName = name
      const resourceName = props?.name
      const originalnum = parseInt(props?.mirrorWay)
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)

            if (Array.isArray(res)) {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res[0].message}`,
              })
            } else {
              Notify.success({ content: `${t('Created Successfully')}` })
            }
            success && success()
          })
          Modal.close(modal)
        },
        modal: DeleteModalR,
          // data.metadata.name = resourceName
          const mergedData = {
            ...data,
            resname: resourceName,
            originalnum,
          }
          delete mergedData.name

          request
            .post(
              `/kapis/versatel.kubesphere.io/v1alpha1/versasdsresource/copy`,
              mergedData
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
              success && success()
            })
          Modal.close(modal)
        },
        modal: MirrorwayModal,
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
  'lresources.diskless': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      // const resourceName = name
      const resourceName = props?.name
      const { module } = store

      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          data.metadata.name = resourceName
          const mergedData = { ...data, name: resourceName }
          delete mergedData.name // 删除创建diskless资源传递对象的name属性

          request
            .post(
              `/kapis/versatel.kubesphere.io/v1alpha1/versasdsresource/diskless`,
              mergedData
            )
            .then(res => {
              // Modal.close(modal)

              if (Array.isArray(res)) {
                Notify.error({
                  content: `${t('Created Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Created Successfully')}` })
              }
              success && success()
            })
          Modal.close(modal)
        },
        modal: DisklessModalR,
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
  'lresources.create': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }
          const resourceName = data.name
          data.metadata.name = resourceName
          delete data.name // 删除创建资源传递对象的name属性，并在metadata中将name属性更改为资源名

          store.create(data).then(res => {
            // Modal.close(modal)

            if (Array.isArray(res)) {
              Notify.error({
                content: `${t('Created Failed, Reason:')}${res[0].message}`,
              })
            } else {
              Notify.success({ content: `${t('Created Successfully')}` })
            }
            success && success()
          })
          Modal.close(modal)
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

  'lresources.batch.delete': {
    on({ store, success, rowKey, ...props }) {
      const { data, selectedRowKeys } = store.list
      const selectValues = data
        .filter(item => selectedRowKeys.includes(item[rowKey]))
        .map(item => {
          return { name: item.name, namespace: item.namespace }
        })

      const selectNames = selectValues.map(item => item.name)

      const modal = Modal.open({
        onOk: async () => {
          const reqs = []

          data.forEach(item => {
            const selectValue = selectValues.find(
              value =>
                value.name === item.name && value.namespace === item.namespace
            )

            if (selectValue) {
              reqs.push(store.delete(item))
            }
          })

          await Promise.all(reqs)
          reqs.forEach(item =>
            item.then(res => {
              if (res) {
                Notify.error({
                  content: `${t('Deleted Failed, Reason:')}${res[0].message}`,
                })
              }
            })
          )

          Modal.close(modal)
          Notify.success({ content: t('DELETE_TIP_SUCCESSFUL') })
          store.setSelectRowKeys([])
          success && success()
        },
        resource: selectNames.join(', '),
        modal: DeleteModal,
        store,
        ...props,
      })
    },
  },
}
