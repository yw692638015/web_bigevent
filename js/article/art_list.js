$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象提，提交到服务器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    var q = {
        pagenum: 1,//默认请求第一页的数据
        pagesize: 2,
        cate_id: "",
        state: ""
    }
    initTable();
    initCate();
    // 这是获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        })

    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template("tpl-cate", res);
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询对象中q中对应的属性赋值
        q.cate_id = cate_id;
        q.status = state;
        initTable();
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值，复制到q这个询查参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // console.log(first);
                if (!first) {
                    initTable();
                }
            }
        });
    }


    // 通过代理的形式，为删除按钮绑定蒂安集事件处理函数
    $("tbody").on('click', ".btn-delete", function () {
        var len = $(".btn-delete").length;
        console.log(len);
        var id = $(this).attr('data-id');
        // console.log("ok");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败！")
                    }
                    layer.msg("删除文章成功!");
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据
                    // 如果没有剩余的数据 ，则让页码之-1
                    // 再调用initTable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})