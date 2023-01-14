const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pQuery = require('./postgresUtil');

function initialize(passport){
    const authenticateUser = async (username, password, done) => {
        const user = await pQuery.getIdByEmail(username);
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
        const user = await pQuery.getUserById(id);
        console.log(user);
        done(null, user)
    })
}

module.exports = initialize;