
$(document).on("pagecreate",".main",function(){
	$(".list li").on("swipeleft",function(){
		$(this).animate({marginLeft:'-6.4rem'});
		$(this).find('a.edit').animate({right:'7.6rem'});
		$(this).find('.delete').animate({right:'0rem'});
	});
	$(".list li").on("swiperight",function(){
		$(this).animate({marginLeft:'0rem'});
		$(this).find('a.edit').animate({right:'1.2rem'});
		$(this).find('.delete').animate({right:'-6.4rem'});
	});
});

$(function() {
    $('li .delete').click(function(){
        $(this).parents('li').remove();
    });
});

