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

import MapModal from 'components/Modals/iSCSIMappingMap'
import DeleteModal from 'components/Modals/iSCSIMappingDelete'
import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'mapping.delete2': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: async (data) => {
          console.log('data', data)
          if (!data) {
            Modal.close(modal)
            return
          }

          // 创建一个空数组来存储所有的删除请求
          const reqs = data.hostName.map(hostName =>
            request.delete(`/kapis/versatel.kubesphere.io/v1alpha1/mapping/${hostName}`)
          )

          // 等待所有的删除请求完成
          await Promise.all(reqs)

          // 遍历每一个删除请求的Promise对象
          reqs.forEach(item =>
            item.then(res => {
              if (Array.isArray(res)) {
                Notify.error({
                  content: `${t('Deleted Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Deleted Successful')}` })
              }
              success && success()
            })
          )

          Modal.close(modal)
        },
        modal: DeleteModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        ...props,
      })
    },
  },
  'mapping.map': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (data.unMap === '关闭') {
            data.unMap = '0'
          } else if (data.unMap === '开启') {
            data.unMap = '1'
          }
          console.log('data', data)
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .post(`/kapis/versatel.kubesphere.io/v1alpha1/mapping`, data)
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
        modal: MapModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        // formTemplate: FORM_TEMPLATES[module]({ namespace }),
        ...props,
      })
    },
  },
}
