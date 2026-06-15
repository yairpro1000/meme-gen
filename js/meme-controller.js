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

    renderGallery()
    showGallery()
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

    if (isLineResize) onChangeFontSize(-(dx + dy) / 2, 'pixel')
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
        const imgRatio = img.naturalHeight / img.naturalWidth
        gElCanvas.height = imgRatio * gElCanvas.width

        onClearCanvas()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach((line, idx) => renderText(line, idx))
        onSelectLine()
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

function onSetTextAlign2(alignValue) {
    setLineTextAlign(alignValue)
    setLineStartX(gElCanvas, gCtx)
    renderMeme()

    elTextAlign.value = ''
}

function renderText(line, idx) {
    const { txt, textAlign, startX, boxStartX, top, bottom, sizeRatio, font, fontStyle, isUnderline, fillColor, strokeColor } = line

    const size = Math.ceil(sizeRatio * gElCanvas.width)
    gCtx.font = `${fontStyle} ${size}px  ${font}`
    gCtx.textAlign = 'center'

    setLineProportions(idx, gCtx, gElCanvas)
    drawLineRect(idx)

    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    // gCtx.strokeText(txt, startX, bottom, gElCanvas.width - boxStartX)
    gCtx.fillText(txt.toUpperCase(), startX, bottom, gElCanvas.width - boxStartX)
    

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

    // Resize arrow
    if (gElCanvas.width <= 700) {
    const elImg = new Image()
    elImg.onload = () => {gCtx.drawImage(elImg, boxStartX - 15, top - 15, 25, 25)}
    elImg.src = 'images/svg/resize_arrow.svg'
    }
}

/// GALLERY

function onImgSelect(imgId) {
    setMemeImg(imgId)
    showEditor()
}

/// NAVIGATION
function showEditor() {
    const elGallery = document.querySelector('.gallery')
    elGallery.classList.add('hidden')

    // const elFilePicker = document.querySelector('.editor .file-picker-wrapper')
    // if (getMeme().selectedImgId === 0) elFilePicker.classList.remove('hidden')
    //     else elFilePicker.classList.add('hidden')

    setTimeout(() => {
        const elEditor = document.querySelector('.editor')
        resizeCanvas()
        renderMeme()
        elEditor.classList.remove('hidden')
    }, 600)
}

function showGallery() {
    console.log('gallery')
    const elEditor = document.querySelector('.editor')
    elEditor.classList.add('hidden')
    
    setTimeout(() => {
        renderKeywords(6)
        renderGallery()
        
        const elGallery = document.querySelector('.gallery')
        elGallery.classList.remove('hidden')
    }, 600)
}

/// USER IMAGE
function onImgInput(ev) {
    const elFilePicker = document.querySelector('.file-picker')
    loadImageFromInput(ev)

    elFilePicker.value = ''
}

function loadImageFromInput(ev) {
	const reader = new FileReader()

	reader.onload = event => {
		setUserImg(event.target.result)
        setMemeImg(0)
        renderMeme()
	}
	reader.readAsDataURL(ev.target.files[0])
}

/// SHARE CANVAS

function onUploadImg(ev) {
	ev.preventDefault()
	const canvasData = gElCanvas.toDataURL('image/jpeg')

	// After a succesful upload, allow the user to share on Facebook
	function onSuccess(uploadedImgUrl) {
		const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
		console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)
		document.querySelector('.share-container').innerHTML = `
            <a href="${uploadedImgUrl}" target="_blank">Uploaded picture</a>
            <p>Image url: ${uploadedImgUrl}</p>
            <button class="btn-facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}')">
                Share on Facebook  
            </button>`
	}

	uploadImg(canvasData, onSuccess)
}

async function uploadImg(imgData, onSuccess) {
	const CLOUD_NAME = 'webify'
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

	const formData = new FormData()
	formData.append('file', imgData)
	formData.append('upload_preset', 'webify')

	try {
		const res = await fetch(UPLOAD_URL, {
			method: 'POST',
			body: formData,
		})
		const data = await res.json()
		console.log('Cloudinary response:', data)
		onSuccess(data.secure_url)
	} catch (err) {
		console.log(err)
	}
}

/// Utils

function toggleElementVisible(el) {
    el.classList.toggle('hidden')
    setTimeout(() => {
        el.style.display = 'none'
    }, 600)
}