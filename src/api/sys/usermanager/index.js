import request from '@/plugin/axios'

export function GetUserList (searchKey, pageNum) {
  return request({
    url: `/user/list?searchKey=${searchKey}&pageNum=${pageNum}`,
    method: 'get'
  })
}

export function GetAllUser () {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

export function GetUserByRoleId (roleId) {
  return request({
    url: '/user/queryByRoleId?roleId=' + roleId,
    method: 'get'
  })
}

export function AddUser (user) {
  return request({
    url: '/user/save',
    method: 'post',
    data: user
  })
}

export function UpdateUser (user) {
  return request({
    url: '/user/save',
    method: 'post',
    data: user
  })
}

export function SaveUserRole (userRoles) {
  return request({
    url: '/user/updateUserRole',
    method: 'post',
    data: userRoles
  })
}

export function DeleteUser (userId) {
  return request({
    url: '/user/delete/' + userId,
    method: 'delete'
  })
}
