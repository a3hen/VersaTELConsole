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

import { get, isEqual } from 'lodash'
import { action, toJS } from 'mobx'

import Base from 'stores/base'
import List from 'stores/base.list'
// import { LIST_DEFAULT_ORDER } from 'utils/constants'

export default class SnapshotStore extends Base {
  SnapshotTemplates = new List()

  getResourceUrl = (params = {}) => {
    const baseUrl = `/kapis/versatel.kubesphere.io/v1alpha1/snapshot`
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined) // 过滤掉值为undefined的参数
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  getListUrl = this.getSnapshotUrl

  constructor(module = 'snapshot') {
    super(module)
  }

  @action
  async fetchList({
    cluster,
    workspace,
    namespace,
    devops,
    more,
    silent_flag,
    silent,
    ...params
  } = {}) {
    const role = globals.user.globalrole
    if (!role) {
      console.log("Role is undefined or empty, skipping fetch.",role)
      return
    }
    if (silent_flag === true) {
      this.list.isLoading = true
    } else {
      this.list.isLoading = false
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

    const rawData = get(result, 'data', [])
    let data

    if (rawData === null) {
      data = []
    } else if (rawData.length === 1 && 'error' in rawData[0]) {
      data = rawData.map(this.mapper)
    } else {
      data = rawData.length > 0 ? rawData : null
    }

    // 使用isEqual来比较新旧数据
    if (!isEqual(toJS(this.list.data), data)) {
      this.list.update({
        data: more ? [...this.list.data, ...data] : data,
        total: result.count || result.totalItems || result.total_count || data.length || 0,
        ...params,
        limit: Number(params.limit) || 10,
        page: Number(params.page) || 1,
        isLoading: false, // 数据有变化时，更新isLoading状态
        ...(this.list.silent ? {} : { selectedRowKeys: [] }),
      })
    } else if (silent_flag === true) {
      this.list.isLoading = false
    } else {
      // 如果数据没有变化，且不是静默加载，不更新isLoading状态
    }
  }

  @action
  async fetchLSnapshotTemplates() {
    this.SnapshotTemplates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/snapshot`
    )
    this.SnapshotTemplates.update({
      data: get(result, 'data', []).map(this.mapper),
      // data: get(result, 'data', []),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true
    const result = await request.get(this.getSnapshotUrl(), {
      name: params.name,
    })
    const filterData = get(result, 'data', [])
    const data = filterData.filter(item => item.name === params.name)
    const detail = { ...params, ...data[0], kind: 'Snapshot' }
    this.detail = detail
    this.isLoading = false
    return detail
  }
}
