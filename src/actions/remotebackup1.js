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

import CreateModal from 'components/Modals/RemotebackuptaskCreate'
import DeleteModal from 'components/Modals/RemotebackuptaskDelete'
import EditModal from 'components/Modals/RemotebackuptaskEdit'

import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'rb_task.delete': {
    on({ store, cluster, namespace, workspace, success, onLoadingComplete, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          console.log('data', data)
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .delete(
              `/kapis/versatel.kubesphere.io/v1alpha1/target/${data.name} `
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
            })
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
  'rb_task.edit': {
    on({ store, cluster, namespace, workspace, success, onLoadingComplete, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          console.log('data', data)
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .post(`/kapis/versatel.kubesphere.io/v1alpha1/storage`, data)
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
        },
        modal: EditModal,
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
  'rb_task.create': {
    on({ store, cluster, namespace, workspace, success, onLoadingComplete, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          let vipList = [data.vip1]
          if (data.vip2) vipList.push(data.vip2)
          data.vipList = vipList
          console.log("data",data)
          if (!data) {
            Modal.close(modal)
            return
          }
          request
            .post(`/kapis/versatel.kubesphere.io/v1alpha1/target`, data)
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
}
