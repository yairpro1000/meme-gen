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

/// MEME

function renderMeme(memeId = 1) {
    onSelectImg(1)
}

/// IMAGES

function onSelectImg(imgId) {
	const elImg = new Image()

	elImg.src = `images/${imgId}.jpg`
	elImg.onload = () => renderImg(elImg)
}

function renderImg(img) {
	gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
	gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    renderText()
}

/// TEXT
function renderText(txt = 'Hello World!', x = 100, y = 50, font = 'serif', fontSize = 48, fontStyle = 'bold', strokeColor = 'black', fillColor = 'white') {
    console.log(txt)
    gCtx.font = `${fontStyle} ${fontSize}px  ${font}`
    console.log(gCtx.font, `${fontStyle} ${fontSize}px  ${font}`)
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor

    gCtx.strokeText(txt, x, y)
    gCtx.fillText(txt, x, y)
}


