var postContent = require('../../data/postContentData.js');
var app = getApp();//获取全局变量
// post-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var _this = this;
        var currentContent = postContent.postList[id];
        this.setData({
            postContentKey: currentContent,
            id: options.id
        });
        var postCollectionStatus = wx.getStorageSync("postCollectionStatus");
        if (postCollectionStatus) {
            var currentStatus = postCollectionStatus[id];
            this.setData({
                collected: currentStatus
            })
        }
        else {
            var postCollectionStatus = {};
            postCollectionStatus[id] = false;
            wx.setStorageSync("postCollectionStatus", postCollectionStatus)
        }
        // 用于监听事件
        wx.onBackgroundAudioPlay(function () {
            {
                _this.setData({
                    isPlayingMusic: true
                });
                // 由于是全局变量，可以直接复制
                app.globalData.g_isPlayingMusic = true;
                app.globalData.g_isPlayingMusicId = id;
            }
        });
        wx.onBackgroundAudioPause(function () {
            {
                _this.setData({
                    isPlayingMusic: false
                });
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_isPlayingMusicId = null;
            }
        });
        wx.onBackgroundAudioStop(function () {
            {
                _this.setData({
                    isPlayingMusic: false
                });
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_isPlayingMusicId = null;
            }
        });

        if (app.globalData.g_isPlayingMusic && app.globalData.g_isPlayingMusicId == id) {
            //  一律用这种方式设置数据绑定
            this.setData({
                isPlayingMusic: true
            });
        }

    },

    // 收藏事件函数
    onCollectionTap: function (event) {
        // 切换图片显示状态
        // 改变缓存值
        // console.log(this.data.id)
        var postCollectionStatus = wx.getStorageSync("postCollectionStatus");
        var currentStatus = postCollectionStatus[this.data.id];
        currentStatus = !currentStatus;
        postCollectionStatus[this.data.id] = currentStatus;
        wx.setStorageSync("postCollectionStatus", postCollectionStatus);
        this.setData({
            collected: currentStatus
        })
        wx.showToast({
            title: currentStatus ? "收藏成功" : "取消成功"
        })



    },
    onShareTap: function (event) {
        var itemList = [
            "分享到朋友圈",
            "分享到微博",
            "分享到QQ",
            "分享到微信好友"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showToast({
                    title: '用户点击了:' + itemList[res.tapIndex],
                })
            }
        })
    },
    onMusicTap: function (event) {
        var _this = this
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: _this.data.postContentKey.music.url,
                title: _this.data.postContentKey.music.title,
                coverImgUrl: _this.data.postContentKey.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }

    },

})