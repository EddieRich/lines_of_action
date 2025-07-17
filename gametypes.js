
/**
 * @typedef {Object} Dimensions
 * @property {number} chip_size size of chip rectangle in pixels
 * @property {number} chip_off offset of the chip within a square
 * @property {number} square_size size of a square
 */

/**
 * @typedef {Object} GameState
 * @property {string} player the current player (p1, p2)
 * @property {string} opponent the opponent player (p1, p2)
 * @property {string} selected_chip the selected chip id (p1c4)
 * @property {string[]} board array of 64 strings, chip id
 */

/**
 * @typedef {Object} Target
 * @property {number} row zero based row index
 * @property {number} col zero based column index
 */
