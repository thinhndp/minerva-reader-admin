export interface User {
  id: string,
  username: string,
  email: string,
  roles: Array<Role>,
  cPoint: number,
}

export interface UserInput {
  cPoint: number,
  roleIds: Array<string>,
}

export interface Role {
  id: string,
  role: string,
}