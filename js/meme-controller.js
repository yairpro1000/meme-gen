'use strict'

let gElCanvas
let gCtx

let gCurrPos
// let gIsMouseDown = false
let gIsLineSelected = false

const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()
    addListeners()
    // renderMeme()

    renderGallery()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    // Save the position we started from...
    // Get the event position from mouse or touch
    gCurrPos = getEvPos(ev)


    const clickedLine = getHoveredLine(gCurrPos, true)

    if (!clickedLine) return

    if (isNWpoint(gCurrPos)) {
        setLineResizeState(true)
        document.body.style.cursor = 'nwse-resize'
    }
    else {
        setLineDrag(true)
        document.body.style.cursor = 'grabbing'
    }

    onSelectLine()
}

function onMove(ev) {
    const pos = getEvPos(ev)

    const { isLineDrag, isLineResize } = getMeme()
    if (!isLineDrag && !isLineResize) {
        // Change cursor if line hovered
        const hoveredLine = getHoveredLine(pos)

        if (!hoveredLine) {
            document.body.style.cursor = 'auto'
            return
        }
        if (isNWpoint(pos)) document.body.style.cursor = 'nwse-resize'
        else document.body.style.cursor = 'grab'
        return
    }


    // Calc the delta, the diff we moved
    const dx = pos.x - gCurrPos.x
    const dy = pos.y - gCurrPos.y

    if (isLineResize) onChangeFontSize(-(dx + dy), 'pixel')
    else moveLine(dx, dy)


    // Save the last pos, we remember where we`ve been and move accordingly
    gCurrPos = pos

    // The canvas is rendered again after every move
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    setLineResizeState(false)
    document.body.style.cursor = 'auto'
}

function getEvPos(ev) {
    // Check if it is a touch event
    if (TOUCH_EVENTS.includes(ev.type)) {
        ev.preventDefault() // Stop double-firing mouse fallback events

        const touch = ev.targetTouches[0]

        // Get the absolute position of the canvas on the screen
        const rect = gElCanvas.getBoundingClientRect()

        // Subtract canvas screen coordinates from touch screen coordinates
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        }
    } else {
        // Desktop mouse tracking stays lightweight
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}

//// CANVAS

function resizeCanvas() {
    gElCanvas.width = 0
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth

    const { lines, selectedLineIdx } = getMeme()
    getMeme().lines.forEach((line, idx) => {
        setSelectedLineIdx(idx)
        setLineStartX(gElCanvas, gCtx)
    })
    setSelectedLineIdx(selectedLineIdx) //restore
    renderMeme()
}


function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onDownloadCanvas(elLink) {
    console.log(getDataUrl())
    elLink.href = getDataUrl()
}

function getDataUrl() {
    return gElCanvas.toDataURL()
}

/// MEME

function renderMeme() {
    const { selectedImgId, lines } = getMeme()
    const { url: imgUrl } = getImageById(selectedImgId)

    const elImg = new Image()

    function renderFullMeme(img) {
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width

        onClearCanvas()

        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach((line, idx) => renderText(line, idx))
    }

    elImg.src = imgUrl
    elImg.onload = () => renderFullMeme(elImg)
}

/// TEXT
function onTextInput(txt) {
    setLineText(txt)
    renderMeme()
}

function onAddLine() {
    addLine(gElCanvas)
    renderMeme()
}

function onChangeFontSize(amount, type = 'dir') {
    const { sizeRatio } = getSelectedLine()
    const size = Math.ceil(sizeRatio * gElCanvas.width)

    // if 'dir' (direction) then will be current size * 1.1 or 0.9
    const newSizeRatio = type === 'dir' ? sizeRatio * (1 + amount / 10) : (size + amount) / gElCanvas.width
    setFontSize(newSizeRatio)
    renderMeme()
}

function onSetStrokeColor(color) {
    setLineStrokeColor(color)
    renderMeme()
}

function onSetFillColor(color) {
    setLineFillColor(color)
    renderMeme()
}

function onSetFontFamily(fontFamily) {
    setLineFontFamily(fontFamily)
    renderMeme()
}

function onSetFontStyle(fontStyle) {
    setLineFontStyle(fontStyle)
    renderMeme()
}

function onSetTextAlign(elTextAlign) {
    setLineTextAlign(elTextAlign.value)
    setLineStartX(gElCanvas, gCtx)
    renderMeme()

    elTextAlign.value = ''
}

function renderText(line, idx) {
    const { txt, textAlign, startX, boxStartX, bottom, sizeRatio, font, fontStyle, isUnderline, fillColor, strokeColor } = line

    const size = Math.ceil(sizeRatio * gElCanvas.width)
    gCtx.font = `${fontStyle} ${size}px  ${font}`
    gCtx.textAlign = 'center'

    setLineProportions(idx, gCtx, gElCanvas)
    drawLineRect(idx)

    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    gCtx.strokeText(txt, startX, bottom, gElCanvas.width - boxStartX)
    gCtx.fillText(txt, startX, bottom, gElCanvas.width - boxStartX)

    if (isUnderline) {
        gCtx.beginPath();
        gCtx.strokeStyle = line.fillColor;
        gCtx.lineWidth = 2;
        gCtx.moveTo(line.boxStartX, line.bottom + 2);
        gCtx.lineTo(line.endX, line.bottom + 2);
        gCtx.stroke();
    }
}

function renderTextInput(txt) {
    const elTxtInput = document.querySelector('#lineText')
    elTxtInput.value = txt
}

function onSwitchLine() {
    nextLine()
    onSelectLine()
}

function onSelectLine() {
    const line = getSelectedLine()

    renderMeme()
    renderTextInput(line.txt)
}

function drawLineRect(idx) {
    if (getMeme().selectedLineIdx != idx) return

    const { boxStartX, top, width, height } = getSelectedLine()
    gCtx.strokeStyle = 'gray'
    gCtx.fillStyle = '#ffffff2e'
    // gCtx.strokeRect(startX, top - 2, width, height + 6)

    gCtx.beginPath()
    gCtx.roundRect(boxStartX - 10, top - 10, width + 20, height + 20, [20])
    gCtx.stroke()
    gCtx.fill()
}

/// GALLERY

function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()
}

/// NAVIGATION
function showEditor() {
    const elGallery = document.querySelector('.gallery')
    elGallery.classList.add('hidden')

    setTimeout(() => {
        const elEditor = document.querySelector('.editor')
        resizeCanvas()
        renderMeme()
        elEditor.classList.remove('hidden')
    }, 600)
}

