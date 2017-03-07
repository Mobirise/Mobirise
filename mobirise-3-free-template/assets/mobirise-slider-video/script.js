(function(){

    function getVideoId(url) {
        if ('false' == url) return false;
        var result = /(?:\?v=|\/embed\/|\.be\/)([-a-z0-9_]+)/i.exec(url) || /^([-a-z0-9_]+)$/i.exec(url);
        return result ? result[1] : false;
    }

    function getPreviewUrl(videoId, quality) {
        return 'https://img.youtube.com/vi/' + videoId + '/' +
            (quality || '') + 'default.jpg';
    }

    var getPreviewUrlWithBestQuality = (function(){
        
        var cache = {};

        return function(id) {
            var def = $.Deferred();
            if (id in cache) {
                if (cache[id]) {
                    def.resolve(cache[id]);
                } else {
                    def.reject('Preview image not found.');
                }
            } else {
                $('<img>').on('load', function(){
                    if (120 == (this.naturalWidth || this.width)) {
                        // selection of preview in the best quality
                        var file = this.src.split('/').pop();
                        switch (file) {
                            case 'maxresdefault.jpg':
                                this.src = this.src.replace(file, 'sddefault.jpg');
                                break;
                            case 'sddefault.jpg':
                                this.src = this.src.replace(file, 'hqdefault.jpg');
                                break;
                            case 'hqdefault.jpg':
                                this.src = this.src.replace(file, 'default.jpg');
                                break;
                            default:
                                cache[id] = null;
                                def.reject('Preview image not found.');
                                break;
                        }
                    } else {
                        def.resolve(cache[id] = this.src);
                    }
                }).attr('src',  getPreviewUrl(id, 'maxres'));
            }
            return def;
        };

    })();

    /*
     * check for youtube video section and
     * load videopreview from youtube on add/change event and enable YTPlayer
     * */
    $(document).on('add.cards change.cards', function(event){
        
        if (!$(event.target).hasClass('mbr-slider')) return;

        var isInit = ('add' == event.type),
            isDesktop = $('html').hasClass('desktop'),
            isBuilder = $('html').hasClass('is-builder');

        $(event.target).outerFind('[data-bg-video-slide]').each(function(){

            if (!isInit) {
                $('.mbr-background-video-preview', this).remove();
            }

            var videoId = getVideoId( $(this).attr('data-bg-video-slide') );
            if (!videoId) return;
                
            var $preview = $('<div class="mbr-background-video-preview"></div>').css({
                display: 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            });
            
            $('.mbr-overlay, .container-slide', this).before($preview);
            
            getPreviewUrlWithBestQuality(videoId).done(function(url){
                $preview.css('background-image', 'url("' + url + '")').show();
            });

            if (isInit && isDesktop && !isBuilder && $.fn.YTPlayer && !$(this).find('.playerBox').length) {
             
                var params = eval('(' + ($(this).attr('data-bg-video-slide-params') || '{}') + ')');
                $('.container-slide', this)
                    .before('<div class="mbr-background-video"></div>').prev()
                    .YTPlayer($.extend({
                        videoURL: videoId,
                        containment: 'self',
                        showControls: false,
                        mute: true
                    }, params));

                var $overlay = $(this).find('.mbr-overlay');
                if ($overlay.length) {
                    $('.YTPOverlay', this).css({
                        opacity: $overlay.css('opacity'),
                        backgroundColor: $overlay.css('background-color')
                    });
                }

            }

        });

        if (isInit) {

            // pause YTPPlayer in hidden slides, apply some css rules
            $(this).on('slide.bs.carousel','section.mbr-slider', function(event){

                $(event.target).find('.carousel-item.active .mb_YTPlayer').each(function(){
                    $(this).YTPPause();
                });

                $(event.target).find('.carousel-item:not(.active) iframe').css('opacity', 0);

            });

            // start YTPPlayer in active slides, apply some css rules
            $(this).on('slid.bs.carousel','section.mbr-slider', function(event){
                
                $(event.target).find('.carousel-item.active .mb_YTPlayer').each(function(){
                    $(this).YTPPlay();
                });

                $(event.target).find('.carousel-item.active iframe').resize().css('opacity', 1);

            });

        }

    });

})();