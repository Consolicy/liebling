import $ from 'jquery'
import $redirects from './redirects.json'

const $ingredients = $redirects.map((r) => {
    const regex = new RegExp(r.regex, 'gmi')
    return { regex, from: r.from }
})

$(document).ready(() => {
    $('iframe').each(function () {        
        setTimeout(function(element) {
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

    $('#ingredients').siblings('ol, ul').first().find('li').each(function() {
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
