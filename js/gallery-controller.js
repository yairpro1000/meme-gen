'use strict'

let gKeyword = ''

function renderGallery(gKeyword) {
    const images = getImages(gKeyword)
    var imagesStr = ``

    const imgStrs = images.map(({id, url}) => {
        return `<div class="img-container"><img src="${url}" alt="img-${id}" onclick="onImgSelect(${id})"></div>`
    })

    const elGalleryCtnr = document.querySelector('.gallery-container')
    elGalleryCtnr.innerHTML = imgStrs.join('')
}

function renderKeywords(numKeywords) {
    const sizes = getKeyword2Size().slice(0, numKeywords)
    const sizesStrs = sizes.map(sizeMap => {
        const keyword = sizeMap[0]
        const emSize = sizeMap[1]
        return `<span class="keyword" style="font-size: ${emSize}em">${keyword}</span>`
    })
    
    const elKeywords = document.querySelector('.gallery-keywords')
    elKeywords.innerHTML = sizesStrs.join('')
    
}

