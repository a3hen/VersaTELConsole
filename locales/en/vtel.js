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
  VersaTEL_DESCRIPTION:
    'CoSAN Manager is the management system of CoSAN data security storage system. It includes VersaSDS parallel storage system management, VersaRACK system hardware management, graphical management of Kubernetes based container platform and other functions. ',
  LINSTOR_NODES: 'VersaSDS Node',
  LNODE: 'VersaSDS Node',
  LNode: 'VersaSDS Node',
  LNODE_DESC: 'Manages VersaSDS Nodes. You can create or delete Nodes here.',
  LNODE_CREATE_DESC: 'Create VersaSDS Node',
  LNODE_EMPTY_DESC: 'Please create a Node',
  VTEL_NAME_DESC:
    'Only letters, numbers, dash and underscores are supported. Begin with a letter. Length must be greater than 2',
  NODE_NAME_DESC:
    'Only lowercase letters, numbers, dash and underscores are supported. Begin and end with a lowercase letter. Length must be greater than 2',
  SP_VOL_NAME_DESC:
    'According to the specific of the disk to input, eg: vg0, thinpool/thinlv0',
  STORAGEPOOL_DESC:
    'Manages Storagepools. You can create or delete Storagepools here.',
  STORAGEPOOL_EMPTY_DESC: 'Please create a Storagepool',
  STORAGEPOOL: 'Storagepool',
  LVM_VOLUME_NAME_DESC: 'Please input a device name of type LVM',
  LRESOURCE_DESC:
    'Manages VersaSDS Resources. You can create or delete Resources here.',
  LRESOURCE_CREATE_DESC: 'Create Resource',
  VTEL_SIZE_DESC:
    'Please enter the size. If no unit is added, the default unit is K',
  LINSTOR_STORAGEPOOLS: 'Storagepool',
  LNode_LOW: 'VersaSDS Node',
  Storagepool_LOW: 'Storagepool',
  LResource_LOW: 'Resource',
  LRESOURCE: 'Resource',
  LRESOURCE_EMPTY_DESC: 'Please create a Resource',
  SEARCH_BY_LNODE: 'Search by Node',
  SEARCH_BY_STORAGEPOOL: 'Search by Storagepool',
  SEARCH_BY_LRESOURCE: 'Search by Resource',
  AUTOPLACE: 'Auto place',
  DELETE_TIP_SUCCESSFUL: 'Delete operation completed',
  DUPLICATE: 'Duplicate',
  WORKSPACE_AUDIT: 'Host Name',
  RESOURCE_NAME_AND_TYPE_AUDIT: 'Audit Object',
  EXPLAIN_AUDIT: 'Event Description',
  LEVEL_AUDIT: 'Event Level',
  SOURCE_IP_ADDRESS_AUDIT: 'Access Initiator',
  RESPONSE_STATUS_AUDIT: 'Audit Level',
  AUDIT_LOG_WORKSPACE_AUDIT_TIP: 'Enter a hostname to search for audit logs.',
  SEARCH_BY_WORKSPACE_AUDIT: 'Search by Hostname',
  RESOURCE_TYPE_AUDIT: 'Audit Object - Type',
  RESOURCE_NAME_AUDIT: 'Audit Object - Name',
  SEARCH_BY_RESOURCE_TYPE_AUDIT: 'Search by Audit Object - Type',
  AUDIT_LOG_RESOURCE_TYPE_AUDIT_TIP: 'Enter type of audit object to search for audit logs.',
  SEARCH_BY_RESOURCE_NAME_AUDIT: 'Search by Audit Object - Name',
  AUDIT_LOG_RESOURCE_NAME_AUDIT_TIP: 'Enter name of audit object to search for audit logs.',
  SEARCH_BY_RESPONSE_STATUS_AUDIT: 'Search by Audit Level',
  AUDIT_LOG_RESPONSE_STATUS_AUDIT_TIP: 'Enter audit level to search for audit logs.',
  LResource_PL: 'Resource',
  LNode_PL: 'VersaSDS Node',
  LVM_THIN_VOLUME_NAME_DESC: 'Please input a device name of type LVM THIN',
  THINLV_SIZE_DESC: 'The default unit is K. If you do not enter a size, all space of selected resource is used by default',
}
