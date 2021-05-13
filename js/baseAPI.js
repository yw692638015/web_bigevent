// 调用ajaxPrefilter可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})