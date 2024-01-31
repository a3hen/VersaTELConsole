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

import RemoteBackupStore1 from 'stores/remotebackup1'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new RemoteBackupStore1(),
  name: 'Remotebackup1',
  module: 'remotebackup1',
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
        // show: item => parseInt(item.storageNum) < 1,
        onClick: item => {
          trigger('rb_task.delete', {
            iSCSIMapping1Templates: toJS(store.iSCSIMapping1Templates.data),
            // success: getData,
            targetname: item?.name,
          })
        },
      },
      {
        key: 'edit',
        icon: 'pen',
        text: t('task_edit'),
        action: 'edit',
        // show: item => parseInt(item.storageNum) < 1,
        onClick: item => {
          trigger('rb_task.edit', {
            iSCSIMapping1Templates: toJS(store.iSCSIMapping1Templates.data),
            // success: getData,
            targetname: item?.name,
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
    // console.log("props",this.props)
    return [
      {
        title: t('name'),
        dataIndex: 'scheduleName',
        width: '20%',
        render: scheduleName => scheduleName,
      },
      {
        title: t('time_info'),
        dataIndex: 'incremental',
        width: '20%',
        render: incremental => incremental,
      },
      {
        title: t('local_snapshot'),
        dataIndex: 'keepLocal',
        width: '20%',
        render: keepLocal => keepLocal,
      },
      {
        title: t('remote_snapshot'),
        dataIndex: 'keepRemote',
        width: '20%',
        render: keepRemote => keepRemote,
      },
      {
        title: t('failed_t'),
        dataIndex: 'onFailure',
        width: '20%',
        render: onFailure => onFailure,
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('rb_task.create', {
      ...this.props.match.params,
      data: this.props.tableProps.data,
      success: () => this.props.getData,
    })

  render() {
    const { bannerProps, tableProps } = this.props
    console.log('backup1_props', this.props)
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
