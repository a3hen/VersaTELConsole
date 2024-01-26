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
import { Tooltip } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getDisplayName } from 'utils'
import { getSuitableValue, getValueByUnit } from 'utils/monitoring'
import { ICON_TYPES } from 'utils/constants'

import RemoteBackupStore2 from 'stores/remotebackup2'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new RemoteBackupStore2(),
  name: 'Remotebackup2',
  module: 'remotebackup2',
})
export default class Remotebackup1 extends React.Component {
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

  showAction = record => !record.isFedManaged

  get itemActions() {
    const { trigger, routing, store, tableProps } = this.props
    return [
      {
        key: 'delete',
        icon: 'trash',
        text: t('DELETE'),
        action: 'delete',
        show: true,
        onClick: item => {
          trigger('rb_auto.delete', {
            iSCSIMapping2Templates: toJS(store.iSCSIMapping2Templates.data),
            // success: getData,
            hostname_list: item?.hostName,
            resName: item?.resName,
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
    // let test_list = ['aaaaaa','bbbbbbbbbbbbbbbbbbbbbbbbbbbbbz','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    // ]
    return [
      {
        title: t('name'),
        dataIndex: 'hostName',
        width: '20%',
        render: hostName => hostName,
      },
      {
        title: t('backup_task'),
        dataIndex: 'hostName',
        width: '20%',
        render: hostName => hostName,
      },
      {
        title: t('cluster'),
        dataIndex: 'hostName',
        width: '20%',
        render: hostName => hostName,
      },
      {
        title: t('last_time'),
        dataIndex: 'hostName',
        width: '20%',
        render: hostName => hostName,
      },
      {
        title: t('next_time'),
        dataIndex: 'hostName',
        width: '20%',
        render: hostName => hostName,
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('rb_auto.create', {
      ...this.props.match.params,
      success: () => this.props.getData,
    })

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} module="namespaces">
        <Banner {...bannerProps} tabs={this.tabs} />
        <Table
          {...tableProps}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          rowSelection={undefined}
          searchType="name"
          hideSearch={true}
        />
      </ListPage>
    )
  }
}
