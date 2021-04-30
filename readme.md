# Specification
The app is a single page, and contains a few sections:
### 1. Left pane: ✅
a. Showsmyemail
b. Showsalistofallthecurrentlyonlineusersinthesystem

### 2. Main pane: ✅
Show the chat with the selected user

### 3. Bottom pane: ✅
Message box, where you type in messages

## These are the desired behaviors:

1. As a user, I have to login or register to use the app ✅
2. When I’m logged in and the app is open, other users should see me in the online
user’s list ✅
3. I can block a user, so I won’t show up on his users list anymore. ✅
4. All users can chat with each other (unless blocked) ✅
5. If I have no open windows for the app, I should disappear from the list ✅
6. If I have multiple windows open for the app, the state should be the EXACT same
for each ⚠️
7. The app state is around live changes. The app should not rely on polling (interval
requests). ✅

## How to run the app
Before this app can run, you have to install and setup
* node
* docker

### Run with docker
Open the parent folder, Run command in terminal
```
docker-compose up
```

### Run manually
Open server folder install node packages and start backend server, Run command in terminal
```
npm install
npm run build
npm run start
```

And finally open client folder install node packages and start frontend server, Run command in terminal
```
npm install
npm run start
```
