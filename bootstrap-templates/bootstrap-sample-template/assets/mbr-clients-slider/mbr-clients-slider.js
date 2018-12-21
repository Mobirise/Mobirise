function setActiveCarouselItem(card){
   var $target = $(card).find('.carousel-item:first');
   $target.addClass('active');
} 
function initTestimonialsCarousel(card){
    var $target = $(card),
        $carouselID = $target.attr('ID') +"-carousel"; 
    $target.find('.carousel').attr('id',$carouselID);
    $target.find('.carousel-controls a').attr('href','#'+$carouselID);
    $target.find('.carousel-indicators li').attr('data-target','#'+$carouselID);
    setActiveCarouselItem($target);  
}
function initClientCarousel(card){
    var $target = $(card),
    countElems = $target.find('.carousel-item').length,
    visibleSlides = $target.find('.carousel-inner').attr('data-visible');
    if (countElems < visibleSlides){
        visibleSlides = countElems;
    }
    $target.find('.carousel-inner').attr('class', 'carousel-inner slides' + visibleSlides);
    $target.find('.clonedCol').remove();

    $target.find('.carousel-item .col-md-12').each(function() {
        if (visibleSlides < 2) {
            $(this).attr('class', 'col-md-12');
        } else if (visibleSlides == '5') {
            $(this).attr('class', 'col-md-12 col-lg-15');
        } else {
            $(this).attr('class', 'col-md-12 col-lg-' + 12 / visibleSlides);
        }
    });

    $target.find('.carousel-item').each(function() {
        var itemToClone = $(this);
        for (var i = 1; i < visibleSlides; i++) {
            itemToClone = itemToClone.next();
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }
            var index = itemToClone.index();
            itemToClone.find('.col-md-12:first').clone().addClass('cloneditem-' + i).addClass('clonedCol').attr('data-cloned-index', index).appendTo($(this).children().eq(0));
        }
    });
}
function updateClientCarousel(card){
    var $target = $(card),
        countElems = $target.find('.carousel-item').length,
        visibleSlides = $target.find('.carousel-inner').attr('data-visible');
    if (countElems < visibleSlides){
        visibleSlides = countElems;
    }
    $target.find('.clonedCol').remove();
    $target.find('.carousel-item').each(function() {
        var itemToClone = $(this);
        for (var i = 1; i < visibleSlides; i++) {
            itemToClone = itemToClone.next();
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }
            var index = itemToClone.index();
            itemToClone.find('.col-md-12:first').clone().addClass('cloneditem-' + i).addClass('clonedCol').attr('data-cloned-index', index).appendTo($(this).children().eq(0));
        }
    });
}
function clickHandler(e){
    e.stopPropagation();
    e.preventDefault();

    var $target = $(e.target);
    var curItem;
    var curIndex;

    if ($target.closest('.clonedCol').length) {
        curItem = $target.closest('.clonedCol');
        curIndex = curItem.attr('data-cloned-index');
    } else {
        curItem = $target.closest('.carousel-item');
        curIndex = curItem.index();
    }
    var item = $($target.closest('.carousel-inner').find('.carousel-item')[curIndex]).find('img')[0];
 
    if ($target.parents('.clonedCol').length > 0) {
        item.click();
    }
}

// Mobirise initialization
var isBuilder = $('html').hasClass('is-builder');
if (isBuilder) {
    $(document).on('add.cards', function(event) {
        if (!$(event.target).hasClass('clients')) {
            return;
        }
        initTestimonialsCarousel(event.target);
        initClientCarousel(event.target);
        if (event.type === 'add') {       
            $(event.target).on('slide.bs.carousel', function() {
                updateClientCarousel(event.target);
            });
        }
        $(event.target).find('.carousel-item [mbr-media]').on('click', function(e) {
            clickHandler(e);
        });
        $(event.target).on('slide.bs.carousel', function() {
            $(event.target).find('.carousel-item .clonedCol [mbr-media]').off('click').on('click', function(e) {
                        clickHandler(e);
                    });
        });
    }).on('changeParameter.cards', function(event, paramName,value) {
        if (paramName=='slidesCount'){
            if ($(event.target).find('.carousel-item.active').length==0) {
                setActiveCarouselItem(event.target);
            }                
        }
        initClientCarousel(event.target);
        updateClientCarousel(event.target);
        $(event.target).find('.carousel-item [mbr-media]').on('click', function(e) {
            clickHandler(e);
        });
        $(event.target).on('slide.bs.carousel', function() {
            $(event.target).find('.carousel-item .clonedCol [mbr-media]').off('click').on('click', function(e) {
                        clickHandler(e);
                    });
        });
    }).on('changeContent.cards', function(event,type) {
       updateClientCarousel(event.target);
       try{
        $(event.target).closest('.carousel').carousel('next');
       }catch(err){}
    });
}
else{
    if(typeof window.initClientPlugin === 'undefined'){
        window.initClientPlugin = true;
        $(document.body).find('.clients').each(function(index, el) {
            if(!$(this).attr('data-isinit')){
                initTestimonialsCarousel($(this));
                initClientCarousel($(this));
            }  
        });  
    }
}