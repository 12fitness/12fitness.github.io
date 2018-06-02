(function($) {
    "use strict"; // Start of use strict
    $(function($, undefined){ // attach callback to run onready

        // Floating label headings for the contact form
        $("body").on("input propertychange", ".floating-label-form-group", function(e) {
            $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
        }).on("focus", ".floating-label-form-group", function() {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function() {
            $(this).removeClass("floating-label-form-group-with-focus");
        });

        // Show the navbar when the page is scrolled up
        var MQL = 992;

        //primary navigation slide-in effect
        if ($(window).width() > MQL) {
            var headerHeight = $('#mainNav').height();
            $(window).on('scroll', {
                previousTop: 0
            },
                         function() {
                             var currentTop = $(window).scrollTop();
                             //check if user is scrolling up
                             if (currentTop < this.previousTop) {
                                 //if scrolling up...
                                 if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
                                     $('#mainNav').addClass('is-visible');
                                 } else {
                                     $('#mainNav').removeClass('is-visible is-fixed');
                                 }
                             } else if (currentTop > this.previousTop) {
                                 //if scrolling down...
                                 $('#mainNav').removeClass('is-visible');
                                 if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
                             }
                             this.previousTop = currentTop;
                         });
        }
        if ($("#videos").length) {
            function youtube_url(page_token) {
                var max_results = 20;
                var playlist_id = "UUwHV5gf8CLIWpXO8lAd7Pyw";
                var key = "AIzaSyAABUFFzJNte5YIUuQnJ20GWPLMI1zvqwc";
                var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet";
                url += "&maxResults=" + max_results;
                url += "&playlistId=" + playlist_id;
                url += "&key=" + key;
                if (page_token) {
                    url += "&pageToken=" + page_token;
                }
                return url;
            }
            function processResponse(data) {
                // Clean out content.
                var videos = $('#videos');
                videos.html('');
                videos.siblings('.pager').remove();

                // Add each video to the list.
                $.each(data.items, function(index, item) {
                    var video = $('<li>', {class: 'video'});
                    var link = $('<a>', {href: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId});
                    video.append(link);
                    link.append($('<img>', {src: item.snippet.thumbnails.medium.url}));
                    var header = $('<header>');
                    header.append($('<h1>').text(item.snippet.title));
                    link.append(header);
                    link.append($('<time>', {
                        datetime: item.snippet.publishedAt,
                        class: 'timeago'
                    }).text(item.snippet.publishedAt));
                    videos.append(video);
                });

                var pager = $('<div>', {class:'clearfix pager'});
                videos.after(pager);
                if (data.hasOwnProperty('prevPageToken')) {
                    pager.append($('<a>', {
                        class: 'btn btn-primary float-right',
                        href: '#videos'
                    }).text("Newer →").click(function (e) {
                        e.preventDefault();
                        $.getJSON(youtube_url(data.prevPageToken), processResponse);
                    }));
                }
                if (data.hasOwnProperty('nextPageToken')) {
                    pager.append($('<a>', {
                        class: 'btn btn-primary float-left',
                        href: '#videos'
                    }).text("← Older").click(function(e) {
                        e.preventDefault();
                        $.getJSON(youtube_url(data.nextPageToken), processResponse);
                    }));
                }
                $("time.timeago").timeago();
            }
            // Populate videos section of the site.
            $.getJSON(youtube_url(), processResponse);
        }
        $("time.timeago").timeago();
    });
})(jQuery); // End of use strict
