import styled from 'styled-components';

interface Props {
  active?: boolean;
  right?: boolean;
}

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ecebeb;
  display: flex;
  flex-direction: row;
`

export const LeftContainer = styled.div`
  width: 35vw;
  max-height: 100vh;
  background-color: #eeeeee;
  border-right: 1px solid gray;
`

export const RightContainer = styled.div`
  width: 65vw;
  max-height: 100vh;
  background-color: #eae7e7;
  display: flex;
  flex-direction: column;
`

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-bottom: 1px solid gray;
  padding: 5px;
`;

export const Tab = styled.div<Props>`
  margin-top: 10px;
  padding: 11px 0 15px;
  text-align: center;
  width: 100%;
  font-weight: bold;
  font-size: 15px;

  outline: 0;
  cursor: pointer;

  color: ${(props) => (props.active ? 'blue' : 'black')};

  &:hover {
    background: #cfcfcf;
  }
`;

export const UsersContainer = styled.ul`
  padding: 5px;
  height: 90%;
  overflow: auto;
`

export const UserOnline = styled.li<Props>`
  display: flex;
  flex-direction: row;
  padding: 2px;
  border-bottom: 1px solid gray;
  background: ${(props) => (props.active ? '#cfcfcf' : 'none')};
`

export const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 3px;
`

export const UserDetails = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
export const TopNav = styled.div`
  height: 5vh;
  display: flex;
  padding: 5px;
`

export const ChatContainer = styled.ul`
  height: 90vh;
  display: flex;
  overflow: auto;
  background-color: white;
  flex-direction: column;
  padding: 10px;
`
export const Bottom = styled.div`
  height: 5vh;
  display: flex;
  flex-direction: row;
`
export const Input = styled.textarea`
  width: 85%;
  height: 75%;
  padding: 5px;
`
export const SendButton = styled.button`
  width: 15%;
  height: 100%;
  background-color: lawngreen;
`
export const LogoutButton = styled.button`
  width: 70px;
  color: black;
  border-radius: 10px;
  border: 2px solid red;
  margin-left: auto;
`
export const BlockButton = styled.button`
  width: 70px;
  color: white;
  border-radius: 10px;
  //border: 2px solid red;
  background: red;
  margin-left: 10px;
`
export const UnBlockButton = styled.button`
  width: 70px;
  color: white;
  border-radius: 10px;
  //border: 2px solid red;
  background: green;
  margin-left: 10px;
`
export const Message = styled.li<Props>`
  margin-left: ${(props) => (props.right ? 'auto' : 0)};
  color: black;
  border-radius: 10px;
  background-color: antiquewhite;
  list-style: none;
  min-width: 10%;
  max-width: 50%;
  margin-bottom: 10px;
  padding: 10px;
`
export const Login = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  justify-content: center;
`
export const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
`
