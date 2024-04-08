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

export default class DiskfulResourceStore extends Base {
  DiskfulResourceTemplates = new List()

  getResourceUrl = (params = {}) => {
    const baseUrl = `/kapis/versatel.kubesphere.io/v1alpha1/versasdsresource/diskful`
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined) // 过滤掉值为undefined的参数
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  getListUrl = this.getResourceUrl

  constructor(module = 'diskfulresources') {
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
    //       "deviceName": "/dev/drbd1000",
    //       "mirrorWay": "1",
    //       "disklessNode": ["ubuntu"],
    //       "diskfulNode": ["ubuntu1","ubuntu2"],
    //       "name": "res_a",
    //       "node": "ubuntu",
    //       "storagepool": "pool_a",
    //       "size": "12 KB",
    //       "status": "UpToDate",
    //       "conns": "Connecting(hp225)",
    //       "usage": "Unused"
    //     },
    //     {
    //       "deviceName": "/dev/drbd1000",
    //       "mirrorWay": "1",
    //       "disklessNode": ["ubuntu"],
    //       "diskfulNode": ["ubuntu1","ubuntu2"],
    //       "name": "res_b",
    //       "node": "ubuntu2",
    //       "storagepool": "pool_b",
    //       "size": "12 KB",
    //       "status": "Diskless",
    //       "conns": "OK",
    //       "usage": "Inused"
    //     },
    //     {
    //       "deviceName": "/dev/drbd1000",
    //       "mirrorWay": "1",
    //       "disklessNode": ["ubuntu"],
    //       "diskfulNode": ["ubuntu1","ubuntu2"],
    //       "name": "res_c",
    //       "node": "ubuntu2",
    //       "storagepool": "pool_b",
    //       "size": "12 KB",
    //       "status": "SyncTarget(1.31%)",
    //       "conns": "Connecting(hp225)",
    //       "usage": "Unused"
    //     },
    //   ],
    // }

    // const allData = get(result, 'data', [])
    const allData = get(result, 'data', []).filter(item => !item.name.includes('pvc-'))
    const data = allData.map(item => {
      item.uniqueID = item.name.concat(' - ', item.node)
      return item
    })

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: data.length,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchDiskfulResourceTemplates() {
    this.DiskfulResourceTemplates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/versasdsresource/diskful`
    )
    const allData = get(result, 'data', [])
    const data = allData.map(item => {
      item.uniqueID = item.name.concat(' - ', item.node)
      return item
    })
    this.DiskfulResourceTemplates.update({
      // data: get(result, 'data', []).map(this.mapper),
      data: data.map(this.mapper),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }
}
