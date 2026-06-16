'use strict'

let gKeyword = ''
let gFilter = ''
let gIsMore = false

function renderGallery() {
    renderKeywords()

    const images = getImages(gKeyword, gFilter)
    var imagesStr = ``

    const imgStrs = images.map(({ id, url }) => {
        return `<div class="img-container"><img src="${url}" alt="img-${id}" onclick="onImgSelect(${id})"></div>`
    })

    const elGalleryCtnr = document.querySelector('.gallery-container')
    elGalleryCtnr.innerHTML = imgStrs.join('')
}

function renderKeywords() {
    const numKeywords = gIsMore ? Infinity : 5
    const sizes = getKeyword2Size().slice(0, numKeywords)
    const sizesStrs = sizes.map(sizeMap => {
        const keyword = sizeMap[0]
        const emSize = sizeMap[1]
        return `<a href="#" class="keyword" style="font-size: ${emSize}em" onclick="onSelectKeyword('${keyword}')">${keyword}</a>`
    })

    const elKeywords = document.querySelector('.gallery-keywords')
    elKeywords.innerHTML = sizesStrs.join('')

}

function onFilter(filter) {
    gFilter = filter
    gKeyword = ''

    renderGallery()
}

function onSelectKeyword(keyword) {
    gFilter = ''
    document.querySelector('.keyword-search').value = keyword

    gKeyword = keyword
    increaseKeywordCount(keyword)

    renderGallery()
}

function onMore() {
    gIsMore = !gIsMore
    renderKeywords()
}