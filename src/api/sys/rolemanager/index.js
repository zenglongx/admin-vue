import request from '@/plugin/axios'

export function GetRoleList (searchKey, pageNum) {
  return request({
    url: '/role/list?searchKey=' + (searchKey === undefined ? '' : searchKey) + '&pageNum=' +
      (pageNum === undefined ? '1' : pageNum),
    method: 'get'
  })
}

export function AddRole (role) {
  return request({
    url: '/role/save',
    method: 'post',
    data: role
  })
}

export function UpdateRole (role) {
  return request({
    url: '/role/save',
    method: 'post',
    data: role
  })
}

export function DeleteRole (roleId) {
  return request({
    url: '/role/delete/' + roleId,
    method: 'delete'
  })
}
