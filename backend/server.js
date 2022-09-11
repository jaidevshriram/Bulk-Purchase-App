const express = require('express');
var redis   = require("redis");
const bodyParser = require('body-parser');
const session = require('express-session');
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8000;
const routes = express.Router();
const fuzz = require('fuzzball');

let User = require('./models/user');
let Product = require('./models/product');

app.use(session({
    secret: 'jdelivery',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl :  260}),
    saveUninitialized: false,
    resave: false
}));

// Connection to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/jdelivery', { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function() {
    console.log("MongoDB database connection established succesfully.");
})

routes.route('/customer/rate-vendor').post((req, res) => {
    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    } else {
    
        var getUsers = async() => {
            var users = await (User.find({isVendor: true}, (users) => {
                return users;
            }))
            return users;
        };

        var getProduct = async(product_id) => {
            var product = await(Product.findById(product_id, (product) => {
                return product;
            }))
            return product;
        }

        var rateUser = async(id, rating) => {
            var user = await(User.findOneAndUpdate({_id: id}, {$set: {rating: rating}}, (user, err) => {
                console.log(err, user);
                return user;
            }));
            return user;
        }

        var getProducts = async() => {
            var users = await getUsers();
            for(const user of users) {
                for(const product_id of user.productList) {
                    if(product_id == req.body.id) {
                        console.log("Updating rating " + user._id);
                        var updated_user = await rateUser(user._id, (user.rating + req.body.rating)/2);
                        break;
                    }
                }
            }
        }

        getProducts().then(() => {
            res.status(200).json({"message": "Rating updated", "success": true});
        }).catch(() => {
            res.json({"message": "Rating failed", "success": false});
        })
    }

})

routes.route('/customer/review-vendor').post((req, res) => {
    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    } else {
    
        var getUsers = async() => {
            var users = await (User.find({isVendor: true}, (users) => {
                return users;
            }))
            return users;
        };

        var getProduct = async(product_id) => {
            var product = await(Product.findById(product_id, (product) => {
                return product;
            }))
            return product;
        }

        var reviewUser = async(id, review) => {
            var user = await(User.findOneAndUpdate({_id: id}, {$push: {reviews: {"$each": [review]}}}, (user, err) => {
                console.log(err, user);
                return user;
            }));
            return user;
        }

        var getProducts = async() => {
            var users = await getUsers();
            for(const user of users) {
                for(const product_id of user.productList) {
                    if(product_id === req.body.id) {
                        console.log("Updating review " + user._id);
                        var updated_user = await reviewUser(user._id, req.body.review);
                        return updated_user;
                        break;
                    }
                }
            }
            return true;
        }

        getProducts().then(() => {
            res.status(200).json({"message": "Review Added", "success": true});
        }).catch(() => {
            res.json({"message": "Unable to add review", "success": true});
        })
    }
})

routes.route('/customer/rate-product').post((req, res) => {
    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        Product.findOneAndUpdate({_id: req.body.id},
            { $set:  {rating: req.body.rating} }
        ).then(old => {
            console.log(old);
            res.json({"message": "Rating Updated!", "success": true});
        }).catch(err => {
            console.log("Product couldn't be rated");
            console.log(err);
            res.json({"message": "Product couldn't be rated. Server Error."});
        });
    }    
})

routes.route('/customer/view-products').post((req, res) => {

    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {

        // console.log("VIEW REQUEST")

        let product_ids = [];
        let products = [];
        let promises = [];

        User.findOne({ email: req.session.email }).then(user => {

            product_ids = user.productList;

            for(let i=0; i<product_ids.length; i++) {
                promises.push(Product.findById(product_ids[i]).then((prod) => {
                    // console.log(prod);
                    return prod;
                }));
            }

            Promise.all(promises).then((values) => {
                if(values)
                    products = values;
                else
                    products = []
                res.json({"products": products, "success": true});
            })
    
        }).catch(err => {
            console.log(err);
            res.json({"message": "Failed to retrieve data!"});
        })
    }
})

routes.route('/customer/review-product').post((req, res) => {

    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        Product.findOneAndUpdate({_id: req.body.id},
            { $push:  {review: { "$each": [req.body.review] } } }
        ).then(old => {
            console.log(old);
            res.json({"message": "Review Updated!", "success": true});
        }).catch(err => {
            console.log("Product couldn't be reviewed");
            console.log(err);
            res.json({"message": "Product couldn't be reviewed. Server Error."});
        });
    }
})

