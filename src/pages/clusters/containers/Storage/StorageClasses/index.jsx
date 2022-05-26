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
import { get, includes } from 'lodash'

import { Notify } from '@kube-design/components'
import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getDisplayName } from 'utils'
import { ICON_TYPES } from 'utils/constants'

import StorageClassStore from 'stores/storageClass'

@withList({
  store: new StorageClassStore(),
  name: 'STORAGE_CLASS',
  module: 'storageclasses',
})
export default class StorageClasses extends React.Component {
  validateSelect({ callback }) {
    return (...args) => {
      const { selectedRowKeys, data } = this.list
      const dependent = data.some(
        storageClass =>
          includes(selectedRowKeys, storageClass.name) &&
          storageClass.associationPVCCount
      )

      return dependent ? this.notifyDeleteTips() : callback(...args)
    }
  }

  notifyDeleteTips() {
    Notify.error({ content: `${t('DEPENDENT_STORAGE_CLASS_DELETE_TIPS')}` })
  }

  showAction(record) {
    return record.associationPVCCount !== 0
  }

  getColumns = () => {
    const { getSortOrder, prefix } = this.props
    return [
      {
        title: t('NAME'),
        key: 'name',
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[this.module]}
            to={`${prefix}/${name}`}
            title={getDisplayName(record)}
            desc={record.description}
          />
        ),
      },
      {
        title: t('VOLUME_COUNT'),
        dataIndex: 'volumeCount',
        isHideable: true,
        render: (count, record) =>
          get(record, 'annotations["kubesphere.io/pvc-count"]') || 0,
      },
      {
        title: t('DEFAULT_STORAGE_CLASS'),
        dataIndex: 'default',
        isHideable: true,
        render: value => (value ? t('YES') : '-'),
      },
      {
        title: t('ALLOW_VOLUME_CLONE'),
        dataIndex: 'annotations',
        isHideable: true,
        render: annotations =>
          annotations['storageclass.kubesphere.io/allow-clone'] === 'true'
            ? t('TRUE')
            : t('FALSE'),
      },
      {
        title: t('ALLOW_VOLUME_SNAPSHOT'),
        dataIndex: '_originData',
        isHideable: true,
        render: _originData =>
          _originData.metadata.annotations[
            'storageclass.kubesphere.io/allow-snapshot'
          ] === 'true'
            ? t('TRUE')
            : t('FALSE'),
      },
      {
        title: t('ALLOW_VOLUME_EXPANSION'),
        dataIndex: 'allowVolumeExpansion',
        isHideable: true,
        render: allowVolumeExpansion =>
          allowVolumeExpansion ? t('TRUE') : t('FALSE'),
      },
      {
        title: t('PROVISIONER'),
        dataIndex: 'provisioner',
        isHideable: true,
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('storageclass.create', {
      name: 'Storage Class',
      module: this.props.module,
      cluster: this.props.match.params.cluster,
    })

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          getCheckboxProps={record => ({
            disabled: this.showAction(record),
            name: record.name,
          })}
        />
      </ListPage>
    )
  }
}
