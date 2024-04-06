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
// import isEqual from 'react-fast-compare'

import { ICON_TYPES } from 'utils/constants'
import VStatus from 'clusters/components/VtelStatus'
import LResourceStore from 'stores/lresource'
import UserStore from 'stores/user'

@withList({
  store: new LResourceStore(),
  module: 'lresources', // 图标类型,utils/constants中定义
  authKey: 'lresource',
  name: 'LResource',
})
export default class LResource extends React.Component {
  state = {
    userPermissions: null, // 添加一个状态来保存用户权限信息
  }

  componentDidMount() {
    this.fetchData(true) // Pass true for the initial fetch
    this.interval = setInterval(() => this.fetchData(false), 5000) // Pass false for subsequent fetches
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

  showAction(record) {
    return record.name.indexOf('pvc-') === 0 || record.name === 'linstordb'
  }

  get itemActions() {
    const { name, trigger, routing, store } = this.props
    return [
      {
        // key: 'delete',
        // icon: 'trash',
        // text: t('Delete'),
        // action: 'delete',
        // show: true,
        // onClick: item =>
        // trigger('lresources.delete', {
        // LResourceTemplates: toJS(store.LResourceTemplates.data),
        // // success: getData,
        // })
        key: 'diskless',
        icon: 'pen',
        text: t('choose_diskless_node'),
        action: 'delete',
        show: true,
        onClick: item => {
          trigger('lresources.diskless', {
            LResourceTemplates: toJS(store.LResourceTemplates.data),
            // success: getData,
            name: item?.name,
          })
        },
      },
      {
        key: 'mirrorway',
        icon: 'pen',
        text: t('Choose mirrorway numbers'),
        action: 'delete',
        show: true,
        onClick: item => {
          trigger('lresources.mirrorway', {
            LResourceTemplates: toJS(store.LResourceTemplates.data),
            // success: getData,
            name: item?.name,
            mirrorWay: item?.mirrorWay,
          })
        },
      },
    ]
  }

  // get itemActions() {
  //   const { name, trigger, routing } = this.props
  //   return [
  //     {
  //       key: 'chose diskless node',
  //       icon: 'trash',
  //       text: t('chose diskless node'),
  //       action: 'chose diskless node',
  //       show: true,
  //       onClick: item =>
  //           trigger('chose diskles node', {}),
  //     },
  //   ]
  // }

  get tableActions() {
    const { tableProps, trigger, routing } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      getCheckboxProps: record => ({
        disabled: this.showAction(record),
        name: record.name,
      }),
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('DELETE'),
          action: 'delete',
          onClick: () =>
            trigger('lresources.batch.delete', {
              type: 'LResource',
              rowKey: 'name',
              success: routing.query,
            }),
        },
      ],
    }
  }

  getColumns = () => {
    const { module } = this.props
    const { cluster } = this.props.match.params
    return [
      {
        title: t('Resource'),
        dataIndex: 'name',
        width: '25%',
        render: name => (
          <Avatar
            icon={ICON_TYPES[module]}
            to={`/clusters/${cluster}/resource/${name}`}
            title={name}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        render: status => <VStatus name={status} />,
      },
      {
        title: t('Mirror Way'),
        dataIndex: 'mirrorWay',
        isHideable: true,
        render: mirrorWay => mirrorWay,
      },
      {
        title: t('Size'),
        dataIndex: 'size',
        isHideable: true,
        render: size => size,
      },
      {
        title: t('Device Name'),
        dataIndex: 'deviceName',
        isHideable: true,
        render: deviceName => deviceName,
      },
      // {
      //   title: t('Assigned_Node'),
      //   dataIndex: 'assignedNode',
      //   isHideable: true,
      //   render: assignedNode => assignedNode,
      // },
    ]
  }

  showCreate = () => {
    const { store, trigger, getData } = this.props
    return trigger('lresources.create', {
      LResourceTemplates: toJS(store.LResourceTemplates.data),
      success: getData,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    const error = tableProps.data[0]?.error
    const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)/
    const match = error?.match(ipPortRegex)
    const ipPort = match ? match[0] : ''
    console.log('userrrrr: ', globals.user.username)
    console.log("rols",globals.user.globalrole)
    console.log("globals.user",globals.user)
    console.log("state",this.state)
    console.log("props",this.props)

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
        <Banner {...bannerProps} tabs={this.tabs} title={t('Resource')} />
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
            placeholder={t('SEARCH_BY_LRESOURCE')}
          />
        )}
      </ListPage>
    )
  }
}