routes.route('/customer/edit-product').post((req, res) => {

    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        Product.findOneAndUpdate({_id: req.body.id},
            { $set: {quantity: req.body.quantity} }
        ).then(old => {
            console.log(old);
            if (old.requiredQuantity <= req.body.quantity) {
                console.log("Status Update!")
                Product.update({_id: old._id},
                    {$set: { status: 1 }}
                ).catch((err) => console.log(err))
            }
            res.json({"message": "Quantity Updated!", "success": true});
        }).catch(err => {
            console.log("Product couldn't be updated");
            console.log(err);
            res.json({"message": "Product couldn't be updated. Server Error."});
        });
    }
})

routes.route('/customer/buy-product').post((req, res) => {
    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    } else {
        console.log("Buy request received")
        Product.findOneAndUpdate({_id: req.body.product._id},
            { quantity: req.body.product.quantity + req.body.quantity }
        )
        .then(() => {
            User.findOneAndUpdate({email: req.session.email},
                { $push: { productList: { "$each": [req.body.product._id] } } }
            ).then(user => {
                console.log("Appended to vendor list")
                res.json({"message": "Item Bought", "success": true });
            }).catch(err => {
                console.log("Appending to list failed");
                console.log(err);
                res.json({"message": "Product couldn't be added :(. Server Error."});
            });
        })
        .then(() => {
            if (req.body.product.requiredQuantity <= (req.body.product.quantity + req.body.quantity)) {
                console.log("Status Update!")
                Product.update({_id: req.body.product._id},
                    {$set: { status: 1 }}
                ).catch((err) => console.log(err))
            }

            return true
        })
        .catch(() => {
            res.json({"message": "Fail!", "success": false })
        })
    }
})

routes.route('/customer/search-product').post((req, res) => {
    
    if(!req.session.email || req.session.isVendor == true) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    } else {
    
        var products = [];

        var getUsers = async() => {
            var users = await (User.find({isVendor: true}, (users) => {
                return users;
            }))
            return users;
        };

        var getProduct = async(product_id) => {
            var product = await(Product.findById(product_id, (product) => {
                return product;
            }))
            return product;
        }

        var fuzzyMatch = (word1, word2) => {
            fuzz_ratio = fuzz.ratio(word1, word2);
            // console.log(fuzz_ratio);
            if(fuzz_ratio > 20)
                return true;
            else
                return false;
        } 

        var getProducts = async() => {
            var users = await getUsers();
            for(const user of users) {
                for(const product_id of user.productList) {
                    var product = await getProduct(product_id);
                    if (product != null && fuzzyMatch(product.name, req.body.search) && product.status == 0) {
                        product.user_id = user._id;
                        products.push({product: product, user: user});
                    }
                }
            }
        }

        getProducts().then(() => {
            // console.log(products);
            res.status(200).json({"message": "Search results sent", "success": true, "results": products});
        }).catch(() => {
            res.json({"message": "Unable to get products", "success": false});
        })
    }
})

routes.route('/vendor/cancel-product').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        Product.findOneAndUpdate({_id: req.body.id},
            { status: 3 }
        ).then(updated => {
            console.log("Product Cancelled");
            let product_ids = [];
            let products = [];
            let promises = [];
    
            User.findOne({ email: req.session.email }).then(user => {
    
                product_ids = user.productList;
    
                for(let i=0; i<product_ids.length; i++) {
                    promises.push(Product.findById(product_ids[i]).then((prod) => {
                        // console.log(prod);
                        return prod;
                    }));
                }
    
                Promise.all(promises).then((values) => {
                    if(values)
                        products = values;
                    else
                        products = []
                    res.json({"products": products, "success": true, "message": "Succesfully cancelled the product"});
                })

            }).catch(err => {
                console.log(err);
                res.json({"message": "Failed to retrieve data!"});
            })
        }).catch(err => {
            console.log("Product couldn't be cancelled");
            console.log(err);
            res.json({"message": "Product couldn't be cancelled. Server Error."});
        });
    }
})

routes.route('/vendor/dispatch').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        Product.findOneAndUpdate({_id: req.body.id},
            { $set:  {status: 2} }
        ).then(updated => {
            res.json({"message": "Dispatched!", "success": true});
        }).catch(err => {
            console.log("Product couldn't be dispatched");
            console.log(err);
            res.json({"message": "Product couldn't be cancelled. Server Error."});
        });
    }
})

