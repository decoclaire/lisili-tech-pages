//是否显示导航栏（固定为显示，无折叠）
var showNavBar = true;

$(document).ready(function(){
    // 明确标题层级：h3=一级目录（如“基本信息”），h4=二级目录（如“主持科研项目”）
    var vH1Tag = 'h3'; // 一级目录（需加粗）
    var vH2Tag = 'h4'; // 二级目录（淡黑色）

    // 初始化序号计数器（仅用于生成唯一ID）
    var vH1Index = 0;
    var vH2Index = 0;

    // 生成目录容器（无“目录”文字，无折叠按钮）
    $("body").prepend(`
        <div class="BlogAnchor">
            <p class="html_header"></p> <!-- 空标题栏，无文字 -->
            <div class="AnchorContent" id="AnchorContent"></div>
        </div>
    `);

    // 遍历标题生成目录（仅h3和h4，确保层级清晰）
    $("body").find(`${vH1Tag},${vH2Tag}`).each(function(i, item){
        var $item = $(item);
        var tag = $item.get(0).tagName.toLowerCase();
        var id = '';
        var className = '';

        // 生成唯一ID（确保跳转目标唯一）
        if (tag === vH1Tag) {
            vH1Index++;
            vH2Index = 0;
            id = `dir_1_${vH1Index}`;
            className = 'item_h1'; // 一级目录（加粗）
        } else if (tag === vH2Tag) {
            vH2Index++;
            id = `dir_2_${vH1Index}_${vH2Index}`;
            className = 'item_h2'; // 二级目录（淡黑色）
        }

        // 给页面标题添加锚点ID
        $item.attr("id", id).addClass("wow_head");

        // 生成目录项（无多余元素）
        $("#AnchorContent").append(`
            <li>
                <a class="nav_item ${className} anchor-link" href="#${id}">
                    ${$item.text().trim()}
                </a>
            </li>
        `);
    });

    // 目录点击跳转（避开顶部navbar，定位中上）
    $(".anchor-link").click(function(e){
        e.preventDefault();
        var targetId = $(this).attr("href");
        // 验证目标存在（避免跳转失效）
        if ($(targetId).length === 0) return;
        
        var bannerHeight = $(".navbar").outerHeight() || 80; // 横幅高度
        var finalTop = $(targetId).offset().top - bannerHeight - ($(window).height()/60);
        finalTop = Math.max(finalTop, 0); // 防止滚到页面外
        $("html,body").animate({scrollTop: finalTop}, 500);
    });

    // 滚动时目录高亮（当前项区分）
    var $navItems = $(".BlogAnchor .nav_item");
    var headerTops = [];
    $(".wow_head").each(function(){
        headerTops.push($(this).offset().top - 30); // 提前触发高亮
    });

    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
        $.each(headerTops, function(i, top){
            if (scrollTop < top) {
                $navItems.removeClass("current");
                $navItems.eq(i).addClass("current");
                return false;
            }
        });
    });

    // 核心样式：层级区分+间距控制（无多余样式）
    $("#AnchorContent").css({
        "max-height": $(window).height() - 100 + "px", // 最大化显示数量
        "padding-left": "0",
        "margin": "0",
        "overflow-y": "auto", // 超出滚动
        "overflow-x": "hidden" // 禁止水平滚动
    });
    $("#AnchorContent li").css({
        "margin": "3px 0", // 紧凑间距
        "padding": "0",
        "list-style": "none",
        "white-space": "nowrap", // 禁止文本换行
        "text-overflow": "ellipsis", // 超长文本省略
        "overflow": "hidden"
    });
    // 一级目录：加粗+深黑
    $(".nav_item.item_h1").css({
        "padding": "2px 0",
        "text-decoration": "none",
        "color": "#333", // 深黑色
        "font-weight": "bold", // 加粗
        "font-size": "14px"
    });
    // 二级目录：淡黑+缩进
    $(".nav_item.item_h2").css({
        "padding": "2px 0 2px 12px", // 仅左侧缩进12px
        "text-decoration": "none",
        "color": "#666", // 淡黑色（区分一级）
        "font-size": "13px"
    });
    // 当前项高亮（统一样式）
    $(".nav_item.current").css({
        "color": "#4183C4", // 高亮色（区分普通项）
        "font-weight": "normal" // 二级当前项不额外加粗
    });

    // 隐藏原有冗余目录
    $(".md-toc").hide();
});

// 窗口 resize 时调整目录高度
$(window).resize(function() {
    $("#AnchorContent").css("max-height", $(window).height() - 100 + "px");
});