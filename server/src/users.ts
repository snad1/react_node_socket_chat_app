import {IBlockerUser, IUser} from "./interface";

export const users: IUser[] = []
export const allUsers: IUser[] = []
export const blockedUsers: IBlockerUser[] = []

export const addUser = (iUser:IUser)=>{
  const existingUser = users.find((user) => user.email === iUser.email);

  if(existingUser) return false;

  users.push(iUser);

  return true;
}

export const removeUser = (id:string) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

export const addAllUser = (user:IUser) => {
  allUsers.push(user)
}

export const addBlockedUser = (user:IBlockerUser) => {
  blockedUsers.push(user)
}

export const unBlockUser = (user:IBlockerUser) => {
  const index = blockedUsers.findIndex(value => (value.email === user.email && value.by === user.by ));
  if(index !== -1) return blockedUsers.splice(index, 1)[0];
}

// export const getUser = (email:string) => users.find((user) => user.email === email);
