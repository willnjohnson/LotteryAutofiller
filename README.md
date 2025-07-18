# Neopets Lottery Autofiller

This Greasemonkey/Tampermonkey userscript helps automate the process of filling out lottery tickets on Neopets by selecting diversified, non-overlapping number combinations to maximize your chances of getting distinct high-match tickets (e.g., 4 or 5 matching numbers).

## Features

* **Smart number generation:**
  * Generates 20 lottery tickets with minimal number overlap between them to avoid self-canceling duplicates.
  * Reduces redundant patterns that would otherwise reduce expected payout.

* **Auto-fill functionality:**
  * Automatically populates the ticket fields with numbers from the generated stack.

* **Persistent ticket stack:**
  * Stores generated tickets in `localStorage` to ensure user chooses tickets only from that stack (rather than regenerate new tickets).

* **Stack reset button:**
  * Adds a "Clear Lottery Stack" button directly on the lottery page to wipe stored tickets and generate a new batch.

## Installation

This script requires a user script manager like Tampermonkey or Greasemonkey.

1. **Install a User Script Manager:**

2. **Create a New User Script:**
   * Click the Greasemonkey/Tampermonkey icon in your browser's toolbar.
   * Choose "Create a new script..."

3. **Paste the Script:**
   * Remove any placeholder code in the editor.
   * Copy and paste the **Lottery Autofiller** script into the editor.

4. **Save the Script:**
   * Save the script (`Ctrl+S` or File → Save).

## Usage

1. Go to the [Neopets Lottery page](https://www.neopets.com/games/lottery.phtml).
2. The script will automatically:
   * Generate and store a stack of 20 optimized tickets.
   * Autofill one ticket per page load from the stack.
   * Remove the used ticket upon form submission.
3. To clear your ticket stack manually:
   * Click the “Clear Lottery Stack from LocalStorage” button in the top-right of the content area.

## Compatibility

* **Browser:** Chrome, Firefox, Edge, Opera (requires script manager extension)
* **Site:** Only activates on `https://www.neopets.com/games/lottery.phtml`

## Contributing

Contributions are welcome! Bug fixes, improvements, or feature additions can be submitted as issues or pull requests.

## License

This project is open-source and available under the MIT License.

**Disclaimer:** “Neopets” is a registered trademark of Neopets, Inc. This tool is a fan-made utility and is not affiliated with or endorsed by Neopets, Inc.
