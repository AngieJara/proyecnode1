const {format} = require('timeago.js');

const helpers={};
//fecha de publicacions
helpers.timeago=(timestamp)=>{
    return format(timestamp);
};
module.exports= helpers;