routes.route('/vendor/dispatched').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        let product_ids = [];
        let products = [];
        let promises = [];

        User.findOne({ email: req.session.email }).then(user => {

            product_ids = user.productList;

            for(let i=0; i<product_ids.length; i++) {
                promises.push(Product.findById(product_ids[i]).then((prod) => {
                    if(prod && prod.status == 2)
                        return prod;
                    else
                        return null;
                }));
            }

            Promise.all(promises).then((values) => {
                if(values)
                    products = values;
                else
                    products = []
                res.json({"products": products, "success": true});
            })
        }).catch(err => {
            console.log(err);
            res.json({"message": "Failed to retrieve data!"});
        })
    }
})

routes.route('/vendor/view-products').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        let product_ids = [];
        let products = [];
        let promises = [];

        User.findOne({ email: req.session.email }).then(user => {

            product_ids = user.productList;

            for(let i=0; i<product_ids.length; i++) {
                promises.push(Product.findById(product_ids[i]).then((prod) => {
                    // console.log(prod);
                    return prod;
                }));
            }

            Promise.all(promises).then((values) => {
                if(values)
                    products = values;
                else
                    products = []
                res.json({"products": products, "success": true});
            })
        }).catch(err => {
            console.log(err);
            res.json({"message": "Failed to retrieve data!"});
        })
    }
})

routes.route('/vendor/dispatch-ready').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        let product_ids = [];
        let products = [];
        let promises = [];

        User.findOne({ email: req.session.email }).then(user => {

            product_ids = user.productList;

            for(let i=0; i<product_ids.length; i++) {
                promises.push(Product.findById(product_ids[i]).then((prod) => {
                    if(prod && prod.status == 1)
                        return prod;
                    else
                        return null;
                }));
            }

            Promise.all(promises).then((values) => {
                if(values)
                    products = values;
                else
                    products = []
                res.json({"products": products, "success": true});
            })
        }).catch(err => {
            console.log(err);
            res.json({"message": "Failed to retrieve data!"});
        })
    }
})

routes.route('/vendor/new-product').post((req, res) => {

    if(!req.session.email || req.session.isVendor == false) {
        console.log(req.session);
        res.status(403).json({"message": "Forbidden Action! Try Again!"});
    }
    else {
        let product = new Product(req.body);
        product.save()
        .then(product => {
            console.log(product);

            User.findOneAndUpdate({email: req.session.email},
                { $push: { productList: { "$each": [product._id] } } }
            ).then(user => {
                console.log("Appended to vendor list");
            }).catch(err => {
                console.log("Appending to list failed");
                console.log(err);
                res.json({"message": "Product couldn't be added :(. Server Error."});
            });

            res.json({ "message": "Product created!", "success": true});
        })
        .catch(err => {
            console.log(err);
            console.log(req.body);
            res.json({ "message": 'Check fields again!', "success": false});
        });
    }
})

routes.route('/login').post((req, res) => {
    User.find({ email: req.body.email }).then(users => {
        if (Array.isArray(users) && users.length == 0) {
            res.json({"message": "No such user! Try again!"});
            return;
        } else {
            User.findOne({ email: req.body.email }).then(users => {
                if(!bcrypt.compareSync(req.body.password, users.password)) {
                    res.json({"message": "Incorrect Password! Try Again!"})
                } else {
                    req.session.email = req.body.email;
                    req.session.isVendor = users.isVendor;
                    console.log(req.session);
                    res.json({"message": "Success!", "success": true, "isVendor": users.isVendor})
                }
            })
        }
    })
})

routes.route('/logout').post((req, res) => {

    console.log("Logout requested.")

    req.session.destroy(function(err){
        if(err){
            console.log("KEY NOT DESTROYED");
            console.log(err);
        } else {
            console.log("Logout Successful!");
            res.status(200).json({"message": "Logout Succesful!"});
        }
    });
})

routes.route('/register').post((req, res) => {
    
    User.find({ email: req.body.email }).then(users => {
        if (Array.isArray(users) && users.length) {
            // console.log(users)
            res.json({"message": "User already exists! Try a different email!"});
            return;
        } else {
            req.body.password = bcrypt.hashSync(req.body.password, 2);
        
            if (req.body.isVendor === 'Customer') {
                req.body.isVendor = false
                req.body.productList = []
            } else {
                req.body.isVendor = true
                req.body.productList = []
                req.body.rating = 5
                req.body.reviews = []
            }
        
            let user = new User(req.body);
        
            user.save()
                .then(user => {
                    res.json({ "message": "User created!", "success": true});
                })
                .catch(err => {
                    console.log(err);
                    console.log(req.body);
                    res.json({ "message": 'Check fields again!', "success": false});
                });
        }
    })
})

app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST'],
    credentials: true
  }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes);

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
});
