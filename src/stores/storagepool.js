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

export default class StoragepoolStore extends Base {
  StoragepoolTemplates = new List()

  getResourceUrl = (params = {}) => {
    const baseUrl = `/kapis/versatel.kubesphere.io/v1alpha1/versasdsstoragepool`
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined) // 过滤掉值为undefined的参数
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }


  getListUrl = this.getResourceUrl

  getDeleteUrl = (params = {}) =>
    `${this.getListUrl()}/${params.name}/${params.node}`

  constructor(module = 'storagepools') {
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
    const role = globals.user.globalrole
    if (!role) {
      console.log("Role is undefined or empty, skipping fetch.",role)
      return
    }
    console.log("mmmmrole",globals.user.globalrole)

    // if (!params.sortBy && params.ascending === undefined) {
    //   params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    // }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }
    params.limit = params.limit || 10

    const result = await request.get(this.getResourceUrl({ role: role === 'platform-admin' ? undefined : role, ...params }))

    // const result = {
    //   code: 0,
    //   count: 2,
    //   data: [
    //     {
    // "driver": "false",
    // "freeCapacity": "15 MB",
    // "name": "pool_a",
    // "node": "vince2",
    // "poolName": "vg0",
    // "resNum": "0",
    // "status": "OK",
    // "supportsSnapshots": "false",
    // "totalCapacity": "15 MB"
    //     },
    //     {
    //       // "driver": "false",
    // "freeCapacity": "15 MB",
    // "name": "pool_b",
    // "node": "vince2",
    // "poolName": "vg0",
    // "resNum": "0",
    // "status": "OK",
    // "supportsSnapshots": "false",
    // "totalCapacity": "15 MB"
    //     },
    //   ],
    // }

    // const allData = get(result, 'data', [])
    // const data = allData.map(item => {
    //   item.uniqueID = item.name.concat('-', item.node)
    //   return item
    // })
    const allData = get(result, 'data', [])
    let data
    if (allData === null) {
      data = []
    } else if (allData.length === 1 && 'error' in allData[0]) {
      data = get(result, 'data', []).map(this.mapper)
    } else {
      data = allData.map(item => {
        item.uniqueID = item.name.concat('-', item.node)
        return item
      })
    }
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

  @action
  async fetchStoragepoolTemplates() {
    this.StoragepoolTemplates.isLoading = true

    const role = globals.user.globalrole
    const params = role === 'platform-admin' ? {} : { role: role }
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    const url = `/kapis/versatel.kubesphere.io/v1alpha1/versasdsstoragepool${queryString ? `?${queryString}` : ''}`

    const result = await request.get(url)
    const allData = get(result, 'data', [])
    const data = allData.map(item => {
      item.uniqueID = item.name.concat('-', item.node)
      return item
    })
    this.StoragepoolTemplates.update({
      data: data.map(this.mapper),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }

  @action
  delete(params) {
    return this.submitting(request.delete(this.getDeleteUrl(params)))
  }
}
