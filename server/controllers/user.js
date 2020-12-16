const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')

        //Get user info from body
        const {username, password, profile_pic} = req.body

        //Checks to see if user is found
        const foundUser = await db.auth.find_user_by_username(username)

        //if existing user found
        if(foundUser[0]){
            return res.status(400).send('This username is already registered')
        }

        // hash the password 
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        // add new user
        const newUser = await db.auth.create_user(username, hash, profile_pic)
        delete newUser[0].hash //don't want the hash to be included in the session

        //create a session for the new user which logs them in
        req.session.user = { ...newUser[0] }

        res.status(200).send(req.session.user)
    },
    login: async (req, res) => {
        const db = req.app.get('db')
            
        const {username, password, profile_pic } = req.body
        
        //Checks to see if user is found
        const foundUser = await db.auth.find_user_by_username(username)

        //if existing user found
        if(foundUser[0]){
            return res.status(400).send('This username is already registered')
        }

        // Check their password against the hash, if there is a mismatch, reject the request
        const isAuthenticated = bcrypt.compareSync(password, foundUser.hash)
        
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect password')
        }
        
        // Delete the hash from the user object
        delete foundUser.hash
        
        // Attach the user to the session
        req.session.user = foundUser
        
        // Send back confirmation of login
        res.status(200).send(foundUser)
    },
    getUser: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
          } else {
            res.status(404).send('No session found')
          }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}