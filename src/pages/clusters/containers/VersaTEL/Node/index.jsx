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

import { ICON_TYPES } from 'utils/constants'
import VStatus from 'clusters/components/VtelStatus'
import LNodeStore from 'stores/linstornode'
// import styles from './index.scss'

@withList({
  store: new LNodeStore(),
  module: 'linstornodes', // 图标类型,utils/constants中定义
  authKey: 'linstornode',
  name: 'LNode',
})
export default class Node extends React.Component {
  componentDidMount() {
    this.props.store.fetchLNodeTemplates()
    this.interval = setInterval(() => {
      this.props.tableProps.tableActions.onFetch({ silent: true })
    }, 5000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  showAction(record) {
    return record.resourceNum !== '0'
  }

  get itemActions() {
    const { trigger, store, module, routing } = this.props
    return [
      {
        key: 'editLNode',
        icon: 'pen',
        text: t('Modify'),
        action: 'edit',
        show: true,
        // show: this.showAction,
        onClick: item =>
          trigger('linstornodes.edit', {
            module,
            detail: item,
            LNodeTemplates: toJS(store.LNodeTemplates.data),
            success: routing.query,
          }),
      },
      // {
      //   key: 'delete',
      //   icon: 'trash',
      //   text: t('Delete'),
      //   action: 'delete',
      //   show: this.showAction,
      //   onClick: item =>
      //     trigger('linstornodes.delete', {
      //       detail: item,
      //       type: t(name),
      //       success: routing.query,
      //     }),
      // },
    ]
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      getCheckboxProps: record => ({
        disabled: this.showAction(record),
        name: record.name,
      }),
      // selectActions: [],
    }
  }

  getColumns = () => {
    const { module } = this.props
    // const { getSortOrder, module } = this.props
    return [
      {
        title: t('Node'),
        dataIndex: 'name',
        // width: '20%',
        render: name => (
          <Avatar icon={ICON_TYPES[module]} noLink title={name} />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        // width: '20%',
        render: name => <VStatus name={name} />,
      },
      {
        title: t('Node Type'),
        dataIndex: 'nodeType',
        isHideable: true,
        // width: '10%',
        render: name => name,
      },
      {
        title: t('Address'),
        dataIndex: 'addr',
        isHideable: true,
        // width: '10%',
        render: name => name,
      },
      {
        title: t('Storagepool Num'),
        dataIndex: 'storagePoolNum',
        // sorter: true,
        // sortOrder: getSortOrder('spnum'),
        isHideable: true,
        // width: '20%',
        render: name => name,
      },
      {
        title: t('Resource Num'),
        dataIndex: 'resourceNum',
        // sorter: true,
        // sortOrder: getSortOrder('rnum'),
        isHideable: true,
        // width: '20%',
        render: name => name,
      },
    ]
  }

  showCreate = () => {
    const { store, trigger, getData } = this.props
    return trigger('linstornodes.create', {
      // title: t('Create VersaSDS Node'),
      LNodeTemplates: toJS(store.LNodeTemplates.data),
      success: getData,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} tabs={this.tabs} title={t('LINSTOR_NODES')} />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="name"
          placeholder={t('SEARCH_BY_LNODE')}
        />
      </ListPage>
    )
  }
}
