$(function () {
    getList();
});
/* 获取数据 */
function getList() {
    $.ajax({
        url: "/page",
        dataType: "json",
        success: function (res) {
            var result = {};
            result.heros = res;
            console.log(result.heros);
            window.localStorage.setItem("herosData", JSON.stringify(res));
            var html = template("list", result);
            $("#tbody").html(html);
        }
    })
};
function clearForm() {
    $('input[name="gender"]').each(function () {
        $(this).prop("checked", false);
    });
    $("#myForm").find("input[type='text']").val("");
    $("#myForm").find("photo").attr("src", "");
}

/* 删除模块展示前 */
$('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('name') // Extract info from data-* attributes
    var id = button.data("id")
    var modal = $(this)
    modal.find('.delete-name').text(recipient)
    modal.find(".deleteBtn").attr("data-id", id)
});

/* 编辑模块展示前 */
$('#editModal').on('show.bs.modal', function (event) {
    // 清空表单
    $("#myForm").find("input[type='radio']").removeAttr("checked");
    $("#myForm").find("input[name='name']").val("");
    $("#photo").attr("src", "");

    var modal = $(this)
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data("id")
    var type = button.data('type') // Extract info from data-* attributes
    /* 区分是添加还是编辑 */
    if (type == "add") { //添加
        modal.find(".modal-title").text("Add Your Hero");
        modal.find(".editOption").attr("data-type", type);
    } else {// 编辑
        modal.find(".modal-title").text("Hero Detail");
        modal.find(".editOption").attr("data-type", type);
        modal.find(".editOption").attr("data-id", id);
        var id = button.data("id")
        var herosData = JSON.parse(localStorage.getItem("herosData"));
        for (var i = 0; i < herosData.length; i++) {
            if (id == herosData[i].id) {
                $("#myForm input[name='name']").val(herosData[i].name);
                if (herosData[i].gender == "man") $("#myForm #nan").prop("checked", true);
                if (herosData[i].gender == "woman") $("#myForm #nv").prop("checked", true);
                $("#myForm #photo").attr("src", herosData[i].img);
            }
        }
    }
});

/* 图片上传 */
$("#img").on("change", function () {
    var file = this.files[0];
    var read = new FileReader() // 创建FileReader对像;
    read.readAsDataURL(file) // 调用readAsDataURL方法读取文件;
    read.onload = function () {
        url = this.result;
        $("#photo").attr("src", url);
    }
    // ----------
    var formdata = new FormData();
    formdata.append("name", "kk");
    formdata.append("img", file);
    formdata.append("last", $("#photo").attr("last"));
    // 上传图片
    $.ajax({
        url: "/postUpload",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (result) {
            if (result.code == 1) {
                console.log(result);
                $("#photo").attr("src", "/images/" + result.path);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
});

/* 删除数据 */
$(document).delegate(".deleteBtn", "click", function (e) {
    e.preventDefault();
    var dataId = parseInt(this.getAttribute('data-id'));
    $.ajax({
        url: "/del",
        type: "POST",
        data: { "id": dataId },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code === 1) {
                bootoast.toast({
                    message: res.msg,
                    type: 'success',
                    position: 'top',
                    icon: null,
                    timeout: 2,
                    animationDuration: 300,
                    dismissible: false
                });
                getList();
            }
        }
    });
});

/* 添加和编辑操作 */
$(".editOption").on("click", function () {
    var type = this.getAttribute("data-type");
    var id = parseInt(this.getAttribute("data-id"));
    /* 验证表单 */
    if (!$("#myForm input[name='name']").val()) {
        bootoast.toast({
            message: "The name cannot be empty!",
            type: 'warning',
            position: 'top',
            timeout: 2
        });
        return false;
    } else if (!$("#myForm input:radio[name='gender']:checked").val()) {
        bootoast.toast({
            message: "Choose a gender please!",
            type: 'warning',
            position: 'top',
            timeout: 2
        });
        return false;
    } else if (!$("#photo").attr("src")) {
        bootoast.toast({
            message: "Please pick a avatar !",
            type: 'warning',
            position: 'top',
            timeout: 2
        });
        return false;
    }
    /* ******* */
    if (type == "add") {
        var data = $("form").serialize();
        data = data + "&img=" + $("#photo").attr("src");
        $.ajax({
            url: "/add",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (res.code === 1) {
                    bootoast.toast({
                        message: res.msg,
                        type: 'success',
                        position: 'top',
                        timeout: 2,
                        animationDuration: 300
                    });
                    $('#editModal').modal('hide')
                    getList();
                } else {
                    bootoast.toast({
                        message: res.msg,
                        type: 'dangerous',
                        position: 'top',
                        timeout: 2,
                        animationDuration: 300
                    });
                }
            },
            error: function (err) {
                console.log('error!!!',err);
            }
        })
    } else {// 编辑
        var data = $("form").serialize();
        data = "id=" + id + "&" + data + "&img=" + $("#photo").attr("src");
        $.ajax({
            url: "/edit",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    bootoast.toast({
                        message: res.msg,
                        type: 'success',
                        position: 'top',
                        icon: null,
                        timeout: 2,
                        animationDuration: 300,
                        dismissible: false
                    });
                    $('#editModal').modal('hide')
                    getList();
                } else {
                    bootoast.toast({
                        message: res.msg,
                        type: 'dangerous',
                        position: 'top',
                        icon: null,
                        timeout: 2,
                        animationDuration: 300,
                        dismissible: false
                    });
                }
            }
        })
    }
});

