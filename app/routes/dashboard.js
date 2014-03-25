/* global require, module */

var api = require('../ext/redis'),
    Site = require('../models/site');

module.exports = function(app){
    app.get('/dashboard', function(req, res) {
        if ( !req.isAuthenticated() ) {
            res.redirect('/signin');
        } else {
            Site.find({creator: req.user.username}, function(err, docs) {
                if ( err ) throw err;
                docs = docs.map(function(e){ return e.host; });
                res.render('admin-index.html', {
                    user: req.user,
                    title: req.user.username,
                    sites: docs
                });
            });
        }

    });

    app.get('/dashboard/:host', function(req, res) {
        if ( !req.isAuthenticated() ) {
            res.redirect('/signin');
        } else {
            api.getHostInfo(req.params.host, function(err, info){
                //TODO add error handler
                res.render('admin-view.html', {
                    user: req.user,
                    title: req.params.host,
                    data: info
                });
            });
        }
    });

    app.post('/dashboard/create', function(req, res) {
        if ( !req.isAuthenticated() ) {
            res.send(401);
        } else {
            Site.findOne({host: req.body.host}, function (err, existent) {
                if(existent) {
                    res.json({code: 500, error: 'Site is already being tracked'});
                    return;
                }

                new Site({
                    host: req.body.host,
                    creator: req.user.username,
                    created: Date.now()
                }).save(function(err){
                    if ( err ) {
                        res.json({code: 500, error: err});
                        return;
                    }
                    res.json({code: 200})
                });
            });
        }
    });
};
