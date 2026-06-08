'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {   
            startX: 100,
            startY: 50,
            endX: 0,
            endY: 0,
            txt: 'I sometimes eat Falafel',
            size: 30,
            font: 'serif',
            fontStyle: 'bold',
            fillColor: 'white',
            strokeColor: 'red',
        },
        {   
            startX: 100,
            startY: 150,
            endX: 0,
            endY: 0,
            txt: 'I sometimes eat Falafel too',
            size: 40,
            font: 'arial',
            fontStyle: 'italic',
            fillColor: 'blue',
            strokeColor: 'white',
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function setLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
    console.log(imgId)
    gMeme.selectedImgId = imgId
}