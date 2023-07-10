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
// import {  isEmpty } from 'lodash'
import VtelBar from 'clusters/components/VtelBar'
import { Card } from 'components/Base'
// import { getSuitableUnit, getValueByUnit } from 'utils/monitoring'

import RawDevicelStore from 'stores/rawdevice'

@inject('detailStore')
@observer
export default class RawDevice extends React.Component {
  constructor(props) {
    super(props)
    this.rawdeviceStore = props.rawdeviceStore || new RawDevicelStore()
    this.handleFetch()
  }

  componentDidMount() {
    // this.interval = setInterval(() => {
    //   this.fetchRawDevices()
    // }, 5000)

    this.interval = setInterval(() => {
      this.handleFetch()
      this.dataDisplay
    }, 5000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  get store() {
    // return this.rawdeviceStore
    return this.props.detailStore
  }

  get name() {
    return this.store.detail.name
  }

  fetchRawDevices = (params = {}) => {
    const { cluster } = this.store.detail

    this.rawdeviceStore.fetchList({
      cluster,
      ...params,
    })
  }

  handleFetch = (params = {}) => {
    const { cluster } = this.store.detail

    this.rawdeviceStore.fetchList({
      cluster,
      ...params,
    })
  }

  render() {
    const { data } = this.rawdeviceStore.list

    const dataDisplay = data.filter(item => item.node === this.name)

    return (
      <Card
        title={t('Display the message of Raw Device')}
        loading={false}
        empty={t('NOT_AVAILABLE', { resource: t('Raw Device') })}
      >
        <VtelBar data={dataDisplay} xKey="name" barKey="size" unitY="KiB" />
      </Card>
    )
  }
}
