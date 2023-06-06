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

import { getIndexRoute } from 'utils/router.config'

import RawDevice from './RawDevice'
import PVResource from './PVResource'
// import VGResource from './VGResource'
// import ThinLVResource from './ThinLVResource'

const PATH = '/clusters/:cluster/node/:name'

export default [
  {
    path: `${PATH}/device`,
    title: 'Raw Device',
    component: RawDevice,
    exact: true,
  },
  {
    path: `${PATH}/pv`,
    title: 'PV Resource',
    component: PVResource,
    exact: true,
  },
  // {
  //   path: `${PATH}/vg`,
  //   title: 'VG Resource',
  //   component: VGResource,
  //   exact: true,
  // },
  // {
  //   path: `${PATH}/thinlv`,
  //   title: 'ThinLV Resource',
  //   component: ThinLVResource,
  //   exact: true,
  // },
  getIndexRoute({ path: PATH, to: `${PATH}/device`, exact: true }),
  // getIndexRoute({ path: '*', to: '/404', exact: true }),
]
