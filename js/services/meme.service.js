'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: -1,
    lines: [
        {   
            txt: 'I sometimes\neat Falafel',
            width: 0,
            startX: 10,
            endX: 0,
            height: 0,
            bottom: 50,
            top: 0,
            size: 30,
            font: 'serif',
            fontStyle: 'bold',
            fillColor: 'white',
            strokeColor: 'red',
        },
        {   
            txt: 'Hello',
            width: 0,
            startX: 20,
            endX: 0,
            height: 0,
            bottom: 150,
            top: 0,
            size: 40,
            font: 'arial',
            fontStyle: 'italic',
            strokeColor: 'white',
            fillColor: 'blue',
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function addLine() {
    const newLine = structuredClone(gMeme.lines[gMeme.selectedLineIdx])
    newLine.txt = 'Say Whay??'
    newLine.startX = 10
    newLine.startY = 10
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function getSelectedLine() {
    if (gMeme.selectedLineIdx === -1) return null
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

function nextLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function setLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setLineStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setLineFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color
}

function setLineProportions(idx, lineProportions, elCanvas) {
    const {width, actualBoundingBoxAscent: height} = lineProportions
    const line = gMeme.lines[idx]
    line.width = Math.min(width, elCanvas.width)
    line.endX = line.startX + line.width
    line.height = height
    line.top = line.bottom - (height + 1)
}

function setImg(imgId) {
    console.log(imgId)
    gMeme.selectedImgId = imgId
}