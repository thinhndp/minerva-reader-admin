export interface User {
  id: string,
  username: string,
  fullName: string,
  // email: string,
  // roles: Array<Role>,
  roles: Array<string>,
  // cPoint: number,
}

export interface UserInput {
  // cPoint: number,
  // roleIds: Array<string>,
  fullName: string,
  roles: Array<string>
}

// export interface Role {
//   id: string,
//   role: string,
// }