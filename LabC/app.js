const S = 4

const map = L.map('map').setView([52.2297,21.0122], 13)
const tileLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, crossOrigin: true }
).addTo(map)

Notification.requestPermission()

let userMarker = null

document.getElementById('locBtn').onclick = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
        const c = [pos.coords.latitude, pos.coords.longitude]
        if (userMarker) map.removeLayer(userMarker)
        userMarker = L.marker(c).addTo(map).bindPopup("Twoja lokalizacja").openPopup()
        map.setView(c, 15)
    })
}

const puzzleBank = document.getElementById('puzzleBank')
const dropArea = document.getElementById('dropArea')
const rasterPreview = document.getElementById('rasterPreview')
const exportBtn = document.getElementById('exportBtn')

function generateSlots() {
    dropArea.innerHTML = ""
    for (let i = 0; i < S * S; i++) {
        const slot = document.createElement('div')
        slot.className = "slot"
        slot.dataset.index = i
        slot.addEventListener('dragover', e => e.preventDefault())
        slot.addEventListener('drop', dropSlot)
        dropArea.appendChild(slot)
    }
}
generateSlots()

exportBtn.onclick = async () => {

    const zoom = map.getZoom()
    const bounds = map.getBounds()
    const tileSize = 256

    const nw = map.project(bounds.getNorthWest(), zoom)
    const se = map.project(bounds.getSouthEast(), zoom)

    const width = Math.abs(se.x - nw.x)
    const height = Math.abs(se.y - nw.y)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const tilePromises = []

    const startX = Math.floor(nw.x / tileSize)
    const endX = Math.floor(se.x / tileSize)
    const startY = Math.floor(nw.y / tileSize)
    const endY = Math.floor(se.y / tileSize)

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`
            tilePromises.push(new Promise(resolve => {
                const img = new Image()
                img.crossOrigin = "anonymous"
                img.onload = () => {
                    const dx = x * tileSize - nw.x
                    const dy = y * tileSize - nw.y
                    ctx.drawImage(img, dx, dy)
                    resolve()
                }
                img.onerror = resolve
                img.src = url
            }))
        }
    }

    await Promise.all(tilePromises)

    const imgURL = canvas.toDataURL()
    rasterPreview.innerHTML = `<img src="${imgURL}">`

    const w = canvas.width
    const h = canvas.height
    const sw = Math.floor(w / S)
    const sh = Math.floor(h / S)

    const pieces = []
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            const c = document.createElement('canvas')
            c.width = sw
            c.height = sh
            c.getContext("2d").drawImage(canvas, x * sw, y * sh, sw, sh, 0, 0, sw, sh)
            pieces.push({ img: c.toDataURL(), pos: y * S + x })
        }
    }

    shuffle(pieces)

    puzzleBank.innerHTML = ""
    pieces.forEach((p, i) => {
        const el = document.createElement("div")
        el.className = "piece"
        el.id = "p" + i
        el.draggable = true
        el.dataset.correct = p.pos
        const img = document.createElement("img")
        img.src = p.img
        el.appendChild(img)
        el.addEventListener('dragstart', e => e.dataTransfer.setData("text/plain", el.id))
        puzzleBank.appendChild(el)
    })

    Array.from(dropArea.children).forEach(s => s.innerHTML = "")
}

function dropSlot(e) {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    const piece = document.getElementById(id)
    if (!piece) return
    e.target.innerHTML = ""
    e.target.appendChild(piece)
    piece.style.width = "100%"
    piece.style.height = "100%"
    verify()
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
}

function showAlert(message){
    const div = document.createElement("div")
    div.textContent = message
    div.style.position = "fixed"
    div.style.top = "20px"
    div.style.right = "20px"
    div.style.background = "#16a34a"
    div.style.color = "#fff"
    div.style.padding = "12px 20px"
    div.style.borderRadius = "8px"
    div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"
    div.style.zIndex = 9999
    document.body.appendChild(div)
    setTimeout(()=>document.body.removeChild(div),3000)
}

function verify() {
    let ok = true
    const slots = Array.from(dropArea.children)
    for (const s of slots) {
        const p = s.firstChild
        if (!p){ok=false;continue}
        if(parseInt(p.dataset.correct)!==parseInt(s.dataset.index)){
            ok=false
        }else{
            s.classList.add("correct")
        }
    }

    if(ok){
        console.log("Puzzle ułożone poprawnie!")  // <-- dodany log
        if(Notification.permission==="granted"){
            new Notification("Brawo! Puzzle ułożone!")
        }
        showAlert("Brawo! Puzzle ułożone!")
    }
}