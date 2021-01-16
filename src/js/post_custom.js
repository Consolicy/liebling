import $ from 'jquery'
import $redirects from './redirects.json'

/**
* Function that captures a click on an outbound link in Analytics.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label. Setting the transport method to 'beacon' lets the hit be sent
* using 'navigator.sendBeacon' in browser that support it.
*/
var captureOutboundLink = function (url) {
    const canCapture = !!(window['google_tag_manager'])
    if (canCapture) {
        gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': url,
            'transport_type': 'beacon',
            'event_callback': function () { window.open(url, "_blank"); }
        })
    }

    return canCapture
}

const $ingredients = $redirects.map((r) => {
    const regex = new RegExp(r.regex, 'gmi')
    return { regex, from: r.from }
})

$(document).ready(() => {
    $('iframe').each(function () {
        setTimeout(function (element) {
            const src = element.src
            if (src.indexOf('youtube.com') >= 0) {
                if (src.indexOf('?') > 0) {
                    element.src = src + '&autoplay=1'
                } else {
                    element.src = src + '?autoplay=1'
                }
            }
        }, 2000, this)
    })

    $('#ingredients').siblings('ol, ul').first().find('li').each(function () {
        const text = $(this).text()
        for (const { regex, from } of $ingredients) {
            const match = regex.exec(text)
            if (match) {
                const before = text.substr(0, regex.lastIndex - match[0].length)
                const ingredient = text.substr(regex.lastIndex - match[0].length, match[0].length)
                const after = text.substr(regex.lastIndex)
                const anchor = $('<a></a>', {
                    href: from,
                    target: '_blank'
                })
                anchor.text(ingredient)
                anchor.on('click', function () {
                    return !captureOutboundLink(this.href)
                })

                const span = $('<span class="icon-star" aria-hidden="true"></span>')
                span.append(anchor)

                $(this).text('')
                $(this).append(before)
                $(this).append(span)
                $(this).append(after)

                break
            }
        }
    })
})
