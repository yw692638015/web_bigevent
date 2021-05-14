$(function () {
    // 调用 getUserInfo获取用户基本信息
    getUserInfo();
    var layer = layui.layer
    $("#btnLogout").on("click", function () {
        // console.log("ok");
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // console.log("ok");
            // 清空本地存储中的token
            localStorage.removeItem("token");
            location.href = "/login.html"
            layer.close(index);
        });
    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！");
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data);
        }
        // 无论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // console.log("执行 complete回调");
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJson
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem("token");
        //         location.href = "/login.html";
        //     }
        // }
    })
}
function renderAvatar(user) {
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avator").hide();
    } else {
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avator").html(first);
    }
}