$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })


    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return "两次密码不一致！";
            }
        }
    })


    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        e.preventDefault();
        $.post("/api/reguser", data, function (res) {
            if (res.status != 0) return layer.msg(res.message);;
            layer.msg('注册成功,请登录！');
            // 模拟人的点击行为
            $("#link_login").click();
        })
    })

    // 监听登录表单的提交事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功！");
                localStorage.setItem("token", res.token);
                location.href = "/index.html"
            }
        })
    })
})