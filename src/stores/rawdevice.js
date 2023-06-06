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

export default class RawDeviceStore extends Base {
  RawDeviceTemplates = new List()

  getResourceUrl = () => `/kapis/versatel.kubesphere.io/v1alpha1/lvm/device`

  getListUrl = this.getResourceUrl

  constructor(module = 'rawdevices') {
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

    // if (params.limit === Infinity || params.limit === -1) {
    //   params.limit = -1
    //   params.page = 1
    // }
    // params.limit = params.limit || 10

    const result = await request.get(this.getResourceUrl(), {
      ...params,
    })

    // const result = {
    //   code: 0,
    //   count: 3,
    //   data: [
    //     {
    //       name: '/dev/sdc',
    //       node: 'ben1',
    //       size: '100000000000',
    //     },
    //     {
    //       name: '/dev/sdb1',
    //       node: 'ben2',
    //       size: '200000000',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //     {
    //       name: '/dev/sdd',
    //       node: 'ben2',
    //       size: '100000900',
    //     },
    //   ],
    // }

    const data = get(result, 'data', []).map(this.mapper)

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total:
        result.count ||
        result.totalItems ||
        result.total_count ||
        data.length ||
        0,
      ...params,
      // limit: Number(params.limit) || 10,
      // page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchRawDeviceTemplates() {
    this.RawDeviceTemplates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/lvm/device`
    )

    this.RawDeviceTemplates.update({
      data: get(result, 'data', []).map(this.mapper),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }
}
