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

import RemoteBackupStore from 'stores/remotebackup'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new RemoteBackupStore(),
  name: 'Remotebackup',
  module: 'remotebackup',
})
export default class Remotebackup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      info: "本地集群id为：",
      clusterinfo: {},
    }
  }

  componentDidMount() {
    this.fetchData(true) // Pass true for the initial fetch
    this.interval = setInterval(() => this.fetchData(false), 5000) // Pass false for subsequent fetches
    fetch(`/kapis/versatel.kubesphere.io/v1alpha1/clusterid`)
      .then(response => response.json())
      .then(data => this.setState({ clusterinfo: data }))
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchData = silent_flag => {
    this.props.tableProps.tableActions.onFetch({
      silent: true,
      silent_flag: silent_flag,
    })
  }

  showAction = record => !record.isFedManaged

  get tips() {
    const clusterIds = this.state.clusterinfo && this.state.clusterinfo.data
      ? this.state.clusterinfo.data.map(item => item.clusterid)
      : []

    return [
      {
        title: t('WHAT_IS_REMOTE_CLUSTER_ID_Q'),
        description: `${this.state.info}\n${clusterIds.join('\n')}`,
      },
    ]
  }

  get itemActions() {
    const { trigger, routing, store, tableProps } = this.props
    return [
      {
        key: 'delete',
        icon: 'trash',
        text: t('DELETE'),
        action: 'delete',
        show: this.showAction,
        onClick: item => {
          trigger('rb_cluster.delete', {
            RemoteBackupTemplates: toJS(store.RemoteBackupTemplates.data),
            // success: getData,
            remotename: item?.remoteName,
          })
        },
      },
      {
        key: 'manualbackup',
        icon: 'pen',
        text: t('manualbackup'),
        action: 'edit',
        show: this.showAction,
        onClick: item => {
          trigger('rb_cluster.mbackup', {
            RemoteBackupTemplates: toJS(store.RemoteBackupTemplates.data),
            // success: getData,
            remotename: item?.remoteName,
          })
        },
      },
    ]
  }

  get tabs() {
    return {
      value: this.props.module,
      // value: this.type || 'snapshot',
      onChange: this.handleTabChange,
      options: [
        {
          value: 'remotebackup',
          label: t('r_cluster'),
        },
        {
          value: 'remotebackup1',
          label: t('r_task'),
        },
        {
          value: 'remotebackup2',
          label: t('r_auto'),
        },
      ],
    }
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      onFetch: this.handleFetch,
      selectActions: [],
      createText: '创建',
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
        title: t('name'),
        dataIndex: 'remoteName',
        width: '50%',
        render: remoteName => (
          <Avatar icon={'cluster'} title={remoteName} noLink />
        ),
      },
      {
        title: t('URL'),
        dataIndex: 'url',
        width: '50%',
        render: url => url,
      },
    ]
  }

  showCreate = () => {
    this.props.trigger('rb_cluster.create', {
      ...this.props.match.params,
      data: this.props.tableProps.data,
      success: () => this.props.getData,
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
      <ListPage {...this.props} module="namespaces">
        <Banner {...bannerProps} tabs={this.tabs} stips={this.tips} />
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
            searchType="remoteName"
            placeholder={t('按集群搜索')}
            hideSearch={false}
          />
        )}
      </ListPage>
    )
  }
}
