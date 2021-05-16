$(function () {
    // 获取文章分类的列表
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $("#btnAddCate").on("click", function () {

        indexAdd = layer.open({
            type: "1",
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $("body").on("submit", "#form_add", function (e) {
        e.preventDefault();
        // console.log("ok");
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！");
                }
                initArtCateList();
                layer.msg("新增分类成功！");
                layer.close(indexAdd)
            }
        })
    })

    // 修改分类
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // console.log("ok");
        indexEdit = layer.open({
            type: "1",
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })
        var id = $(this).attr("data-id")
        console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                form.val("form-edit", res.data);
                console.log(res);
            }
        })
    })

    $("body").on("submit", "#form_edit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg("更新分类数据失败！");
                }
                layer.msg("更新分类数据成功！");
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    $("tbody").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg("删除分类失败！");
                    layer.msg("删除分类成功！")
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
})