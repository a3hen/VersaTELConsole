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
import withList, { ListPage } from 'components/HOCs/withList'
import { getDisplayName } from 'utils'
import PVResourceStore from 'stores/pvresource'
import { Avatar, Card } from 'components/Base'
import Table from 'components/Tables/List'

import styles from './index.scss'

@inject('detailStore')
@observer
@withList({
  store: new PVResourceStore(),
  module: 'pvresources', // 图标类型,utils/constants中定义
  authKey: 'pvresource',
  name: 'PVResource',
})
export default class PVResource extends React.Component {
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

  showAction(record) {
    return record.vg === "" ? false : true
  }

  get store() {
    return this.props.store
  }

  get detailStore() {
    return this.props.detailStore
  }

  get itemActions(){
    const { name, trigger, routing } = this.props
    return [
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: true,
        onClick: item => {
          if (item.vg !== "") {
            alert('此PV已有VG被创建，无法被删除。')
            return
          }

          trigger('pvresource.delete', {
            detail: item,
            type: t(name),
            success: routing.query,
          })
        },
      },
    ]
  }

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
            trigger('pvresource.batch.delete', {
              type: 'PVResource',
              rowKey: 'name',
              success: routing.query,
              nodename: this.detailStore.detail.name,
            }),
        },
      ],
    }
  }

  handleFetch = (params = {}) => {
    const { cluster, name } = this.detailStore.detail

    this.store.fetchList({
      node: name,
      cluster,
      ...params,
    })
  }

  showCreate = () => {
    const { trigger, getData } = this.props
    const { name } = this.detailStore.detail
    return trigger('pvresource.create', {
      title: t('Create PV resource'),
      node: name,
      PVResourceTemplates: toJS(this.store.PVResourceTemplates.data),
      success: getData,
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
      title: t('VG'),
      dataIndex: 'vg',
      isHideable: true,
      render: vg => vg,
    },
    {
      title: t('Size'),
      dataIndex: 'size',
      isHideable: true,
      render: size => size,
    },
  ]

  render() {
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
        title={t('Display the message of PV Resource')}
        loading={false}
        empty={t('NOT_AVAILABLE', { resource: t('resource') })}
      >
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          className={styles.table}
          data={filteredData}
          columns={this.getColumns()}
          itemActions={this.itemActions}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.handleFetch}
          onCreate={this.showCreate}
          searchType="name"
          rowKey="name"
          hideSearch
          silentLoading
        />
      </Card>
    )
  }
}
