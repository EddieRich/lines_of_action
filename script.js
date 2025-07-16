
const elBoard = document.getElementById('el-board')

const dim = {
	chip_size: 0,
	chip_off: 0,
	square_size: 0
}

const gamestate = {
	player: '',
	selected_chip: '',
	board: Array(64).fill('')
}

function calcDims() {
	dim.square_size = Math.floor(elBoard.offsetHeight / 8)
	dim.chip_size = Math.floor(dim.square_size * 0.6)
	dim.chip_off = Math.floor((dim.square_size - dim.chip_size) / 2)
	const root = document.documentElement
	const thick = 0.03
	root.style.setProperty('--stop1', Math.floor(dim.square_size * thick) + 'px')
	root.style.setProperty('--stop2', Math.floor(dim.square_size * (1 - thick)) + 'px')
	root.style.setProperty('--stop3', Math.floor(dim.square_size * (1 + thick)) + 'px')
	root.style.setProperty('--stop4', Math.floor(dim.square_size * (2 - thick)) + 'px')
	root.style.setProperty('--chip-border', Math.floor(dim.chip_size * 0.1) + 'px')
}

function adjustChips() {
	for (const id of gamestate.board) {
		if (id.length) {
			const chip = document.getElementById(id)
			chip.style.width = chip.style.height = dim.chip_size + 'px'
			chip.style.top = (parseInt(chip.dataset.row) * dim.square_size + dim.chip_off) + 'px'
			chip.style.left = (parseInt(chip.dataset.col) * dim.square_size + dim.chip_off) + 'px'
		}
	}
}

function assignChipLocation(row, col, id) {
	gamestate.board[row * 8 + col] = id
	const chip = document.getElementById(id)
	chip.dataset.row = row.toString()
	chip.dataset.col = col.toString()
}

function createChip(id) {
	const chip = document.createElement('div')
	chip.id = id
	chip.className = 'chip'
	chip.innerText = id
	chip.style.width = chip.style.height = dim.chip_size + 'px'
	chip.style.top = (Math.floor(3.5 * dim.square_size) + dim.chip_off) + 'px'
	chip.style.left = (Math.floor(3.5 * dim.square_size) + dim.chip_off) + 'px'
	chip.addEventListener('click', chipClick)
	elBoard.appendChild(chip)
}

addEventListener('keyup', e => {
	if (e.code === 'KeyN')
		newGame()
})

addEventListener('resize', () => {
	calcDims()
	adjustChips()
})

addEventListener('load', () => {
	calcDims()
	for (let i = 1; i < 13; i++) {
		createChip(`p1c${i}`)
		createChip(`p2c${i}`)
	}
})

function chipClick(e) {
	e.stopPropagation()
	if (e.target.id.startsWith(gamestate.player)) {
		// choosing chip to move
		if (gamestate.selected_chip.length)
			document.getElementById(gamestate.selected_chip).classList.remove('selected')

		if (gamestate.selected_chip !== e.target.id) {
			e.target.classList.add('selected')
			gamestate.selected_chip = e.target.id
		}
		else
			gamestate.selected_chip = ''
	}
	else {
		// click on opponents chip
		if (gamestate.selected_chip) {
			// can player capture? Is it a valid move
		}
	}
}

elBoard.addEventListener('click', e => {
	alert(`Row ${Math.floor(e.offsetY / dim.square_size)} Col ${Math.floor(e.offsetX / dim.square_size)}`)
})

function newGame() {
	gamestate.board.fill('')
	for (let i = 1; i < 7; i++) {
		assignChipLocation(0, i, `p1c${i}`)
		assignChipLocation(7, i, `p1c${i + 6}`)
		assignChipLocation(i, 0, `p2c${i}`)
		assignChipLocation(i, 7, `p2c${i + 6}`)
	}

	adjustChips()
	gamestate.player = 'p1'
	gamestate.selected_chip = ''
}
