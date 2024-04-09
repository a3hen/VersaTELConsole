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
import { observer, inject } from 'mobx-react'

import { getDisplayName } from 'utils'
import DiskfulResourceStore from 'stores/diskfulresource'

import { Avatar, Card } from 'components/Base'
import Table from 'components/Tables/Base'
import VStatus from 'clusters/components/VtelStatus'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class DiskfulResource extends React.Component {
  constructor(props) {
    super(props)

    this.diskfulResourceStore =
      props.diskfulResourceStore || new DiskfulResourceStore()
  }

  get store() {
    return this.props.detailStore
  }

  get name() {
    return this.store.detail.name
  }

  componentDidMount() {
    this.handleFetch()
    this.interval = setInterval(() => {
      this.handleFetch({ page: this.store.list.page })
    }, 5000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  handleFetch = (params = {}) => {
    const { cluster, name } = this.store.detail

    if (params.keyword) {
      params.name = params.keyword
      delete params.keyword
    }

    this.diskfulResourceStore.fetchList({
      name,
      cluster,
      ...params,
    })
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '25%',
      render: (name, record) => (
        <Avatar icon="database" title={getDisplayName(record)} noLink />
      ),
    },
    {
      title: t('Conns'),
      dataIndex: 'conn',
      isHideable: true,
      render: (status, record) => {
        if (record.status === 'Unknow') {
          return <VStatus name='Unknow' />
        }
        return <VStatus name={status} />
      },
      // render: conn => <VStatus name={conn} />,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      render: status => <VStatus name={status} />,
    },
    {
      title: t('Usage'),
      dataIndex: 'usage',
      isHideable: true,
      render: usage => <VStatus name={usage} />,
    },
    {
      title: t('Node'),
      dataIndex: 'node',
      isHideable: true,
      render: node => node,
    },
    {
      title: t('Storagepool'),
      dataIndex: 'storagepool',
      isHideable: true,
      render: storagepool => storagepool,
    },
  ]

  render() {
    const {
      data,
      filters,
      isLoading,
      page,
      limit,
    } = this.diskfulResourceStore.list
    const displayData = data.filter(item => item.name === this.name)
    const total = displayData.length
    const pagination = { total, page, limit }

    return (
      <Card
        title={t('Display the message of Diskful Resource')}
        loading={false}
        empty={t('NOT_AVAILABLE', { resource: t('resource') })}
      >
        <Table
          className={styles.table}
          data={displayData}
          columns={this.getColumns()}
          keyword={filters.name}
          filters={filters}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.handleFetch}
          hideCustom
          hideHeader
          silentLoading
        />
      </Card>
    )
  }
}
