'use strict'

var gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'politics'] },
    { id: 2, url: 'images/2.jpg', keywords: ['funny', 'politics'] },
    { id: 3, url: 'images/3.jpg', keywords: ['funny', 'politics'] },
]


function getImages(keyword = '') {
    if (keyword) return gImgs.filter(img => img.keywords.includes(keyword))
    
    return gImgs
}

function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}
