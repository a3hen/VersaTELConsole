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
import { toJS } from 'mobx'
import withList from 'components/HOCs/withList'
import { getDisplayName } from 'utils'
import RAWDeviceStore from 'stores/rawdevice'
import { Avatar, Card } from 'components/Base'
import Table from 'components/Tables/Base'
import { action } from 'mobx'
import styles from './index.scss'

@inject('detailStore')
@observer
@withList({
  store: new RAWDeviceStore(),
  module: 'rawdevice', // 图标类型,utils/constants中定义
  authKey: 'rawdevice',
  name: 'rawdevice',
})
export default class RawDevice extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

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

  get store() {
    return this.props.store
  }

  get detailStore() {
    return this.props.detailStore
  }

  get tableActions() {
    const { tableProps } = this.props
    // const { tableProps, trigger, routing } = this.props
    return {
      ...tableProps.tableActions,
      // onCreate: this.showCreate,
      // getCheckboxProps: record => ({
      //   disabled: this.showAction(record),
      //   name: record.name,
      // }),

      // selectActions: [
      //   // {
      //   //   key: 'delete',
      //   //   type: 'danger',
      //   //   text: t('DELETE'),
      //   //   action: 'delete',
      //   //   onClick: () =>
      //   //     trigger('lresources.batch.delete', {
      //   //       type: 'LResource',
      //   //       rowKey: 'name',
      //   //       success: routing.query,
      //   //     }),
      //   // },
      // ],
    }
  }

  handleFetch = (params = {}) => {
    const { cluster, name } = this.detailStore.detail
    const data_list = this.props.tableProps.data
    const new_data_list = []
    for (let i = 0, len = data_list.length; i < len; i++) {
      if (data_list[i].node === name) {
        new_data_list.push(data_list[i]);
      }
    }
    this.props.tableProps.data = new_data_list;
    this.store.list.data = new_data_list;

    this.store.fetchList({
      node: name,
      cluster,
      ...params,
    })

    this.forceUpdate();
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
      title: t('Size'),
      dataIndex: 'size',
      isHideable: true,
      render: size => size,
    },
  ]

  render() {
    // const data_list = this.store.list.data
    // const new_data_list = []
    // for (let i = 0, len = data_list.length; i < len; i++) {
    //   if (data_list[i].node === this.detailStore.detail.name) {
    //     new_data_list.push(data_list[i]);
    //   }
    // }
    // this.store.list.data = new_data_list;
    let {
      data,
      // filters,
      isLoading,
      page,
      limit,
      total,
    } = this.store.list
    const filteredData = data.filter(item => item.node === this.detailStore.detail.name)
    const filteredtotal = filteredData.length
    total = filteredtotal
    const pagination = { total, page, limit }
    const { tableProps } = this.props


    return (
      <Card
        title={t('Display the message of Raw Device')}
        loading={false}
        empty={t('NOT_AVAILABLE', { resource: t('resource') })}
      >
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          className={styles.table}
          data={filteredData}
          columns={this.getColumns()}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.handleFetch}
          searchType="name"
          // rowKey='uniqueID'
          hideSearch
          silentLoading
          key={this.store.list.data}
        />
      </Card>
    )
  }
}
