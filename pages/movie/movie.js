// movie.js
var util = require("../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        "inTheater": {

        },
        "comingSoon": {

        },
        "top250": {

        },
        containerShow: true,
        searchPanelShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 传递数据给服务器，记得加问号
        var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getDoubanData(inTheaterUrl, "inTheater", "正在热映");
        this.getDoubanData(comingSoonUrl, "comingSoon", "即将上映");
        this.getDoubanData(top250Url, "top250", "豆瓣Top250");
    },
    getDoubanData: function (url, key, categoryTitle) {
        var _this = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': "json"
            },
            success: function (res) {
                _this.processDoubanData(res.data, key, categoryTitle);

            },
            fail: function (err) {
                console.log(err)
            }
        })
    },
    processDoubanData: function (data, key, categoryTitle) {
        var movies = [];
        for (var idx in data.subjects) {
            var subject = data.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                star: util.convertStar(subject.rating.stars),
            }
            movies.push(temp);
        }
        // this.setData({
        //     key:movies
        // })
        //不能将变量作为对象的key，所以这样行不通，key每一次都会被覆盖
        var movietemp = {};
        movietemp[key] = {
            movies: movies,
            categoryTitle: categoryTitle
        };
        this.setData(movietemp);//movietemp只是作为一个变量，此处相当于this.setData({key:movies}),所以在页面的appData里不会看到movietemp这个数据
    },
    // 用于『更多』跳转
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        //获取自定义属性传递的数据
        wx.navigateTo({
            //将数据传递到跳转页面
            url: '/pages/more-movie/more-movie?category=' + category,
        })
    },
    onMovieTap:function(event){
        var id = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '/pages/movie-detail/movie-detail?id='+id,
        })
    },

    //控制搜索页显隐
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
        console.log("focus")
    },
    onCancelTap:function(event){
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult:{}
        });
        
    },
    onBindConfirm: function (event) {
        
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getDoubanData(searchUrl, "searchResult", "");
        

    }
    
})
