'use strict'

var gImgs = [
    { id: 0, url: '', keywords: [] },
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'politics'] },
    { id: 2, url: 'images/2.jpg', keywords: ['clever', 'funny', 'sarcastic', 'woman', 'smile'] },
    { id: 3, url: 'images/3.jpg', keywords: ['cure', 'animal'] },
    { id: 4, url: 'images/4.jpg', keywords: ['baby', 'strong', 'brave'] },
    { id: 5, url: 'images/5.jpg', keywords: ['cute', 'animal'] },
    { id: 6, url: 'images/6.jpg', keywords: ['woman', 'politics', 'comic'] },
    // { id: 7, url: 'images/7.jpg', keywords: ['comic'] },
    { id: 8, url: 'images/8.jpg', keywords: ['animal', 'cute'] },
    { id: 9, url: 'images/9.jpg', keywords: ['woman', 'comic', 'funny', 'smile', 'movie'] },
    { id: 10, url: 'images/10.jpg', keywords: ['animal', 'cute'] },
    { id: 11, url: 'images/11.jpg', keywords: ['movie', 'man'] },
    // { id: 12, url: 'images/12.jpg', keywords: ['Men'] },
    { id: 13, url: 'images/13.jpg', keywords: ['baby'] },
    { id: 14, url: 'images/14.jpg', keywords: ['comic', 'movie', 'strong'] },
    { id: 15, url: 'images/15.jpg', keywords: ['comic', 'smile'] },
    { id: 16, url: 'images/16.jpg', keywords: ['baby', 'smile'] },
    { id: 17, url: 'images/17.jpg', keywords: ['politics', 'smile'] },
    { id: 18, url: 'images/18.jpg', keywords: ['man', 'movie'] },
]

var gKeywordSearchCountMap = {
    funny: 7,
    animal: 1,
    smile: 9,
    politics: 3,
    baby: 20,
    comic: 15,
    cute: 10,
    strong: 2,
    angry: 6,
    man: 4,
    brave: 3, 
    woman: 8,
    movie: 7,
    sarcastic: 2,
    classic: 10
}

function getKeyword2Size() {
    let sizes = []
    for (let k in gKeywordSearchCountMap) {
        let size = Math.min(1 + gKeywordSearchCountMap[k] / 10, 2.5)
        sizes.push([k, size])
    }
    return sizes
}

function increaseKeywordCount(keyword) {
    gKeywordSearchCountMap[keyword]++
}

function getImages(keyword = '', filter = '') {
    if (filter) {
        return gImgs.slice(1).filter(img => img.keywords.some(k => k.includes(filter.toLowerCase())))
    }
    if (keyword) return gImgs.slice(1).filter(img => img.keywords.includes(keyword))

    return gImgs.slice(1)
}

function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getSelectedImgUrl() {
    return gImgs.find(img => img.id === getMeme().selectedImgId).url
}

function setUserImg(dataUrl) {
    gImgs[0].url = dataUrl
}