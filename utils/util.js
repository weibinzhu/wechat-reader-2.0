function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 公用方法，用于星星组件
function convertStar(star) {
    var length = star.substring(0, 1);
    var result = [];
    for (var i = 1; i < 6; i++) {
        if (i <= length) {
            result.push(1);
        }
        else {
            result.push(0);
        }
    }
    return result;
}

function http(url, callBack) {
    var _this = this;
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'Content-Type': "json"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (err) {
            console.log(err)
        }
    })
}

function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    formatTime: formatTime,
    convertStar: convertStar,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}
