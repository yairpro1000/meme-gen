'use strict'

var gElCanvas
var gCtx

var gIsMouseDown = false
var gStartPos


function onInit() {
	gElCanvas = document.querySelector('canvas')
	gCtx = gElCanvas.getContext('2d')

	resizeCanvas()
	// addListeners()
    renderMeme()
	
}

//// CANVAS

function resizeCanvas() {
	const elContainer = document.querySelector('.canvas-container')
	gElCanvas.width = elContainer.clientWidth
}


function onClearCanvas() {
	gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

/// MEME

function renderMeme() {
    const {selectedImgId, lines} = getMeme()
    const {url: imgUrl} = getImageById(selectedImgId)
    
    const elImg = new Image()
    
    function renderFullMeme(img) {
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
        
        onClearCanvas()
        
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(renderText)
    }

    elImg.src = imgUrl
    elImg.onload = () => renderFullMeme(elImg)
}

/// TEXT
function onTextInput(elTxt) {
    setLineText(elTxt.value)
    renderMeme()
}

function renderText(line) {
    const {startX, startY, txt, size, font, fontStyle, fillColor, strokeColor} = line
    gCtx.font = `${fontStyle} ${size}px  ${font}`
    
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor

    gCtx.strokeText(txt, startX, startY)
    gCtx.fillText(txt, startX, startY)
}


