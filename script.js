
const elBoard = document.getElementById('el-board')

/** @type{Dimensions} */
const dim = {
	chip_size: 0,
	chip_off: 0,
	square_size: 0
}

/** @type{GameState} */
const gamestate = {
	player: '',
	opponent: '',
	selected_chip: '',
	board: Array(64).fill('')
}

function calcDims() {
	dim.square_size = elBoard.offsetHeight / 8
	dim.chip_size = dim.square_size * 0.6
	dim.chip_off = (dim.square_size - dim.chip_size) / 2
	const root = document.documentElement
	const thick = 0.03
	root.style.setProperty('--stop1', (dim.square_size * thick) + 'px')
	root.style.setProperty('--stop2', (dim.square_size * (1 - thick)) + 'px')
	root.style.setProperty('--stop3', (dim.square_size * (1 + thick)) + 'px')
	root.style.setProperty('--stop4', (dim.square_size * (2 - thick)) + 'px')
	root.style.setProperty('--chip-border', (dim.chip_size * 0.1) + 'px')
}

function adjustChips() {
	for (const id of gamestate.board) {
		if (id.length) {
			const chip = elBoard.querySelector('#' + id)
			chip.style.display = 'block'
			chip.style.width = chip.style.height = dim.chip_size + 'px'
			chip.style.top = (parseInt(chip.dataset.row) * dim.square_size + dim.chip_off) + 'px'
			chip.style.left = (parseInt(chip.dataset.col) * dim.square_size + dim.chip_off) + 'px'
		}
	}

	for (const target of elBoard.querySelectorAll('div.target')) {
		target.style.width = target.style.height = dim.chip_size + 'px'
		target.style.top = (parseInt(target.dataset.row) * dim.square_size + dim.chip_off) + 'px'
		target.style.left = (parseInt(target.dataset.col) * dim.square_size + dim.chip_off) + 'px'
	}
}

function assignChipLocation(row, col, id) {
	gamestate.board[row * 8 + col] = id
	const chip = elBoard.querySelector('#' + id)
	chip.dataset.row = row.toString()
	chip.dataset.col = col.toString()
}

function createChip(id) {
	const chip = document.createElement('div')
	chip.id = id
	chip.className = 'chip'
	chip.style.width = chip.style.height = dim.chip_size + 'px'
	chip.style.top = (Math.floor(3.5 * dim.square_size) + dim.chip_off) + 'px'
	chip.style.left = (Math.floor(3.5 * dim.square_size) + dim.chip_off) + 'px'
	chip.addEventListener('click', chipClick)
	elBoard.appendChild(chip)
}

function createTarget(row, col) {
	const target = document.createElement('div')
	target.dataset.player = gamestate.player
	target.dataset.row = row.toString()
	target.dataset.col = col.toString()
	target.className = 'target'
	target.style.width = target.style.height = dim.chip_size + 'px'
	target.style.top = (row * dim.square_size + dim.chip_off) + 'px'
	target.style.left = (col * dim.square_size + dim.chip_off) + 'px'
	target.addEventListener('click', targetClick)
	elBoard.appendChild(target)
}

function removeAllTargets() {
	for (const target of elBoard.querySelectorAll('div.target'))
		elBoard.removeChild(target)
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
	if (gamestate.player != 'p1')
		return

	selectChip(e.target.id)
}

function targetClick(e) {
	e.stopPropagation()
	if (gamestate.player != 'p1')
		return

	moveSelectedTo(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col))
}
