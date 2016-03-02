/**
 * Created by 冷色的咖啡 on 2016/3/1.
 */

'use strict';


/**
 * WeUI对话框
 * @param title 提示框标题
 * @param content 提示框内容
 * @constructor
 *  ok：点击确定后的回调
 *  cancel: 点击取消后的回调
 */

// 询问（包含确定-取消）
function WeConfirm(title, content) {
    title = title || "弹出标题";
    content = content || "自定义弹窗内容，居左对齐显示，告知需要确认的信息等";

    this.id = "wx"+Math.random().toString().replace("0.", "");
    var element = '<div class="weui_dialog_confirm" id="'+this.id+'" style="display: none;">'+
        '        <div class="weui_mask"></div>'+
        '        <div class="weui_dialog">'+
        '            <div class="weui_dialog_hd"><strong class="weui_dialog_title">'+title+'</strong></div>'+
        '            <div class="weui_dialog_bd">'+content+'</div>'+
        '            <div class="weui_dialog_ft">'+
        '                <a href="javascript:;" class="weui_btn_cancel weui_btn_dialog default">取消</a>'+
        '                <a href="javascript:;" class="weui_btn_ok weui_btn_dialog primary">确定</a>'+
        '            </div>'+
        '        </div>'+
        '    </div>';

    this.body = $("body");

    this.body.append(element);
    this.self = $("#"+this.id);

    var _this = this;

    if(this.self.length !== 1){
        throw "发生了一个严重错误， 对话框没有正确被插入到body尾部";
    }

    this.okBtn = this.self.find(".weui_btn_ok");
    this.cancelBtn = this.self.find(".weui_btn_cancel");

    this.okBtn.click(function () {
        _this.hide();
        if(_this.okCallback){
            _this.okCallback.call(_this);
        }
    });

    this.cancelBtn.click(function () {
        _this.hide();
        if(_this.cancelCallback){
            _this.cancelCallback.call(_this);
        }
    });

    // 开启对话框唯一性， 其他对话框的打开会关闭非当前对话框
    this.body.on("weui_dialog_show", function (event, _id) {
        if(_this.id !== _id){
            _this.hide();
        }
    });


    this.show();
}
WeConfirm.prototype = {
    show: function () {
        this.self.show();
        this.body.trigger("weui_dialog_show", this.id);
    },
    hide: function () {

        this.self.hide().remove();
        this.body.off("weui_dialog_show");
    },
    ok: function (callback) {
        if(typeof callback !== "function") return;
        this.okCallback = callback;

        return this;
    },
    cancel: function (callback) {
        if(typeof callback !== "function") return;
        this.cancelCallback = callback;

        return this;
    }
};

// 信息提示（只有确定）
function WeAlert(title, content) {
    title = title || "弹出标题";
    content = content || "弹窗内容，告知当前页面信息等";

    this.id = "wx"+Math.random().toString().replace("0.", "");
    var element = '<div class="weui_dialog_alert" id="'+this.id+'" style="display: none;">'+
        '        <div class="weui_mask"></div>'+
        '        <div class="weui_dialog">'+
        '            <div class="weui_dialog_hd"><strong class="weui_dialog_title">'+title+'</strong></div>'+
        '            <div class="weui_dialog_bd">'+content+'</div>'+
        '            <div class="weui_dialog_ft">'+
        '                <a href="javascript:;" class="weui_btn_ok weui_btn_dialog primary">确定</a>'+
        '            </div>'+
        '        </div>'+
        '    </div>';

    this.body = $("body");

    this.body.append(element);
    this.self = $("#"+this.id);

    var _this = this;

    if(this.self.length !== 1){
        throw "发生了一个严重错误， 对话框没有正确被插入到body尾部";
    }

    this.okBtn = this.self.find(".weui_btn_ok");
    this.cancelBtn = this.self.find(".weui_btn_cancel");

    this.okBtn.click(function () {
        _this.hide();
        if(_this.okCallback){
            _this.okCallback.call(_this);
        }
    });

    this.cancelBtn.click(function () {
        _this.hide();
        if(_this.cancelCallback){
            _this.cancelCallback.call(_this);
        }
    });


    // 开启对话框唯一性， 其他对话框的打开会关闭非当前对话框
    this.body.on("weui_dialog_show", function (event, _id) {
        if(_this.id !== _id){
            _this.hide();
        }
    });

    this.show();
}
WeAlert.prototype = WeConfirm.prototype;

/**
 * 提示框代理
 * 只会创建一次dom元素， 然后返回元素id
 * 存在直接返回元素id
 */
var WeToastProxy = (function () {
    var hasCreateLoadingDom = false;
    var id = null;


    return function () {
        if(!hasCreateLoadingDom){
            id = "wx"+Math.random().toString().replace("0.", "");
            var element = '<div id="'+id+'" style="display: none;">'+
                '        <div class="weui_mask_transparent"></div>'+
                '        <div class="weui_toast">'+
                '            <i class="weui_icon_toast"></i>'+
                '            <p class="weui_toast_content">已完成</p>'+
                '        </div>'+
                '    </div>';
            $("body").append(element);
            hasCreateLoadingDom = true;
        }

        return id;
    }
})();

