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

import CreateModal from 'components/Modals/PVCreate'
import DeleteModal from 'components/Modals/Delete'
// import DeleteModal from 'components/Modals/Delete'
import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'pvresource.create': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(res => {
            // Modal.close(modal)
            if (res !== "创建成功") {
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
  'pvresource.delete': {
    on({ store, detail, success, ...props }) {
      let processedName1 = detail.name.replace(/\//g, '_')
      let processedName2 = processedName1.replace('_', '')
      const modal = Modal.open({
        onOk: () => {
          request
            .delete(
              `/kapis/versatel.kubesphere.io/v1alpha1/pv/${detail.node}/${processedName2}`
            )
            .then(res => {
              // Modal.close(modal)
              if (res !== "删除成功") {
                Notify.error({
                  content: `${t('Deleted Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Deleted Successful')}` })
              }
              success && success()
            })
          Modal.close(modal)
        },
        store,
        modal: DeleteModal,
        resource: detail.name,
        ...props,
      })
    },
  },
  'pvresource.batch.delete': {
    on({ store, success, rowKey, nodename, ...props }) {
      const { data, selectedRowKeys } = store.list
      const selectValues = data
        .filter(item => selectedRowKeys.includes(item[rowKey]) && item.node === nodename)
        .map(item => {
          return { name: item.name, node: item.node }
        })

      const selectNames = selectValues.map(item => item.name)

      const modal = Modal.open({
        onOk: async () => {
          const reqs = []

          data.forEach(item => {
            const selectValue = selectValues.find(
              value =>
                value.name === item.name && value.node === item.node
            )

            if (selectValue) {
              let processedName1 = selectValue.name.replace(/\//g, '_')
              let processedName2 = processedName1.replace('_', '')
              reqs.push(request.delete(`/kapis/versatel.kubesphere.io/v1alpha1/pv/${selectValue.node}/${processedName2}`))
            }
          })


          await Promise.all(reqs)
          reqs.forEach(item =>
            item.then(res => {
              if (res !== "删除成功") {
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
