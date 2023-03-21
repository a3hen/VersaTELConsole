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
// import { toJS } from 'mobx'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { ICON_TYPES } from 'utils/constants'
// import VStatus from 'clusters/components/VtelStatus'
import ResoueceBackupStore from 'stores/backup'

@withList({
  store: new ResoueceBackupStore(),
  module: 'resourcebackups', // 图标类型,utils/constants中定义
  authKey: 'resourcebackup',
  name: 'ResoueceBackup',
})
export default class ResourceBackup extends React.Component {
  componentDidMount() {
    this.fetchData()
    // this.interval = setInterval(() => {
    //   this.props.tableProps.tableActions.onFetch({ silent: true })
    // }, 5000)
  }

  // componentWillUnmount() {
  //   if (this.interval) {
  //     clearInterval(this.interval)
  //   }
  // }

  // showAction(record) {
  //   return false
  // }

  fetchData = () => {
    // this.store.fetchDetail(this.props.match.params)
    this.props.tableProps.tableActions.onFetch()
  }

  get itemActions() {
    // const { name, trigger, routing } = this.props
    const { trigger } = this.props
    return [
      {
        key: 'snapshot',
        icon: 'pen',
        text: t('Create snapshot'),
        action: 'create',
        // show: this.showAction,
        onClick: item =>
          trigger('resourcebackups.snapshot.create', {
            detail: item,
            type: 'snapshot',
            // success: routing.query,
            success: this.fetchData,
          }),
      },
      {
        key: 'image',
        icon: 'pen',
        text: t('Create image'),
        action: 'create',
        onClick: item =>
          trigger('resourcebackups.image.create', {
            detail: item,
            type: 'image',
            success: this.fetchData,
          }),
      },
      {
        key: 'snapshotrestore',
        icon: 'pen',
        text: t('Snapshot Restore'),
        action: 'create',
        onClick: item =>
          trigger('resourcebackups.snapshotrestore.create', {
            detail: item,
            type: 'snapshotRestore',
            success: this.fetchData,
          }),
      },
      {
        key: 'imagerestore',
        icon: 'pen',
        text: t('Image Restore'),
        action: 'create',
        onClick: item =>
          trigger('resourcebackups.imagerestore.create', {
            detail: item,
            type: 'imageRestore',
            success: this.fetchData,
          }),
      },
      // {
      //   key: 'delete',
      //   icon: 'trash',
      //   text: t('Delete'),
      //   action: 'delete',
      //   show: true,
      //   onClick: item =>
      //     trigger('resourcebackups.delete', {
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
      // onCreate: this.showCreate,
      selectActions: [],
    }
  }

  getColumns = () => {
    const { module } = this.props
    // const { getSortOrder, module } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        render: name => (
          <Avatar icon={ICON_TYPES[module]} title={name} noLink />
        ),
      },
      {
        title: t('Snapshot'),
        dataIndex: 'snapshot',
        isHideable: true,
        render: snapshot => snapshot,
      },
      {
        title: t('Snapshot Restore'),
        dataIndex: 'snapshotRestore',
        isHideable: true,
        render: snapshotRestore => snapshotRestore,
      },
      {
        title: t('Image'),
        dataIndex: 'image',
        isHideable: true,
        render: image => image,
      },
      {
        title: t('Image Restore'),
        dataIndex: 'imageRestore',
        isHideable: true,
        render: imageRestore => imageRestore,
      },
      {
        title: t('Time'),
        dataIndex: 'time',
        isHideable: true,
        render: time => time,
      },
    ]
  }

  // showCreate = () => {
  //   const { store, trigger, getData } = this.props
  //   return trigger('resourcebackups.create', {
  //     ResoueceBackupTemplates: toJS(store.ResoueceBackupTemplates.data),
  //     success: getData,
  //   })
  // }

  render() {
    const { bannerProps, tableProps } = this.props

    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} tabs={this.tabs} title={t('Backup')} />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="name"
          rowKey="uniqueID"
        />
      </ListPage>
    )
  }
}
