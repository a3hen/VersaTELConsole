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

import { get } from 'lodash'
import { action } from 'mobx'

import Base from 'stores/base'
import List from 'stores/base.list'

export default class LNodeStore extends Base {
  LNodeTemplates = new List()

  // getPath({ cluster, workspace, namespace, devops }) {
  //   let path = ''

  //   if (cluster) {
  //     path += `/klusters/${cluster}`
  //   }

  //   if (namespace) {
  //     return `${path}/namespaces/${namespace}`
  //   }

  //   if (devops) {
  //     return `${path}/devops/${devops}`
  //   }

  //   if (workspace) {
  //     return `/workspaces/${workspace}`
  //   }

  //   return path
  // }

  getResourceUrl = () => `/kapis/versatel.kubesphere.io/v1alpha1/versasdsnode`

  getListUrl = this.getResourceUrl

  constructor(module = 'linstornodes') {
    super(module)
  }

  @action
  async fetchList({
    cluster,
    workspace,
    namespace,
    devops,
    more,
    ...params
  } = {}) {
    this.list.isLoading = true

    // if (!params.sortBy && params.ascending === undefined) {
    //   params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    // }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }
    params.limit = params.limit || 10

    const result = await request.get(this.getResourceUrl(), {
      ...params,
    })

    // const result = {
    //   code: 0,
    //   count: 2,
    //   data: [
    //     {
    //       "addr": "10.203.1.158:3366 (PLAIN)",
    //       "name": "ubuntu",
    //       "nodeType": "COMBINED",
    //       "resourceNum": "0",
    //       "status": "ONLINE",
    //       "storagePoolNum": "2"
    //     },
    //     {
    //       "addr": "10.203.1.159:3366 (PLAIN)",
    //       "name": "ubuntu2",
    //       "nodeType": "COMBINED",
    //       "resourceNum": "0",
    //       "status": "OFFLINE",
    //       "storagePoolNum": "2"
    //     },
    //     {
    //       "addr": "10.203.1.159:3366 (PLAIN)",
    //       "name": "ubuntu3",
    //       "nodeType": "COMBINED",
    //       "resourceNum": "0",
    //       "status": "OFFLINE",
    //       "storagePoolNum": "1"
    //     },
    //   ],
    // }

    // const data = get(result, 'data', [])
    const data = get(result, 'data', []).map(this.mapper)

    // const data = result.authentication.map(item => ({
    //   cluster,
    //   workspace,
    //   ...this.mapper(item, devops ? 'devopslinstornodes' : this.module),
    // }))

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total:
        result.count ||
        result.totalItems ||
        result.total_count ||
        data.length ||
        0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  // @action
  // batchDelete(rowKeys, { cluster, workspace, namespace }) {
  //   if (rowKeys.some(name => this.checkIfIsPresetLNode(name))) {
  //     Notify.error(
  //       t('Error Tips'),
  //       `${t('Unable to delete preset linstornode')}: ${name}`
  //     )
  //     return
  //   }

  //   return this.submitting(
  //     Promise.all(
  //       rowKeys.map(rowKey =>
  //         request.delete(
  //           this.getDetailUrl({ name: rowKey, cluster, workspace, namespace })
  //         )
  //       )
  //     )
  //   )
  // }

  @action
  async fetchLNodeTemplates() {
    this.LNodeTemplates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/versasdsnode`
    )
    this.LNodeTemplates.update({
      data: get(result, 'data', []).map(this.mapper),
      // data: get(result, 'data', []),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }

  // @action
  // delete({ cluster, name, workspace, namespace }) {
  //   if (this.checkIfIsPresetLNode(name)) {
  //     Notify.error(
  //       t('Error Tips'),
  //       `${t('Unable to delete preset linstornode')}: ${name}`
  //     )

  //     return
  //   }

  //   return this.submitting(
  //     request.delete(this.getDetailUrl({ cluster, name, workspace, namespace }))
  //   )
  // }

  // checkIfIsPresetLNode(name) {
  //   if (this.module === 'linstornodes') {
  //     return (
  //       isEmpty(globals.config.presetLNodes) &&
  //       globals.config.presetLNodes.includes(name)
  //     )
  //   }

  //   return (
  //     isEmpty(globals.config.presetClusterLNodes) &&
  //     globals.config.presetClusterLNodes.includes(name)
  //   )
  // }
}
