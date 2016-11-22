var express = require('express');
var router = express.Router();
var request = require('request');
var qs = require('querystring');
var jp = require('jsonpath');

var goodGuyLib = require('good-guy-http');

var goodGuy = goodGuyLib({
    maxRetries: 33,
    // defaultCaching: {
    //     cached: true,
    //     timeToLive: 5000,
    //     mustRevalidate: false
    // },
    // cache: goodGuyLib.inMemoryCache(10)
});

/* GET users listing. */
router.get('/:isbn', function (req, res, next) {
    goodGuy('https://book-catalog-proxy-5.herokuapp.com/book?' + qs.stringify({
            isbn: req.params.isbn
        }))
        .then(function (response) {
            console.log(response.body);

            var result = JSON.parse(response.body);

            var title = jp.value(result, '$..title');
            var cover = jp.value(result, '$..thumbnail');

            res.render('base', {
                title: title,
                thumbnail: cover,
                partials: {
                    layout: 'books'
                }
            });
        }).catch(next);

    // request('https://book-catalog-proxy.herokuapp.com/book?' + qs.stringify({
    //         isbn: req.params.isbn
    //     }), function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         var result = JSON.parse(body);
    //         var book = result.items[0];
    //
    //         res.render('books', {
    //             title: book.volumeInfo.title,
    //             thumbnail: book.volumeInfo.imageLinks.thumbnail
    //         });
    //     }
    // })
});

module.exports = router;
