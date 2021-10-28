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

import React from 'react'
import { isEmpty } from 'lodash'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { getDisplayName } from 'utils'
import { trigger } from 'utils/action'
import LResourceStore from 'stores/lresource'

import DetailPage from 'clusters/containers/Base/Detail'

import routes from './routes'

@inject('rootStore')
@observer
@trigger
export default class ResourceDetail extends React.Component {
  store = new LResourceStore()

  componentDidMount() {
    this.store.fetchList({ limit: -1 })
    this.fetchData()
  }

  get module() {
    return 'lresources'
  }

  get listUrl() {
    const { cluster } = this.props.match.params
    return `/clusters/${cluster}/resource`
  }

  fetchData = () => {
    const { params } = this.props.match
    this.store.fetchDetail(params)
  }

  getOperations = () => []

  getAttrs = () => {
    const { detail = {} } = this.store

    if (isEmpty(detail)) return null

    return [
      {
        name: t('Mirror Way'),
        value: detail.mirrorWay,
      },
      {
        name: t('Size'),
        value: detail.size,
      },
      {
        name: t('Device Name'),
        value: detail.deviceName,
      },
    ]
  }

  render() {
    const stores = { detailStore: this.store }

    if (!this.store.detail.name) {
      return <Loading className="ks-page-loading" />
    }
    // if (this.store.isLoading && !this.store.detail.name) {
    //   return <Loading className="ks-page-loading" />
    // }

    const sideProps = {
      module: this.module,
      name: getDisplayName(this.store.detail),
      desc: this.store.detail.description,
      operations: this.getOperations(),
      attrs: this.getAttrs(),
      icon: 'database',
      breadcrumbs: [
        {
          label: t('Resource'),
          url: this.listUrl,
        },
      ],
    }
    return <DetailPage stores={stores} routes={routes} {...sideProps} />
  }
}
