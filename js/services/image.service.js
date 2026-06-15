'use strict'

var gImgs = [
    { id: 0, url: '', keywords: [] },
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'politics'] },
    { id: 2, url: 'images/2.jpg', keywords: ['funny', 'politics'] },
    { id: 3, url: 'images/3.jpg', keywords: ['funny', 'politics'] },
    { id: 4, url: 'images/4.jpg', keywords: ['Animal'] },
    { id: 5, url: 'images/5.jpg', keywords: ['Men'] },
    // { id: 6, url: 'images/6.jpg', keywords: ['Women'] },
    // { id: 7, url: 'images/7.jpg', keywords: ['comic'] },
    { id: 8, url: 'images/8.jpg', keywords: ['smile'] },
    // { id: 9, url: 'images/9.jpg', keywords: ['Animal'] },
    // { id: 10, url: 'images/10.jpg', keywords: ['reaction'] },
    { id: 11, url: 'images/11.jpg', keywords: ['movie'] },
    // { id: 12, url: 'images/12.jpg', keywords: ['Men'] },
    { id: 13, url: 'images/13.jpg', keywords: ['Women'] },
    { id: 14, url: 'images/14.jpg', keywords: ['comic'] },
    { id: 15, url: 'images/15.jpg', keywords: ['smile'] },
    { id: 16, url: 'images/16.jpg', keywords: ['sarcastic'] },
    { id: 17, url: 'images/17.jpg', keywords: ['Animal'] },
    { id: 18, url: 'images/18.jpg', keywords: ['classic'] },
]

var gKeywordSearchCountMap = {
    funny: 7,
    politics: 3,
    comic: 21,
    cute: 10,
    strong: 2,
    angry: 6,
    Animal: 1,
    Men: 4,
    Women: 8,
    smile: 9,
    reaction: 5,
    movie: 7,
    sarcastic: 2,
    classic: 10
}

function getKeyword2Size() {
    let sizes = []
    for (let k in gKeywordSearchCountMap) {
        let size = Math.min(1 + gKeywordSearchCountMap[k] / 10, 3)
        sizes.push([k, size])
    }
    return sizes
}

function getImages(keyword = '') {
    if (keyword) return gImgs.slice(1).filter(img => img.keywords.includes(keyword))

    return gImgs.slice(1)
}

function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setUserImg(dataUrl) {
    gImgs[0].url = dataUrl
}