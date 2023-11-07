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

import iSCSIMapping2Store from 'stores/iSCSImapping2'

// import ProjectStore from 'stores/project'
// import ProjectMonitorStore from 'stores/monitoring/project'

// const MetricTypes = {
//   cpu: 'namespace_cpu_usage',
//   memory: 'namespace_memory_usage_wo_cache',
//   pod: 'namespace_pod_count',
// }

@withList({
  store: new iSCSIMapping2Store(),
  name: 'iSCSIMapping2',
  module: 'iSCSImapping2',
})
export default class iSCSIMapping2 extends React.Component {
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
      // {
      //   key: 'delete',
      //   icon: 'trash',
      //   text: t('DELETE'),
      //   action: 'delete',
      //   show: true,
      //   onClick: item => {
      //     trigger('mapping.delete2', {
      //       iSCSIMapping2Templates: toJS(store.iSCSIMapping2Templates.data),
      //       // success: getData,
      //       hostName: item?.hostName,
      //     })
      //   },
      // },
      {
        key: 'map',
        icon: 'pen',
        text: t('MAPPING'),
        action: 'edit',
        show: true,
        onClick: item => {
          trigger('mapping.map', {
            iSCSIMapping2Templates: toJS(store.iSCSIMapping2Templates.data),
            // success: getData,
            resname: item?.resName,
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
          value: 'iSCSImapping',
          label: t('INITIATOR'),
        },
        {
          value: 'iSCSImapping1',
          label: t('iSCSITARGET'),
        },
        {
          value: 'iSCSImapping2',
          label: t('MAPPING'),
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
    // let test_list = ['aaaaaa','bbbbbbbbbbbbbbbbbbbbbbbbbbbbbz','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    //   'aaaaaa','bbbbbbbb','ccccc','dddddd',
    // ]
    return [
      {
        title: t('Storage'),
        dataIndex: 'resName',
        width: '50%',
        render: resName => resName,
      },
      {
        title: t('Host'),
        dataIndex: 'hostNum',
        width: '50%',
        render: (hostNum, record) => {
          const hostName = record.hostName
          return (
            <Tooltip content={
              <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {Array.isArray(hostName) ? hostName.map((item, index) => (
                  <p key={index}>{item}</p>
                )) : <p>data error</p>}
              </div>
            }>
              <a>{hostNum}</a>
            </Tooltip>
          );
        },
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('target.registered', {
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
