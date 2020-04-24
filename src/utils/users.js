const users = []

// adduser , removeUser , getUser , getUsersInRoom

const addUser = ({id,username,room,password})=>{
    // Clean the data remove extra spaces
    username = username.trim().toLowerCase()
    room     = room.trim().toLowerCase()
    password = password.trim()

    // Validate the data
    if(!username){
        // return {
        //     error:'Username and room are required!'
        // }
        return {
            error:"Username is mandatory!"
        }
    }
    else if(!room){
        return {
            error:"Room name is mandatory!"
        }
    }
    else if(!password){
        return {
            error:"Password is mandatory!"
        }
    }


    // Check for existing user
    const existingUser    = users.find((user)=>{
        return user.room === room && user.username === username && user.password === password

    })

    // Validate Username
    if(existingUser){
        return {
            error:'Username is in use!'
        }
    }


    // Store User and push in array
    const user = {id,username,room,password}
    users.push(user)
    return {user}

}

//Remove User 
const removeUser  = (id)=>{
    const index = users.findIndex((user)=>{
        // (return true if user.id is equal to the coming id)
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// Get User
const getUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index === -1){
        return undefined
    }
    return users[index]
}


// GetUsers in room
const getUsersInRoom =  (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}





// addUser({
//     id:22,
//     username:'Andrew',
//     room:'South Philey'
// })
// addUser({
//     id:43,
//     username:'vivan',
//     room:'South Philey'
// })
// addUser({
//     id:44,
//     username:'dhruv',
//     room:'South Philey'
// })
// console.log(users)


// console.log(getUsersInRoom('South Philey'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom 
}