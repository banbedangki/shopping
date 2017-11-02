var Footballplayer = require('../models/footballplayer');
var mongoose       = require('mongoose');

mongoose.connect('localhost:27017/shopping');
var footballplayers =[
    new Footballplayer({
        imagePath: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/11/27/07/Lionel-Messi.jpg',
        title: 'Messi',
        description:'Best football player in Argentina!!!',
        price: 150
    }),

    new Footballplayer({
        imagePath: 'https://www.menshairstyletrends.com/wp-content/uploads/2017/07/neymar-undercut-hair-style-Getty-e1499881358814.jpg',
        title: 'Neymar',
        description:'Best football player in Brazil!!!',
        price: 200
    }),

    new Footballplayer({
        imagePath: 'https://tmssl.akamaized.net//images/portrait/originals/8198-1413207036.jpg',
        title: 'Ronaldo',
        description:'Best football player in Portugal!!!',
        price: 100
    }),

    new Footballplayer({
        imagePath: 'https://static.independent.co.uk/s3fs-public/styles/article_small/public/thumbnails/image/2017/06/25/19/harry-kane-spurs.jpg',
        title: 'Harry Kane',
        description:'Best football player in England!!!',
        price: 90
    }),

    new Footballplayer({
        imagePath: 'http://www.weloba.com/sites/default/files/images/general/hi-res-187611879-xavi-hernandez-of-fc-barcelona-looks-on-prior-to-the-la_crop_exact.jpg',
        title: 'Xavi Hernandez',
        description:'Legend football player in Spain!!!',
        price: 170
    }),

    new Footballplayer({
        imagePath: 'http://mediadb.kicker.de/2011/fussball/spieler/xl/24788_912_2010914173227302.jpg',
        title: 'Carles Puyol',
        description:'Legend football player in Spain!!!',
        price: 160
    }),
];

var count = 0;
for(var i = 0; i < footballplayers.length; i++){
    footballplayers[i].save(function(err, result){
        count++;
        if(count === footballplayers.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}