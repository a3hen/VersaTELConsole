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
import VStatus from 'clusters/components/VtelStatus'

import { getDisplayName } from 'utils'
import { getSuitableValue, getValueByUnit } from 'utils/monitoring'
import { ICON_TYPES } from 'utils/constants'

import SSnapshotStore from 'stores/ssnapshot'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new SSnapshotStore(),
  name: 'SSnapshot',
  module: 'ssnapshot',
})
export default class SSnapshot extends React.Component {
  state = {
    items: [],
  }

  get tips() {
    return [
      {
        title: t('WHAT_IS_SNAPSHOT_ROLLBACK_Q'),
        description: t('WHAT_IS_SNAPSHOT_ROLLBACK_A'),
      },
      {
        title: t('WHAT_IS_SNAPSHOT_RECOVERY_Q'),
        description: t('WHAT_IS_SNAPSHOT_RECOVERY_A'),
      },
    ]
  }

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

  componentDidUpdate(prevProps) {
    if (prevProps.tableProps.data !== this.props.tableProps.data) {
      this.setState({ items: this.props.tableProps.data })
    }
  }

  // showAction = record => !record.isFedManaged
  showRollbackAction = record => {
    const sameResourceItems = this.state.items.filter(
      item => item.resource === record.resource
    )
    if (sameResourceItems.length === 0) {
      return false
    }
    const latestItem = sameResourceItems.reduce((latest, item) => {
      return new Date(item.time) > new Date(latest.time) ? item : latest
    }, sameResourceItems[0])
    return latestItem.name === record.name
  }

  get itemActions() {
    const { trigger, routing, store, tableProps } = this.props
    return [
      {
        key: 'snapshot_recovery',
        icon: 'pen',
        text: t('SNAPSHOT_RECOVERY'),
        action: 'edit',
        show: true,
        onClick: item => {
          // console.log("ssnapshot.item",item)
          trigger('snapshot.recovery', {
            SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
            // success: getData,
            oldres: item?.resource,
            snapshotname: item?.name,
          })
        },
      },
      {
        key: 'snapshot_rollback',
        icon: 'pen',
        text: t('SNAPSHOT_ROLLBACK'),
        action: 'edit',
        show: this.showRollbackAction,
        onClick: item => {
          // console.log(item)
          trigger('snapshot.rollback', {
            SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
            // success: getData,
            snapshotname: item?.name,
            resource: item?.resource,
          })
        },
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('DELETE'),
        action: 'delete',
        show: true,
        onClick: item => {
          // console.log(item)
          trigger('snapshot.delete', {
            SnapshotTemplatesTemplates: toJS(store.SnapshotTemplates.data),
            // success: getData,
            snapshotname: item?.name,
            resource: item?.resource,
          })
        },
      },
    ]
  }

  get tabs() {
    return {
      value: this.props.module,
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
        dataIndex: 'resource',
        width: '20%',
        render: resource => resource,
      },
      {
        title: t('SnapshotName'),
        dataIndex: 'name',
        width: '20%',
        render: name => name,
      },
      {
        title: t('Node'),
        dataIndex: 'node',
        width: '20%',
        render: node => node.replace(/\[|\]/g, '').replace(/\s+/g, ','),
      },
      {
        title: t('Time'),
        dataIndex: 'time',
        width: '20%',
        render: time => {
          const date = new Date(time)
          const formattedTime = `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
          return formattedTime
        },
      },
      {
        title: t('Status'),
        dataIndex: 'state',
        width: '20%',
        render: status => <VStatus name={status} />,
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
    const sortedData = this.props.tableProps.data.slice().sort((a, b) => {
      if (a.resource < b.resource) {
        return -1
      }
      if (a.resource > b.resource) {
        return 1
      }
      return 0
    }).sort((a, b) => {
      if (a.resource === b.resource) {
        if (a.time < b.time) {
          return 1
        }
        if (a.time > b.time) {
          return -1
        }
      }
      return 0
    })

    const LoadingComponent = () => (
      <div style={{ textAlign: 'center' }}>
        <strong style={{ fontSize: '20px' }}>Loading...</strong>
        <p>无法连接至controller ip：{ipPort}</p>
      </div>
    )

    const isLoading = tableProps.data.some(item => item.error)

    return (
      <ListPage {...this.props} module="namespaces">
        <Banner {...bannerProps} tips={this.tips} tabs={this.tabs} />
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
            data={sortedData}
            rowSelection={false}
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
