// more-movie.js
var util = require("../../utils/util.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigationBarTitle: "",
        totalCount: 0,
        requestUrl: "",
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category; //获取movie页面传递进来的数据
        this.setData({
            navigationBarTitle: category
        });
        var dataUrl = "";
        switch (category) {
            case "正在热映": dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映": dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250": dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        util.http(dataUrl, this.processDoubanData);
        this.data.requestUrl = dataUrl;
    },

    // 处理接收回来的数据
    processDoubanData: function (data) {
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

        // 如果要绑定新加的数组，那么需要跟旧的绑在一起
        var totalMovie = [];
        if (!this.data.isEmpty) {
            totalMovie = this.data.movies.concat(movies);
            console.log(totalMovie);
        }
        else {
            totalMovie = movies;
            this.setData({
                isEmpty: false
            })
        }

        var movietemp = { movies: totalMovie, };
        this.setData(movietemp);//movietemp只是作为一个变量，此处相当于this.setData({key:movies}),所以在页面的appData里不会看到movietemp这个数据
        var tempCount = this.data.totalCount + 20;
        this.setData({ totalCount: tempCount });
        wx.hideNavigationBarLoading(); //数据添加完后隐藏加载提示
        wx.stopPullDownRefresh();//刷新后停止
    },

    // 设置导航栏文字
    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigationBarTitle,
        })
    },
    // 用于下滑加载更多
    onScrollLower: function (event) {
        var nextUrl = this.data.requestUrl +
            "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);

        // 设置导航栏加载提示
        wx.showNavigationBarLoading()
    },
    //用于下拉刷新
    onPullDownRefresh: function (event) {
        console.log('pull down');
        var nextUrl = this.data.requestUrl +
            "?start=0&count=20";
        this.setData({
            isEmpty: true,
            movies: {},
            totalCount: 0

        })
        util.http(nextUrl, this.processDoubanData);

        // 设置导航栏加载提示
        wx.showNavigationBarLoading()
    }


})