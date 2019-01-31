import request from '@/plugin/axios'

export function GetMenuTree () {
  return request({
    url: `/menu/tree`,
    method: 'get'
  })
}

export function GetMenuById (menuId) {
  return request({
    url: '/menu/detail/' + menuId,
    method: 'get'
  })
}

export function AddMenu (menu) {
  return request({
    url: '/menu/save',
    method: 'post',
    data: menu
  })
}

export function UpdateMenu (menu) {
  return request({
    url: '/menu/save',
    method: 'post',
    data: menu
  })
}

export function DeleteMenu (menuId) {
  return request({
    url: '/menu/delete/' + menuId,
    method: 'delete'
  })
}
