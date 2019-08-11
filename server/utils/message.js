var moment = require('moment');

var generateMessage = (from,text) => {
return {
    from,
    text,
    createdAt: moment().valueOf()
}
};

var generateLocationMessage = (from,latitude,longitude) => {
return {
    from,
    url:`https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment.valueOf()
}
};

var generateImgMessage = (from,image) => {
return {
    from,
    image:`${image}`,
    createdAt: moment.valueOf()
}
};

var generateVidMessage = (from,vid) => {
return {
    from,
    vid:`${vid}`,
    createdAt: moment.valueOf()
}
};

var generateAttMessage = (from,att) => {
return {
    from,
    att:`${att}`,
    createdAt: moment.valueOf()
}
};

var generateAdminMessage = (from,text) => {
return {
    from,
    text,
    createdAt: moment.valueOf()
}
};


var generateAdminLMessage = (from,text) => {
return {
    from,
    text,
    createdAt: moment.valueOf()
}
};

module.exports= {generateMessage,generateLocationMessage,generateImgMessage,generateVidMessage,generateAttMessage,generateAdminMessage,generateAdminLMessage};