const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = (dict) => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;

class WordList extends HTMLElement {
	tbody = this.querySelector('tbody');
	rowTemplate = this.querySelector('template');
	rowId = 1;
	selectedRow = null;

	constructor() {
		super();
		this.addEventListener('click', this);
	}

	handleEvent(event) {
		const { intention, target } = findClosestIntention(event);

		event.stopPropagation();

		switch (intention) {
			case 'CREATE_1000_ROWS': {
				this.clearRows();
				this.addRows(1_000);
				return;
			}
			case 'CREATE_10000_ROWS': {
				this.clearRows();
				this.addRows(10_000);
				return;
			}
			case 'ADD_1000_ROWS': {
				this.addRows();
				return;
			}
			case 'UPDATE_10th_ROW': {
				this.tbody
					.querySelectorAll('tr:nth-child(10n+1) > td:nth-child(2) > a')
					.forEach((label) => (label.firstChild.nodeValue += ' !!!'));
				return;
			}
			case 'SELECT_ROW': {
				event.preventDefault();
				const row = target.closest('tr');
				if (row) {
          if (this.selectedRow) {
            this.selectedRow.classList.remove('danger');
          }
          this.selectedRow = row;
          this.selectedRow.classList.add('danger');
        }
        return;
			}
			case 'REMOVE_ROW': {
				const row = target.closest('tr');
				if (row) {
					if (row === this.selectedRow) {
						this.selectedRow = null;
					}
					row.remove();
				}
        return;
			}
			case 'CLEAR_ROWS': {
				this.clearRows();
				return;
			}
			case 'SWAP_ROWS': {
				this.swapRows();
				return;
			}
		}
	}

	addRows(n = 1000) {
		while (n > 0) {
			const row = this.rowTemplate.content.cloneNode(true);
			const firstCell = row.firstElementChild.firstElementChild;
			firstCell.textContent = this.rowId++;
			// update <a> of second cell
			firstCell.nextElementSibling.firstElementChild.textContent = label();
			this.tbody.appendChild(row);
			n -= 1;
		}
	}

	clearRows() {
    this.tbody.textContent = '';
    this.selectedRow = null;
	}

	swapRows() {
		const secondRow = this.tbody.firstElementChild.nextElementSibling;
		const secondToLastRow = this.tbody.lastElementChild.previousElementSibling;
		this.tbody.insertBefore(secondToLastRow, secondRow);
		this.tbody.insertBefore(secondRow, this.tbody.lastElementChild);
  }
}

customElements.define('word-list', WordList);

function findClosestIntention(event) {
	const attributeName = 'on:' + event.type;
	let target = event.target;
	while (target && target.parentElement && !target.hasAttribute(attributeName)) {
		target = target.parentElement;
	}
	if (target) {
		return { intention: target.getAttribute(attributeName), target };
	}
  return {};
}