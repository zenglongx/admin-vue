import layoutHeaderAside from '@/layout/header-aside'
import User from '@/pages/user'
import Role from '@/pages/role'
import Permission from '@/pages/permission'
import Menu from '@/pages/menu'
import Log from '@/pages/log'

const meta = { auth: true }

export default {
  path: '/um',
  name: 'um',
  meta,
  redirect: { name: 'um-user' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'user',
      name: `${pre}user`,
      component: User,
      meta: { ...meta, title: '用户管理' }
    },
    {
      path: 'role',
      name: `${pre}role`,
      component: Role,
      meta: {
        ...meta, title: '角色管理'
      }
    },
    {
      path: 'permission',
      name: `${pre}permission`,
      component: Permission,
      meta: {
        ...meta, title: '权限管理'
      }
    },
    {
      path: 'menu',
      name: `${pre}menu`,
      component: Menu,
      meta: {
        ...meta, title: '菜单管理'
      }
    },
    {
      path: 'log',
      name: `${pre}log`,
      component: Log,
      meta: {
        ...meta, title: '日志管理'
      }
    }
  ])('um-')
}
