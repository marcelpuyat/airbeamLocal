// To run with dig ocean vm: node airbeam_local.js 104.236.141.207:3000 10.31.138.209 safecloud
var vm_ip_address = process.argv[2]
camera_ip_address = process.argv[3];
var password = process.argv[4];

var FormData = require('form-data');
var fs = require('fs');
var request = require('request');
var express = require('express');
var app = express();

setInterval(function() {
		loadBase64Image('http://:'+password+'@'+camera_ip_address+'/image.jpg', function(encodedImage, unused) {
            console.log("Making post request to: " + 'http://'+vm_ip_address);
			request.post(
			    'http://'+vm_ip_address+'/upload_image',
			    { form: { encodedImage: encodedImage } },
			    function (error, response, body) {
                    if (error) {console.log(error);}
			        if (!error && response.statusCode == 200) {
			            console.log(body)
			        }
			    }
			);
		});
}, 5000);



/* From: https://stackoverflow.com/questions/11280063/get-image-from-another-domain-and-encode-base64-by-node-js */
var loadBase64Image = function (url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log("Got image from: " + url);
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};