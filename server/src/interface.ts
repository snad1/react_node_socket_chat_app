export interface IUser{
  id?: string
  name: string
  email: string
  picture: string
}

export interface IMessage{
  id?: string
  desc: string
  room: string
  owner: string
}

export interface IRoom{
  id?: string
  name: string
}

export interface IBlockerUser{
  id?:string
  email: string
  by: string
}