'use strict'

function renderGallery(keyword = '') {
    const images = getImages(keyword)
    var imagesStr = ``

    const imgStrs = images.map(({id, url}) => {
        return `<img src="${url}" alt="img-${id}" onclick="onImgSelect(${id})">`
    })

    const elGalleryCtnr = document.querySelector('.gallery-container')
    elGalleryCtnr.innerHTML = imgStrs.join('')
}