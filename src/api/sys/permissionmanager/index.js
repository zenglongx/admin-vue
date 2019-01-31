import request from '@/plugin/axios'

export function GetPermissionList (searchKey, pageNum) {
  return request({
    url: `/permission/list?searchKey=${searchKey}&pageNum=${pageNum}`,
    method: 'get'
  })
}

export function GetAllPermission () {
  return request({
    url: '/permission/all',
    method: 'get'
  })
}

export function GetPermissionsByRoleId (roleId) {
  return request({
    url: '/getRolePermission',
    method: 'post',
    data: { roleId: roleId }
  })
}

export function SavePermissionRole (permissionRole) {
  return request({
    url: '/setRolePermission',
    method: 'post',
    data: permissionRole
  })
}

export function AddPermission (permission) {
  return request({
    url: '/permission/save',
    method: 'post',
    data: permission
  })
}

export function UpdatePermission (permission) {
  return request({
    url: '/permission/save',
    method: 'post',
    data: permission
  })
}

export function DeletePermission (permissionId) {
  return request({
    url: '/permission/delete/' + permissionId,
    method: 'delete'
  })
}
