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
import { get, omit } from 'lodash'

import { Avatar, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getDisplayName } from 'utils'
import { getSuitableValue, getValueByUnit } from 'utils/monitoring'
import { ICON_TYPES } from 'utils/constants'

import SnapshotStore from 'stores/snapshot'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new SnapshotStore(),
  name: 'Snapshot',
  module: 'snapshot',
})
export default class Snapshot extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.tableProps.tableActions.onFetch({ silent: true })
    }, 2000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  showAction = record => !record.isFedManaged

  get itemActions() {
    const { trigger, routing, store, tableProps } = this.props
    return [
      {
        key: 'create_snapshot',
        icon: 'pen',
        text: t('CREATE_SNAPSHOT'),
        action: 'edit',
        show: this.showAction,
        onClick: item => {
          // console.log(item)
          trigger('snapshot.create', {
            SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
            // success: getData,
            resourcename: item?.name,
          })
        },
      },
      // {
      //   key: 'create_scheduled_snapshot',
      //   icon: 'pen',
      //   text: t('CREATE_SHEDULED_SNAPSHOT'),
      //   action: 'manage',
      //   show: record => !record.workspace && this.showAction(record),
      //   onClick: item => {
      //     // console.log(item)
      //     trigger('snapshot_scheduled.create', {
      //       SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
      //       // success: getData,
      //       resourcename: item?.name,
      //     })
      //   },
      // },
      // {
      //   key: 'delete',
      //   icon: 'trash',
      //   text: t('DELETE'),
      //   action: 'delete',
      //   show: record => !record.workspace && this.showAction(record),
      //   onClick: item => {
      //     // console.log(item)
      //     trigger('snapshot_resource.delete', {
      //       SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
      //       // success: getData,
      //       resourcename: item?.name,
      //     })
      //   },
      // },
    ]
  }

  get tabs() {
    return {
      value: this.props.module,
      // value: this.type || 'snapshot',
      onChange: this.handleTabChange,
      options: [
        {
          value: 'snapshot',
          label: t('SNAPSHOT_RESOURCE'),
        },
        {
          value: 'ssnapshot',
          label: t('SNAPSHOT_SNAPSHOT'),
        },
      ],
    }
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onFetch: this.handleFetch,
      selectActions: [],
    }
  }

  handleFetch = (params, refresh) => {
    const { routing } = this.props
    routing.query({ ...params, type: this.type }, refresh)
  }

  handleTabChange = type => {
    const { cluster } = this.props.match.params
    this.props.routing.push(`/clusters/${cluster}/${type}`)
  }

  getColumns = () => {
    const { module } = this.props
    return [
      {
        title: t('Resource'),
        dataIndex: 'name',
        width: '50%',
        render: name => name,
      },
      {
        title: t('Snapshot_Numbers'),
        dataIndex: 'numbers',
        width: '50%',
        render: numbers => numbers,
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('snapshot.create', {
      ...this.props.match.params,
      success: () => this.props.getData,
    })

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

    const isLoading = tableProps.data.some(item => item.error)

    return (
      <ListPage {...this.props} module="namespaces">
        <Banner {...bannerProps} tabs={this.tabs} />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoadingComponent />
          </div>
        ) : (
          <Table
            {...tableProps}
            itemActions={this.itemActions}
            tableActions={this.tableActions}
            columns={this.getColumns()}
            rowSelection={undefined}
            // onCreate={this.type === 'snapshot' ? null : this.showCreate}
            // isLoading={tableProps.isLoading || isLoadingMonitor}
            searchType="name"
            hideSearch={true}
          />
        )}
      </ListPage>
    )
  }
}
