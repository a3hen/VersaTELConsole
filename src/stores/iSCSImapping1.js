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

export default class iSCSIMapping1Store extends Base {
  iSCSIMapping1Templates = new List()

  getiSCSIMapping1Url = () =>
    `/kapis/versatel.kubesphere.io/v1alpha1/thinresource`

  getListUrl = this.getiSCSIMapping1Url

  constructor(module = 'iSCSImapping1') {
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

    const result = await request.get(this.getiSCSIMapping1Url(), {
      ...params,
    })

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
    //       "size": "12 KB",
    //       "status": "Healthy"
    //     },
    //     {
    //       "deviceName": "/dev/drbd1000",
    //       "mirrorWay": "1",
    //       "disklessNode": ["ubuntu"],
    //       "diskfulNode": ["ubuntu1","ubuntu2"],
    //       "name": "res_c",
    //       "size": "12 KB",
    //       "status": "Unhealthy"
    //     },
    //     {
    //       "deviceName": "/dev/drbd1000",
    //       "mirrorWay": "1",
    //       "disklessNode": ["ubuntu"],
    //       "diskfulNode": ["ubuntu1","ubuntu2"],
    //       "name": "res_b",
    //       "size": "12 KB",
    //       "status": "Synching"
    //     },
    //   ],
    // }

    const data = get(result, 'data', [])

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
  async fetchLiSCSIMapping1Templates() {
    this.iSCSIMapping1Templates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/thinresource`
    )
    this.iSCSIMapping1Templates.update({
      data: get(result, 'data', []).map(this.mapper),
      // data: get(result, 'data', []),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true
    const result = await request.get(this.getiSCSIMapping1Url(), {
      name: params.name,
    })
    const filterData = get(result, 'data', [])
    const data = filterData.filter(item => item.name === params.name)
    const detail = { ...params, ...data[0], kind: 'iSCSIMapping1' }
    this.detail = detail
    this.isLoading = false
    return detail
  }
}
