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
import { toJS } from 'mobx'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { ICON_TYPES } from 'utils/constants'
import VStatus from 'clusters/components/VtelStatus'
import StoragepoolStore from 'stores/storagepool'

@withList({
  store: new StoragepoolStore(),
  module: 'storagepools', // 图标类型,utils/constants中定义
  authKey: 'storagepool',
  name: 'Storagepool',
})
export default class Storagepool extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.tableProps.tableActions.onFetch({ silent: true })
    }, 5000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  get itemActions() {
    const { name, trigger, routing } = this.props
    return [
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: true,
        onClick: item => {
          if (item.resNum >= 1) {
            alert('此存储池已有资源存在，无法被删除。')
            return
          }
          trigger('storagepools.delete', {
            detail: item,
            type: t(name),
            success: routing.query,
          })
        },
      },
    ]
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      // getCheckboxProps: record => {
      //   console.log("record",record)
      //   return {
      //     disabled: this.showAction(record),
      //   }
      // },
      selectActions: [],
    }
  }

  getColumns = () => {
    const { module } = this.props
    // const { getSortOrder, module } = this.props
    return [
      {
        title: t('Storagepool'),
        dataIndex: 'name',
        render: name => (
          <Avatar icon={ICON_TYPES[module]} title={name} noLink />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        render: (status, record) => {
          if (record.freeCapacity === '0.00 KiB') {
            return <VStatus name="warning1" />
          }
          return <VStatus name={status} />
        },
      },
      {
        title: t('Node'),
        dataIndex: 'node',
        isHideable: true,
        render: node => node,
      },
      {
        title: t('Resource Num'),
        dataIndex: 'resNum',
        isHideable: true,
        render: resNum => resNum,
      },
      {
        title: t('Driver'),
        dataIndex: 'driver',
        isHideable: true,
        render: driver => driver,
      },
      {
        title: t('Pool Name'),
        dataIndex: 'poolName',
        isHideable: true,
        render: poolName => poolName,
      },
      {
        title: t('Free Size'),
        dataIndex: 'freeCapacity',
        isHideable: true,
        render: freeCapacity => freeCapacity,
      },
      {
        title: t('Total Size'),
        dataIndex: 'totalCapacity',
        isHideable: true,
        render: totalCapacity => totalCapacity,
      },
      {
        title: t('Snapshots'),
        dataIndex: 'supportsSnapshots',
        isHideable: true,
        render: supportsSnapshots => supportsSnapshots,
      },
    ]
  }

  showCreate = () => {
    const { store, trigger, getData } = this.props
    return trigger('storagepools.create', {
      StoragepoolTemplates: toJS(store.StoragepoolTemplates.data),
      success: getData,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    const error = tableProps.data[0]?.error
    const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)/
    const match = error?.match(ipPortRegex)
    const ipPort = match ? match[0] : ''

    const LoadingComponent = () => (
      <div style={{ textAlign: 'center' }}>
        <strong style={{ fontSize: '20px' }}>Loading...</strong>
        <p>无法连接至controller ip：{ipPort}</p>
      </div>
    )

    // 检查store中的数据是否包含error属性
    const isLoading = tableProps.data.some(item => item.error)

    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} tabs={this.tabs} title={t('Storagepool')} />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoadingComponent />
          </div>
        ) : (
          <Table
            {...tableProps}
            tableActions={this.tableActions}
            itemActions={this.itemActions}
            columns={this.getColumns()}
            searchType="name"
            placeholder={t('SEARCH_BY_STORAGEPOOL')}
            // hideSearch
            rowKey="uniqueID"
          />
        )}
      </ListPage>
    )
  }
}
