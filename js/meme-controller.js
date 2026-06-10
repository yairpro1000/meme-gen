'use strict'

var gElCanvas
var gCtx

var gIsMouseDown = false
var gIsLineSelected = false


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()
    // addListeners()
    // renderMeme()

    renderGallery()
}

//// CANVAS

function resizeCanvas() {
    gElCanvas.width = 0
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth

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

        // drawLineRect()
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
    addLine()
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

function renderText(line, idx) {
    const { startX, bottom, txt, size, font, fontStyle, fillColor, strokeColor } = line
    
    gCtx.font = `${fontStyle} ${size}px  ${font}`
    
    setLineProportions(idx, gCtx.measureText(txt))
    drawLineRect()
    
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    gCtx.strokeText(txt, startX, bottom)
    gCtx.fillText(txt, startX, bottom)
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

function drawLineRect() {
    if (!getSelectedLine()) return

    const { startX, top, width, height } = getSelectedLine()
    gCtx.strokeStyle = 'gray'
    gCtx.fillStyle = '#ffffff2e'
    // gCtx.strokeRect(startX, top - 2, width, height + 6)
    
    gCtx.beginPath()
    gCtx.roundRect(startX - 10, top - 10, width + 20, height + 20, [20])
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

