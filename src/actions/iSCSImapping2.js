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
    on({ store, cluster, namespace, workspace, success, onLoadingComplete, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .delete(
              `/kapis/versatel.kubesphere.io/v1alpha1/mapping/${data.resName} `
            )
            .then(res => {
              if (Array.isArray(res)) {
                Notify.error({
                  content: `${t('Deleted Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Deleted Successful')}` })
              }
              success && success()
              onLoadingComplete && onLoadingComplete()
            })
            .finally(() => {
              Modal.close(modal)
              localStorage.removeItem('iqn')
              localStorage.removeItem('runningNode')
              localStorage.removeItem('secondaryNode')
              localStorage.removeItem('initialNode')
              localStorage.removeItem('isRunningNodeDisabled')
              localStorage.removeItem('vipCount')
            })
          // request
          //   .delete(
          //     `/kapis/versatel.kubesphere.io/v1alpha1/mapping/${data.resName} `
          //   )
          //   .then(res => {
          //     // Modal.close(modal)
          //     if (Array.isArray(res)) {
          //       Notify.error({
          //         content: `${t('Deleted Failed, Reason:')}${res[0].message}`,
          //       })
          //     } else {
          //       Notify.success({ content: `${t('Deleted Successful')}` })
          //     }
          //     success && success()
          //   })
          // Modal.close(modal)
        },
        modal: DeleteModal,
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
  'mapping.map': {
    on({ store, cluster, namespace, workspace, success, onLoadingComplete, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (data.unMap === '关闭') {
            data.unMap = '0'
          } else if (data.unMap === '开启') {
            data.unMap = '1'
          }
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .post(`/kapis/versatel.kubesphere.io/v1alpha1/mapping`, data)
            .then(res => {
              if (Array.isArray(res)) {
                Notify.error({
                  content: `${t('Operation Failed, Reason:')}${res[0].message}`,
                })
              } else {
                Notify.success({ content: `${t('Operation Successfully')}` })
              }
              success && success()
              onLoadingComplete && onLoadingComplete()
            })
            .finally(() => {
              Modal.close(modal)
            })
          // request
          //   .post(`/kapis/versatel.kubesphere.io/v1alpha1/mapping`, data)
          //   .then(res => {
          //     if (Array.isArray(res)) {
          //       Notify.error({
          //         content: `${t('Operation Failed, Reason:')}${res[0].message}`,
          //       })
          //     } else {
          //       Notify.success({ content: `${t('Operation Successfully')}` })
          //     }
          //     onLoadingComplete && onLoadingComplete()
          //     success && success()
          //     Modal.close(modal)
          //   })
          // Modal.close(modal)
        },
        modal: MapModal,
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
