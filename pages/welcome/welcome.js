Page({
    onTap:function(){
      wx.switchTab({
        url: '/pages/post/post',
      })
    }
})
// 在122100版本中，如果要跳转到一个带tab选项卡的页面，需要使用wx.switchTab方法