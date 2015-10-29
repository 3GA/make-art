var api,
    notify = require('../notify'),
    fileUtil = require('../../util/file');

module.exports = function (config) {
    api = require('./world-api')(config);

    return {
        share: function(title, code, description, image, world, challengeNo, callback) {
            var cover = fileUtil.dataURItoBlob(image),
                attachment = new Blob([ code ], { type: 'text/plain' });

            cover.filename = 'cover.png';
            attachment.filename = 'code.draw';

            var data = {
                app         : 'kano-draw',
                title       : title,
                description : description,
                files       : {
                    cover      : cover,
                    attachment : attachment
                }
            };

            if (world && challengeNo) {

                data.campaignRef = {};
                data.campaignRef.code = world;
                data.campaignRef.challengeNo = parseInt(challengeNo, 10);
            }

            api.share.post(data)
            .then(function (data) {
                if (typeof callback === 'function') {
                    callback(data);
                }

                notify.success();
            }, function (res) {
                notify.failure(res);
                return false;
            })
            .catch(function (err) {
                throw err;
            });
        },
        load: function(cb) {
            api.challenge.web.load()
            .then(function (res) {
                cb(res.body);
            }, notify.failure);
        },
        saveWallpaper: function(filename, image_1024, image_4_3, image_16_9) {
            api.challenge.saveWallpaper({
                filename   : filename,
                image_1024 : image_1024,
                image_4_3  : image_4_3,
                image_16_9 : image_16_9,
            })
            .then(notify.success, notify.failure);
        }
    };
};
