// 调用ajaxPrefilter可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // options.url = 'http://www.liulongbin.top:3007' + options.url;
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url);
    // 统一为有权限的接口,设置 headers 请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem("token");
            location.href = "/login.html";
        }
    }
})