/**
 * 已完成提示
 * @constructor
 */
function WeToast() {

    // 元素id由代理去返回
    var id = WeToastProxy();

    this.self = $("#"+id);

    //定时器
    this.timeHandle = null;

    this.show();
}
WeToast.prototype = {
    show: function () {
        var _this = this;
        this.self.show();
        clearTimeout(this.timeHandle);

        this.timeHandle = setTimeout(function () {
            _this.hide();
        }, 2000);
    },
    hide: function () {
        this.self.hide();
    }
};

var WeLoadingProxy = (function () {
    var hasCreateLoadingDom = false;
    var id = null;
    return function () {
        if(!hasCreateLoadingDom){
            id = "wx"+Math.random().toString().replace("0.", "");
            var element = '<div id="'+id+'" class="weui_loading_toast" style="display: none;">'+
                '        <div class="weui_mask_transparent"></div>'+
                        '<div class="weui_toast">'+
                        '            <div class="weui_loading">'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                        '                <div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                        '            </div>'+
                        '            <p class="weui_toast_content">数据加载中</p>'+
                        '        </div>'+
                '    </div>';
            $("body").append(element);
            hasCreateLoadingDom = true;
        }

        return id;
    }
})();

/**
 * 加载提示
 * @constructor
 */
function WeLoading() {

    // 元素id由代理去返回
    var id = WeLoadingProxy();

    this.self = $("#"+id);

    //定时器
    this.timeHandle = null;

    // 重写show函数
    this.show = function () {
        this.self.show();
    };

    this.show();
}
WeLoading.prototype = WeToast.prototype;


/**
 * ActionSheet提示框
 * @param selector 选择器
 * @param enableCancel 是否启用取消按钮
 * @constructor
 * 因为涉及到自定义内容区块，所以需要先加载模版，模版的css选择器不能依赖于父级元素，否则可能不生效
 */
function ActionSheet(selector, enableCancel){
    var element,
        contentElement,
        cancelElement, // 取消元素
        _this = this
        ;

    //默认不自动添加取消按钮
    enableCancel = enableCancel || false;

    this.id = "wx"+Math.random().toString().replace("0.", "");

    contentElement = $(selector);

    if(selector == undefined){
        throw "参数丢失， 你必须传递模版元素的选择器";
    }
    if(contentElement.length !== 1){
        throw "没有找到模版元素， 请检查选择器是否正确： '"+selector+"'";
    }

    cancelElement = enableCancel ? '<div class="weui_actionsheet_action">'+
                            '            <div class="weui_actionsheet_cell actionsheet_cancel">取消</div>'+
                            '       </div>' : "";

    element = '<div id="'+this.id+'" style="display: none">'+
        '    <div class="weui_mask_transition weui_fade_toggle mask" style="display: block"></div>'+
        '    <div class="weui_actionsheet">'+
        '        <!--内容块-->'+
                contentElement.html()+
                cancelElement+
        '    </div>'+
        '</div>';

    contentElement.remove();
    contentElement = null;

    this.body = $("body");
    this.body.append(element);

    this.self = $("#"+this.id);

    this.mask = this.self.find(".mask");
    this.sheet = this.self.find(".weui_actionsheet");
    this.cancelBtn = this.self.find(".actionsheet_cancel");



    this.cancelBtn.on('click', function () {
        _this.hide();
    });
}

ActionSheet.prototype = {
    show: function () {
        var _this = this;

        this.self.show();
        this.mask.on('transitionend webkitTransitionEnd');
        this.mask.show().addClass("weui_fade_toggle").one("click", function () {
            _this.hide();
        });
        this.sheet.addClass("weui_actionsheet_toggle");
    },
    hide: function () {
        //this.self.hide();
        var _this = this;
        this.mask.on('transitionend webkitTransitionEnd', function () {
            _this.mask.hide();
        });
        this.mask.removeClass("weui_fade_toggle");
        this.sheet.removeClass("weui_actionsheet_toggle");
    }
};


/*WeLoading.prototype.show = function () {
    this.self.show();
};*/

/*var note = new WeConfirm("提示", "我是一个对话框");
note.ok(function () {
    console.info("HaHa! 我知道你点击了确定");
}).cancel(function () {
    console.warn("HaHa! 我知道你点击了取消");
});*/

/*var a = new WeAlert("提示", "帐号或者密码错误");
a.ok(function () {
   console.log("你是一个信息框， 点击了确定");
});*/

//var toast = new WeToast();

/*
var loading = new WeLoading();
setTimeout(function () {
    loading.hide();
}, 3000);*/
