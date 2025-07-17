
/**
 * get chip count for all 4 directions
 * @param {number} row the zero based row index
 * @param {number} col the zero based column index
 * @returns {number[]} Array of chip counts, [horizontal, vertical, diagonal l-r, diagonal r-l
 */
function getChipCounts(row, col) {
	const count = [0, 0, 0, 0]
	let r, c
	// horizontal
	for (c = 0; c < 8; c++) {
		if (gamestate.board[(row * 8) + c])
			count[0]++
	}
	// vertical
	for (r = 0; r < 8; r++) {
		if (gamestate.board[(r * 8) + col])
			count[1]++
	}
	// diagonal l-r
	r = row - Math.min(row, col)
	c = col - Math.min(row, col)
	while (r < 8 && c < 8) {
		if (gamestate.board[(r * 8) + c])
			count[2]++

		r++
		c++
	}
	// diagonal r-l
	r = row - Math.min(row, 7 - col)
	c = col + Math.min(row, 7 - col)
	while (r < 8 && c >= 0) {
		if (gamestate.board[(r * 8) + c])
			count[3]++

		r++
		c--
	}

	return count
}

/**
 * Check if it is a clear (valid) path in the given direction
 * @param {number} row starting row
 * @param {number} col starting column
 * @param {number} rinc amount to step the row
 * @param {number} cinc amount to step the column
 * @param {number[]} counts array of chip counts in the 4 directional lines
 * @returns {boolean} is the path clear
 */
function isClear(row, col, rinc, cinc, counts) {
	let r, c, ci, clear
	if (rinc === 0 && cinc !== 0)
		ci = 0	// horizontal move
	else if (rinc !== 0 && cinc === 0)
		ci = 1	// vertical move
	else if (rinc === cinc)
		ci = 2	// diagonal l-r move
	else
		ci = 3	// diagonal r-l move

	// destination
	const drow = row + (counts[ci] * rinc)
	const dcol = col + (counts[ci] * cinc)

	if (drow < 0 || drow > 7 || dcol < 0 || dcol > 7)	// off the board
		return false

	clear = true
	r = row + rinc
	c = col + cinc
	while ((r !== drow || c !== dcol) && clear) {
		clear = !gamestate.board[(r * 8) + c].startsWith(gamestate.opponent)

		r += rinc
		c += cinc
	}

	return (clear && !gamestate.board[(r * 8) + c].startsWith(gamestate.player))
}

/**
 * Use gamestate.selected_chip to determine target squares
*
* @returns {Array<Target>} Array of Target objects
*/
function getTargetSquares() {
	if (!gamestate.selected_chip)
		return []

	const chip = elBoard.querySelector('#' + gamestate.selected_chip)
	const chiprow = parseInt(chip.dataset.row)
	const chipcol = parseInt(chip.dataset.col)
	const counts = getChipCounts(chiprow, chipcol)
	/** @type {Array<Target>} */
	const targets = []

	// right
	if (isClear(chiprow, chipcol, 0, 1, counts))
		targets.push({ row: chiprow, col: chipcol + counts[0] })
	// down right
	if (isClear(chiprow, chipcol, 1, 1, counts))
		targets.push({ row: chiprow + counts[2], col: chipcol + counts[2] })
	// down
	if (isClear(chiprow, chipcol, 1, 0, counts))
		targets.push({ row: chiprow + counts[1], col: chipcol })
	// down left
	if (isClear(chiprow, chipcol, 1, -1, counts))
		targets.push({ row: chiprow + counts[3], col: chipcol - counts[3] })
	// left
	if (isClear(chiprow, chipcol, 0, -1, counts))
		targets.push({ row: chiprow, col: chipcol - counts[0] })
	// up left
	if (isClear(chiprow, chipcol, -1, -1, counts))
		targets.push({ row: chiprow - counts[2], col: chipcol - counts[2] })
	// up
	if (isClear(chiprow, chipcol, -1, 0, counts))
		targets.push({ row: chiprow - counts[1], col: chipcol })
	// up right
	if (isClear(chiprow, chipcol, -1, 1, counts))
		targets.push({ row: chiprow - counts[3], col: chipcol + counts[3] })

	return targets
}

function checkForCapture(row, col) {
	const id = gamestate.board[(row * 8) + col]
	if (id.startsWith(gamestate.opponent)) {
		gamestate.board[(row * 8) + col] = ''
		const chip = elBoard.querySelector('#' + id)
		chip.style.display = 'none'
	}
}

function selectChip(id) {
	if (id.startsWith(gamestate.player)) {
		const chip = elBoard.querySelector('#' + id)
		// choosing chip to move
		if (gamestate.selected_chip) {
			elBoard.querySelector('#' + gamestate.selected_chip).classList.remove('selected')
			removeAllTargets()
		}

		if (gamestate.selected_chip !== id) {
			chip.classList.add('selected')
			gamestate.selected_chip = id
			const targets = getTargetSquares()
			for (const target of targets) {
				createTarget(target.row, target.col)
			}
		}
		else
			gamestate.selected_chip = ''
	}
}

function moveSelectedTo(row, col) {
	checkForCapture(row, col)
	const chip = elBoard.querySelector('#' + gamestate.selected_chip)
	gamestate.selected_chip = ''
	chip.classList.remove('selected')
	gamestate.board[(parseInt(chip.dataset.row) * 8) + parseInt(chip.dataset.col)] = ''
	gamestate.board[(row * 8) + col] = chip.id
	chip.style.top = (row * dim.square_size + dim.chip_off) + 'px'
	chip.style.left = (col * dim.square_size + dim.chip_off) + 'px'
	chip.dataset.row = row.toString()
	chip.dataset.col = col.toString()
	removeAllTargets()

	// check for win
	nextPlayer()
}

function nextPlayer() {
	if (gamestate.player === 'p1') {
		gamestate.player = 'p2'
		gamestate.opponent = 'p1'
		setTimeout(computerChoose, 1000)
	}
	else {
		gamestate.player = 'p1'
		gamestate.opponent = 'p2'
	}
}

function computerChoose() {
	const chips = Array.from(elBoard.querySelectorAll('.chip[id^="p2"],*:not([display="none"])'))
	// for now, pick a random one
	const chip = chips[Math.floor(Math.random() * chips.length)]
	selectChip(chip.id)
}

function newGame() {
	gamestate.board.fill('')

	if (gamestate.selected_chip)
		elBoard.querySelector('#' + gamestate.selected_chip).classList.remove('selected')

	removeAllTargets()

	for (let i = 1; i < 7; i++) {
		assignChipLocation(0, i, `p1c${i}`)
		assignChipLocation(7, i, `p1c${i + 6}`)
		assignChipLocation(i, 0, `p2c${i}`)
		assignChipLocation(i, 7, `p2c${i + 6}`)
	}

	adjustChips()
	gamestate.player = 'p1'
	gamestate.opponent = 'p2'
	gamestate.selected_chip = ''
}
