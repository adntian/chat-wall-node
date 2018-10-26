
$(document).ready(function () {

    // fullpage customization
    $('#fullpage').fullpage({
        sectionsColor: ['#B8AE9C', '#348899'],//为每个section设置background-color属性
        sectionSelector: '.vertical-scrolling',
        slideSelector: '.horizontal-scrolling',
        navigation: true, //是否显示导航，默认为false
        navigationPosition: 'right',//导航小圆点的位置
        navigationTooltips: ['签到', '抽奖'],//导航小圆点的提示
        slidesNavigation: false,//是否显示横向幻灯片的导航，默认为false
        css3: true,//是否使用CSS3 transforms来实现滚动效果，默认为true
        controlArrows: false,//定义是否通过箭头来控制slide,默认true
        verticalCentered: false,
        keyboardScrolling: true,//是否可以使用键盘方向键导航，默认为true

        //events
        onLeave: function (index, nextIndex, direction) { },
        afterLoad: function (anchorLink, index) { },
        afterRender: function () { },
        afterResize: function () { },
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) { },
        onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) { }
    });
});