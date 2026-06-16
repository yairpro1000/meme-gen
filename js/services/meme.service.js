'use strict'

var gMeme = _createMeme(0)

function getMeme() {
    return gMeme
}

function addLine(elCanvas) {
    const newLine = structuredClone(_createMeme().lines[0])
    newLine.startX = elCanvas.width / 2
    newLine.bottom = elCanvas.height / 2
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx--
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

function setLineDrag(isDrag) {
    gMeme.isLineDrag = isDrag
}

function setLineResizeState(isResize) {
    gMeme.isLineResize = isResize
}

function getHoveredLine(pos, isMouseDown) {
    const hoveredLineIdx = getMeme().lines.findIndex(line =>
        pos.x >= line.boxStartX - 15 && pos.x <= line.endX + 5 &&
        pos.y >= line.top - 25  && pos.y <= line.bottom + 5)

    if (hoveredLineIdx === -1) return null

    if (isMouseDown) setSelectedLineIdx(hoveredLineIdx)
        
    return gMeme.lines[hoveredLineIdx]
}

function isNWpoint(pos) {
    const line = getHoveredLine(pos)
    console.log(line)
    return pos.x >= line.boxStartX - 15 && pos.x <= line.boxStartX + 15 &&
        pos.y >= line.top - 25 && pos.y <= line.top + line.height * 15
}

// Move the line by a delta from the pervious pos

function moveLine(dx, dy) {
    const line = getSelectedLine()
    line.startX += dx
    line.boxStartX += dx
    line.endX += dx
    line.top += dy
    line.bottom += dy
}

function setLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setFontSize(newSizeRatio) {
    if (newSizeRatio < 0.04) return // Avoid extremely small
    gMeme.lines[gMeme.selectedLineIdx].sizeRatio = newSizeRatio
}

function setLineStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setLineFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color
}

function setLineFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily
}

function setLineFontStyle(fontStyle) {
    if (fontStyle === 'underline') {
        gMeme.lines[gMeme.selectedLineIdx].isUnderline = !gMeme.lines[gMeme.selectedLineIdx].isUnderline
        return
    }
    const currStyle = gMeme.lines[gMeme.selectedLineIdx].fontStyle
    const newStyle = fontStyle === currStyle? 'normal' : fontStyle
    gMeme.lines[gMeme.selectedLineIdx].fontStyle = newStyle
}

function setLineTextAlign(textAlign) {
    gMeme.lines[gMeme.selectedLineIdx].textAlign = textAlign
}

function setLineStartX(elCanvas, ctx) {
    const line = getSelectedLine()
    switch (line.textAlign) {
        case 'right': 
        line.startX = elCanvas.width - line.width / 2 - 10
        break

        case 'left': 
        line.startX = line.width / 2 + 10
        break

        default: line.startX = elCanvas.width / 2
    }

    setLineProportions(gMeme.selectedLineIdx, ctx, elCanvas)
}


function setLineProportions(idx, ctx, elCanvas) {
    const line = gMeme.lines[idx]
    
    const size = Math.ceil(line.sizeRatio * elCanvas.width)
    gCtx.font = `${line.fontStyle} ${size}px  ${line.font}`
    const { width, actualBoundingBoxAscent: height } = ctx.measureText(line.txt)

    line.width = Math.min(width, elCanvas.width)
    line.boxStartX = line.startX - line.width / 2
    line.endX = line.boxStartX + line.width
    line.height = height
    line.top = line.bottom - (height + 1)
}

function setMemeImg(imgId) {
    gMeme.selectedImgId = imgId
}

function _createMeme(imgId) {
    return {
    selectedImgId: imgId,
    selectedLineIdx: 0,
    isLineDrag: false,
    isLineResize: false,
    lines: [
        {
            txt: 'Wazzup??',
            textAlign: 'center',
            width: 0,
            startX: 100,
            boxStartX: 0,
            endX: 0,
            height: 0,
            bottom: 100,
            top: 0,
            sizeRatio: .1,
            font: 'poppins-medium',
            fontStyle: 'bold',
            isUnderline: false,
            fillColor: 'white',
            strokeColor: 'red',
        },
    ]
}
}