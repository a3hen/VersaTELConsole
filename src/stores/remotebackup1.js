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
// import { LIST_DEFAULT_ORDER } from 'utils/constants'

export default class RemoteBackup1Store extends Base {
  RemoteBackup1Templates = new List()

  hasLoadedOnce = false // 新增状态标志，用于跟踪是否至少完成了一次数据加载

  getRemoteBackup1Url = () =>
    `/kapis/versatel.kubesphere.io/v1alpha1/schedule`

  getListUrl = this.getRemoteBackup1Url

  constructor(module = 'remotebackup1') {
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
    if (!this.hasLoadedOnce || !this.list.isLoading) {
      this.list.isLoading = true
    }

    // if (!params.sortBy && params.ascending === undefined) {
    //   params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    // }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }
    params.limit = params.limit || 10

    const result = await request.get(this.getRemoteBackup1Url(), {
      ...params,
    })

    // const data = get(result, 'data', [])
    const data = get(result, 'data', null)

    // 无论数据是否为null，只要完成了一次加载，就更新hasLoadedOnce状态
    this.hasLoadedOnce = true

    // 更新列表数据和加载状态
    this.list.update({
      data: more ? [...this.list.data, ...data] : data || [],
      total: data ? data.length : 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      // 只有在首次加载或数据非null时，才将isLoading设置为false
      isLoading: data !== null ? false : this.list.isLoading,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchLRemoteBackup1Templates() {
    this.RemoteBackup1Templates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/target`
    )
    this.RemoteBackup1Templates.update({
      data: get(result, 'data', []).map(this.mapper),
      // data: get(result, 'data', []),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true
    const result = await request.get(this.getRemoteBackup1Url(), {
      name: params.name,
    })
    const filterData = get(result, 'data', [])
    const data = filterData.filter(item => item.name === params.name)
    const detail = { ...params, ...data[0], kind: 'RemoteBackup1' }
    this.detail = detail
    this.isLoading = false
    return detail
  }
}
