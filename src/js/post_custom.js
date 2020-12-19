import $ from 'jquery'

/**
* Function that captures a click on an outbound link in Analytics.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label. Setting the transport method to 'beacon' lets the hit be sent
* using 'navigator.sendBeacon' in browser that support it.
*/
var captureOutboundLink = function (url) {
    if (ga) {
        ga('send', 'event', 'outbound', 'click', url, {
            'transport': 'beacon',
            'hitCallback': function () { document.location = url; }
        });
    }
}

$(document).ready(() => {
    $("iframe").each(function () {
        setTimeout(function(element) {
            const src = element.src
            if (src.indexOf("youtube.com") >= 0) {
                if (src.indexOf("?") > 0) {
                    element.src = src + "&autoplay=1"
                } else {
                    element.src = src + "?autoplay=1"
                }
            }
        }, 2000, this)
    })

    $("a").each(function() {
        if (this.href.indexOf("/ingredients/") > 0) {
            $(this).on("click", function() {
                captureOutboundLink(this.href)
                return false
            })
            this.target = "_blank"
            $(this).wrap("<span class='icon-star' aria-hidden='true'></span>")
        }
    })
})
