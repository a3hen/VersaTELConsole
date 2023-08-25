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

export default class PVResourceStore extends Base {
  PVResourceTemplates = new List()

  getResourceUrl = () => `/kapis/versatel.kubesphere.io/v1alpha1/pv`

  getListUrl = this.getResourceUrl

  constructor(module = 'pvresources') {
    super(module)
  }

  @action
  async fetchList() {
    this.list.isLoading = true

    const result = await request.get(this.getResourceUrl())

    const allData = get(result, 'data', [])
    const data = allData.map(item => {
      item.uniqueID = item.name.concat(' - ', item.node)
      return item
    })

    this.list.update({
      data: data,
      total: result.count || result.totalItems || result.total_count || data.length || 0,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchPVResourceTemplates() {
    this.PVResourceTemplates.isLoading = true

    const result = await request.get(
      `/kapis/versatel.kubesphere.io/v1alpha1/linstor/resource/diskful`
    )
    const allData = get(result, 'data', [])
    const data = allData.map(item => {
      item.uniqueID = item.name.concat(' - ', item.node)
      return item
    })
    this.PVResourceTemplates.update({
      // data: get(result, 'data', []).map(this.mapper),
      data: data.map(this.mapper),
      total: result.count || result.totalItems || result.total_count || 0,
      isLoading: false,
    })
  }
}
