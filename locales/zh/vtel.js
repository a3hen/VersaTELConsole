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

module.exports = {
  VersaSDS: '分布式存储管理',
  LINSTOR_NODES: 'VersaSDS 集群节点',
  LNODE: '节点',
  LNODE_DESC:
    '提供了当前 VersaSDS 集群下节点的运行状态，以及可以创建和删除 VersaSDS 节点',
  'Node Type': '节点类型',
  'LVM Type': 'LVM类型',
  'Storagepool Num': '存储池数量',
  'Resource Num': '资源数量',
  LNODE_CREATE_DESC: '创建 VersaSDS 集群节点',
  LNODE_EMPTY_DESC: '请创建一个节点',
  'Create VersaSDS Node': '创建 VersaSDS 集群节点',
  'Please input VersaSDS Node name': '请输入 VersaSDS 节点名称',
  VTEL_NAME_DESC:
    '仅支持字母、数字、中横线以及下划线，且以字母开头，长度必须大于2',
  NODE_NAME_DESC:
    '仅支持小写字母、数字以及中横线，且以小写字母开头和结束，长度必须大于2',
  SP_VOL_NAME_DESC: '请按照磁盘的具体进行填写，如 vg0, thinpool/thinlv0',
  resource: '存储资源',
  VersaTEL_DESCRIPTION:
    'CoSAN Manager 是青岛大学存储研究所设计开发的 VersaRACK 容器云平台的管理系统，它包含了对基于 Kubenetes 的容器平台的图形化管理、VersaSDS 并行存储系统管理、VersaRACK 系统硬件管理等多项功能，是一个统一的、模块化的管理平台。',
  'VersaSDS Node IP Address': '节点 IP 地址',
  'VersaSDS Node Type': '节点类型',
  'IP Address of VersaSDS Node': 'VersaSDS 节点的 IP 地址，须符合 IP 地址格式',
  'Type of VersaSDS Node': 'VersaSDS 节点的类型，请选择需要的节点类型',
  Modify: '修改',
  'Modify VersaSDS Node': '修改 VersaSDS 节点',
  Storagepool: '存储池',
  STORAGEPOOL_DESC:
    '提供了当前 VersaSDS 集群下存储池的状态，以及可以创建和删除存储池',
  STORAGEPOOL_EMPTY_DESC: '请创建一个存储池',
  Driver: '设备',
  'Pool Name': '资源池名',
  'Free Size': '剩余空间',
  'Total Size': '总空间',
  'Create Storagepool': '创建存储池',
  'Select VersaSDS Node': '选择 VersaSDS 节点',
  'Volume name': 'LVM设备名',
  LVM_VOLUME_NAME_DESC: '请选择LVM设备以用于存储池创建',
  'Select LVM Type': '选择LVM类型',
  LRESOURCE_DESC:
    '提供了当前 VersaSDS 集群下资源的状态，以及可以创建和删除资源',
  LRESOURCE_CREATE_DESC: '创建资源',
  'Mirror Way': '副本',
  'Device Name': '设备名称',
  LResource: '资源',
  'Node name exists': '节点名已存在',
  'Storagepool name exists': '存储池名已存在',
  'Resource name exists': '资源名已存在',
  'Create Resource': '创建资源',
  VTEL_SIZE_DESC: '请输入资源的大小，不加单位则默认单位为K',
  'Invalid size': '输入的资源大小格式不合法',
  'Please input Resource size': '请输入资源的大小',
  'Please input Resource name': '请输入资源名称',
  'Please input Storagepool name': '请输入存储池名称',
  'Please select VersaSDS Node': '请选择 VersaSDS 节点',
  LINSTOR_STORAGEPOOLS: '存储池',
  LRESOURCE_EMPTY_DESC: '请创建一个资源',
  'Select Storagepool': '选择存储池',
  'Please select Storagepool': '请选择存储池',
  'Select Storagepool to create diskful resource':
    '请选择创建的diskful资源所在的存储池',
  'Select VersaSDS Node to create diskless resource':
    '请选择创建的diskless资源所在的节点',
  'Created Failed, Reason:': '创建失败，原因：',
  'Deleted Failed, Reason:': '删除失败，原因：',
  'Diskful Resource': 'Diskful资源',
  'Diskless Resource': 'Diskless资源',
  'Diskful Resource Detail': 'Diskful资源详情',
  'Diskless Resource Detail': 'Diskless资源详情',
  'Display the message of Diskless Resource': '展示Diskless资源的信息',
  'Display the message of Diskful Resource': '展示Diskful资源的信息',
  'Search by node': '请输入节点名称进行查找',
  Status: '状态',
  Snapshots: '存储卷快照',
  LNode_LOW: 'VersaSDS 节点',
  Storagepool_LOW: '存储池',
  LResource_LOW: '资源',
  Name: '名称',
  'Invalid IP address': 'IP地址格式错误',
  Delete: '删除',
  存储池_LOW: '存储池',
  Conns: '连接状态',
  STORAGEPOOL: '存储池',
  LRESOURCE: '资源',
  SEARCH_BY_LNODE: '按节点搜索',
  SEARCH_BY_STORAGEPOOL: '按存储池搜索',
  SEARCH_BY_LRESOURCE: '按资源搜索',
  AUTOPLACE: '副本数',
  'INPUT THE NUMBER': '填写副本的数量',
  'INPUT THE STORAGEPOOL NAME THAT YOU USE': '填写使用的存储池名称',
  'Resource name cannot start with string "pvc-"': '资源名不能以"pvc-"开头',
  'Resource name cannot be "linstordb"': '资源名不能为"linstordb"',
  Size: '大小',
  'Please input Volume name': '请输入 LVM 设备卷的名称',
  'Please input the IP address': '请输入 IP 地址',
  DELETE_TIP_SUCCESSFUL: '删除操作已完成',
  DUPLICATE: '备份',
}
