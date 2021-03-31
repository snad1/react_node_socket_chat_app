import React, {useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Container,LeftContainer,Tabs,Tab,UsersContainer,UserOnline,UserImage,UserDetails,RightContainer,
  TopNav,ChatContainer,Bottom,Input,SendButton,LogoutButton,Message,Login,BlockButton,UnBlockButton,TopLeft} from "./styles";
import io from "socket.io-client";
import config from "./config";
import {IUser, IMessage, IRoom, IBlockerUser} from "./interface";

let socket: SocketIOClient.Socket;

function App() {
  const { loginWithRedirect,logout,user,isAuthenticated,loginWithPopup } = useAuth0();
  const [desc,setDesc] = useState('')
  const [messages,setMessages] = useState<IMessage[]>([])
  const [currentUser, setCurrentUser] = useState<IUser|any>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IBlockerUser[]>([]);
  const [activeRoom,setActiveRoom] = useState('')
  const [activeUser,setActiveUser] = useState<IUser|any>(null);
  const [rooms,setRooms] = useState<IRoom[]>([])
  const [activeTab,setActiveTab] = useState('users')
  const [disappear,setDisappear] = useState(false)

  useEffect(()=>{
    if(isAuthenticated){

      setCurrentUser({...user} as IUser)

      socket = io(config.endpoint);

      socket.emit('join', { ...user});

      socket.on("allUsers", (allUsers:IUser[]) => {
        setAllUsers(allUsers);
      })

      socket.on("onlineUsers", (users:IUser[]) => {
        setUsers(users);
        if(activeUser && !users.includes(activeUser)){
          setActiveUser(null)
          setActiveRoom('')
        }
      })

      socket.on("blockedUsers", (users:IBlockerUser[]) => {
        setBlockedUsers(users)
      })

      socket.on("allRooms", (data:any) => {
        if(data.email === user.email){
          setRooms(data.docs);
        }
      })

      socket.on("addRoom", (room:IRoom) => {
        setRooms([...rooms,room]);
      })

      socket.on("allMessages", (data:any) => {
        if(data.email === user.email){
          setMessages(data.docs);
        }
      })

      socket.on('message', (message:IMessage) => {
        setMessages(messages => [ ...messages, message]);
      });



    }
    else {
      loginWithPopup()
    }
  },[isAuthenticated])

  useEffect(()=>{
    if(disappear){
      console.log(disappear)
    window.addEventListener("blur", handleBlur)
      if(isAuthenticated){
        window.addEventListener("focus", handleFocus)
      }
    }
    return ()=>{
      if(disappear){
        window.removeEventListener("blur", handleBlur)

        if(isAuthenticated){
          window.removeEventListener("focus", handleFocus)
        }
      }

    }
  },[disappear])

  const handleFocus = () =>{
    if (!socket.connected){
      socket.connect()
      socket.emit('join', { ...user});
    }
  }

  const handleBlur = () =>{
    socket.disconnect()
    console.log('blur addEventListener',disappear)
  }

  const startRoomChat = (user:IUser)=>{
    const ch = [String(currentUser.email+user.email),String(user.email+currentUser.email)]
    const getRoom = rooms.find((room:IRoom) => ch.includes(room.name));
    if(getRoom){
      setActiveRoom(getRoom.name)
    }
    else {
      socket.emit('saveRoom', {name:ch[0]});
      setActiveRoom(ch[0])
    }
    setActiveUser(user)
  }

  const sendMessage = () => {
    if(desc && activeRoom) {
      socket.emit('sendMessage', {desc,room:activeRoom,owner:currentUser?.email}, () => setDesc(''));
    }
  }

  const handleLogout = () => {
    socket.emit('logout', currentUser?.email,()=>logout({ returnTo: window.location.origin }));
  }

  const getUsersOnline = ()=>{
    const bUsers = [...blockedUsers.map(value =>value.email === user.email? value.by : value.by === user.email? value.email:null)]
    return users.filter(user=> user.email !== currentUser.email && !bUsers.includes(user.email))
  }

  const getBlockUsers = ()=>{
    const bUsers = [...blockedUsers.map(value => value.by === user.email? value.email:null)]
    return allUsers.filter(user=>  bUsers.includes(user.email))
  }

  const getMessages = ()=>{
    return messages.filter(message=> message.room === activeRoom)
  }

  const blockUser = () =>{
    socket.emit('blockUser', {email:activeUser?.email,by:currentUser?.email}, () => {
      setActiveRoom('')
      setActiveUser(null)
    });
  }

  const unBlockUser = (email:string) =>{
    socket.emit('unBlockUser', {email,by:currentUser?.email});
  }

  const handleTab = (tab:string) =>{
    setActiveTab(tab)
  }

  return (
    isAuthenticated ? (
    <Container>
      <LeftContainer>
        <TopLeft>
          <p>{currentUser?.name}</p>
          <div>
            <label htmlFor="disapper">Disappear when leaving window</label>
            <input type="checkbox" defaultChecked={disappear}
                   onChange={(e)=>setDisappear(e.target.checked)}
            />
          </div>
        </TopLeft>
        <Tabs>
          <Tab active={activeTab==='users'} onClick={()=>handleTab('users')}>Users Online</Tab>
          <Tab active={activeTab==='emails'} onClick={()=>handleTab('emails')}>Emails</Tab>
          <Tab active={activeTab==='blocked'} onClick={()=>handleTab('blocked')}>Blocked Users</Tab>
        </Tabs>
        {activeTab === 'users' &&
        <UsersContainer>
          {getUsersOnline().length > 0 ?getUsersOnline().map(value => <UserOnline active={value.email === activeUser?.email} key={value.email}
                                                     onClick={() => startRoomChat(value)}>
            <UserImage src={value.picture}/>
            <UserDetails>
              {value.name}
            </UserDetails>
          </UserOnline>): 'No users'}
        </UsersContainer>
        }
        {activeTab === 'emails' &&
        <UsersContainer>
          {allUsers.length > 0 ? allUsers.map(value => <UserOnline key={value.email}>
            <UserDetails>
              {value.email}
            </UserDetails>
          </UserOnline>): 'No Emails'}
        </UsersContainer>
        }
        {activeTab === 'blocked' &&
        <UsersContainer>
          {getBlockUsers().length > 0 ? getBlockUsers().map(value => <UserOnline key={value.email}>
            <UserDetails>
              {value.name} <UnBlockButton onClick={()=>unBlockUser(value.email)}>
              Block
            </UnBlockButton>
            </UserDetails>
          </UserOnline>): 'No blocked users'}
        </UsersContainer>
        }
      </LeftContainer>
      <RightContainer>
        <TopNav>
          {!!activeUser && <>
          {activeUser.name}
          <BlockButton onClick={blockUser}>
            Block
          </BlockButton>
          </>
          }
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </TopNav>
        {!!activeRoom && <>
          <ChatContainer>
            {getMessages().map((value:IMessage,index) => <Message right={value.owner===currentUser.email} key={index}>
              {value.desc}
            </Message>)}
          </ChatContainer>
          <Bottom>
            <Input value={desc} onChange={(e)=>setDesc(e.target.value)}/>
            <SendButton onClick={sendMessage}>Send</SendButton>
          </Bottom>
        </>}

      </RightContainer>
    </Container>):
      <Login>
        Loading...
        {/*<button onClick={() => loginWithRedirect()}>Log In</button>*/}
      </Login>
  );
}

export default App;
