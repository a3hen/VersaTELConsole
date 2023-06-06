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
import PVResourceStore from 'stores/pvresource'
import { Avatar, Card } from 'components/Base'
import Table from 'components/Tables/Base'

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
    const {
      data,
      // filters,
      isLoading,
      page,
      limit,
      total,
    } = this.store.list
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
          data={data}
          columns={this.getColumns()}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.handleFetch}
          onCreate={this.showCreate}
          searchType="name"
          // rowKey='uniqueID'
          hideSearch
          silentLoading
        />
      </Card>
    )
  }
}
