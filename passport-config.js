const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const client = require('./portgresClient');

const getIdByEmail = async (email) => {
    let user = {};
    await client
        .query('SELECT * FROM users WHERE email=$1', [email])
        .then((result) => user = result.rows[0])
        .catch((e) => console.error(e.stack))
    return user;
}

const getUserById = async (id) => {
    let user = {}
    await client
        .query('SELECT * FROM users WHERE id=$1', [id])
        .then((result) => user = result.rows[0])
        .catch((e) => console.error(e.stack))
    return user;
}

function initialize(passport){
    const authenticateUser = async (username, password, done) => {
        const user = await getIdByEmail(username);
        if(user?.id==null){
            console.log('No user found with this email address');
            return done(null, false, {message:'No user found with this email'});
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                console.log('Passwords match');
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch(e) {
            return done(e);
        }
    }

    passport.use(new localStrategy(authenticateUser));
    passport.serializeUser((user, done) => {
        console.log('serialised user')
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        console.log(user);
        done(null, user)
    })
}

module.exports = initialize;