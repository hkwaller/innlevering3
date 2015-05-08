var Post = require('../models/post')
var websockets = require('../websockets')

module.exports.create = function(req, res) {
    var post = new Post(req.body);
    post.save(function(err, result) {
        if (err) return err;
        websockets.broadcast('new_post', result)
        res.status(201).json(result);
    });
}

module.exports.list = function(req, res) {
    Post.find({}, function(err, results) {
        if (err) return err;
        res.status(200).json(results);
    });
}

module.exports.delete = function(req, res) {
    Post.findById(req.query.id, function(err, post) {
        if (err) return err;
        post.remove(function(err, post){
          websockets.broadcast('delete_secret', post)
          res.status(200).json(post);
        });
    });
};
