$(function() {
    var layer = layui.layer

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    var updateResule = null
    $('tbody').on('click', '.btn-edit', function() {
        // console.log(111);
        var updateResule = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章分类数据失败！')
                layui.form.val('form-edit', res.data)
            }

        })
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('更新分类信息失败！')
                    layui.layer.msg('更新分类信息成功！')
                    initArtCateList()
                    layui.layer.close(updateResule)

                }
            })
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        layui.layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
            //do something 
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('删除文章分类失败！')
                    layui.layer.msg('删除文章分类成功！')
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })

})