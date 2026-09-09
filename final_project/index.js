const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.set('json spaces', 4);

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authenticated) {
        const token = req.session.authenticated["accessToken"];
        try {
            const data = jwt.verify(token, "highly_secure");
            req.session.user = data.user;
            next();
        } catch (err) {
            return res.status(401).send("Invalid token");
        }
    } else {
        return res.send("not authenticated")
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
