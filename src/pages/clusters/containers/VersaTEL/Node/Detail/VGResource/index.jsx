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
import VGResourceStore from 'stores/vgresource'
import { Avatar, Card } from 'components/Base'
import Table from 'components/Tables/List'

import styles from './index.scss'

@inject('detailStore')
@observer
@withList({
  store: new VGResourceStore(),
  module: 'vgresources', // 图标类型,utils/constants中定义
  authKey: 'vgresource',
  name: 'VGResource',
})
export default class VGResource extends React.Component {
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
    return record.lv === "false" ? false : true
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
          if (item.lv !== "false") {
            alert('此VG已有VG被创建，无法被删除。')
            return
          }

          trigger('vgresource.delete', {
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
      getCheckboxProps: record => {
        const newRecord = { ...record }
        if (newRecord.node !== this.detailStore.detail.name) {
          return {}
        }
        return {
          disabled: this.showAction(newRecord),
          vg: newRecord.vg,
        }
      },
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('DELETE'),
          action: 'delete',
          onClick: () =>
            trigger('vgresource.batch.delete', {
              type: 'VGResource',
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
    return trigger('vgresource.create', {
      title: t('Create VG resource'),
      node: name,
      VGResourceTemplates: toJS(this.store.VGResourceTemplates.data),
      success: getData,
    })
  }

  getColumns = () => [
    // {
    //   title: t('Node'),
    //   dataIndex: 'node',
    //   width: '25%',
    //   render: node => node,
    // },
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
    const { tableProps } = this.props
    const filteredData = data.filter(item => item.node === this.detailStore.detail.name)
    const filteredtotal = filteredData.length
    total = filteredtotal
    const pagination = { total, page, limit }

    return (
      <Card
        title={t('Display the message of VG Resource')}
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
          rowKey="vg"
          hideSearch
          silentLoading
        />
      </Card>
    )
  }
}
