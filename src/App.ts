const adjectives = [
	'pretty',
	'large',
	'big',
	'small',
	'tall',
	'short',
	'long',
	'handsome',
	'plain',
	'quaint',
	'clean',
	'elegant',
	'easy',
	'angry',
	'crazy',
	'helpful',
	'mushy',
	'odd',
	'unsightly',
	'adorable',
	'important',
	'inexpensive',
	'cheap',
	'expensive',
	'fancy',
];
const colours = [
	'red',
	'yellow',
	'blue',
	'green',
	'pink',
	'brown',
	'purple',
	'brown',
	'white',
	'black',
	'orange',
];
const nouns = [
	'table',
	'chair',
	'house',
	'bbq',
	'desk',
	'car',
	'pony',
	'cookie',
	'sandwich',
	'burger',
	'pizza',
	'mouse',
	'keyboard',
];

const pick = (dict: string[]) => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;

class WordList extends HTMLElement {
	tbody = this.querySelector('tbody');
	rowTemplate = this.querySelector('template');
	rowId = 1;
	selectedRow: HTMLTableRowElement | null = null;

	constructor() {
		super();
		this.addEventListener('click', this);
	}

	handleEvent(event: Event) {
		const { intention, target } = findClosestIntention(event);

		if (intention === undefined) return;

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
				if (this.tbody) {
					this.tbody
						.querySelectorAll('tr:nth-child(10n) > td:nth-child(2) > a')
						.forEach((label) => {
							if (label.firstChild) return label.firstChild.nodeValue += ' !!!'
						});
				}
				return;
			}
			case 'SELECT_ROW': {
				event.preventDefault();
				const row = target.closest('tr');
				if (row === null) return;
				if (row === this.selectedRow) {
					row.classList.remove('danger');
				} else {
					this.selectedRow?.classList.remove('danger');
					row.classList.add('danger');
					this.selectedRow = row;
				}
				return;
			}
			case 'REMOVE_ROW': {
				const tr = target.closest('tr');
				if (tr === null) return;
				if (tr === this.selectedRow) {
					this.selectedRow = null;
				}
				tr.remove();
				return;
			}
			case 'CLEAR_ROWS': {
				this.clearRows();
				return;
			}
			case 'SWAP_ROWS': {
				if (this.tbody === null) return;
				const firstChild = this.tbody.firstElementChild;
				const secondToLastChild = this.tbody.querySelector('tr:nth-last-child(2)');
				if (firstChild == null || secondToLastChild == null) return;

				const firstNextSibling = firstChild.nextElementSibling;
				const secondToLastNextSibling = secondToLastChild.nextElementSibling;

				if (firstNextSibling && secondToLastNextSibling) {
					this.tbody.insertBefore(secondToLastChild, firstNextSibling);
					this.tbody.insertBefore(firstNextSibling, secondToLastNextSibling);
				}
				return;

				// const firstChild = this.tbody.firstElementChild;
				// const secondToLastChild = this.tbody.querySelector('tr:nth-last-child(2)');
				// if (firstChild == null || secondToLastChild == null) return;

				// this.tbody.insertBefore(
				// 	this.tbody.insertBefore(firstChild.nextElementSibling, secondToLastChild).nextElementSibling,
				// 	firstChild.nextElementSibling
				// );
				// return;
			}
		}
	}

	addRows(n = 1000) {
		if (this.tbody === null || this.rowTemplate === null) return;
		const fragment = document.createDocumentFragment();

		while (n > 0) {
			const tr = this.rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
			const td1 = tr.querySelector('td:nth-child(1)');
			if (td1) td1.textContent = String(this.rowId++);
			const td2a = tr.querySelector('td:nth-child(2) a');
			if (td2a) td2a.textContent = label();
			fragment.append(tr);
			n -= 1;
		}

		this.tbody.append(fragment);
	}

	clearRows() {
		if (this.tbody === null) return;
		this.tbody.textContent = '';
		this.selectedRow = null;
	}
}

customElements.define('word-list', WordList);

function findClosestIntention(event: Event) {
	if (event.target instanceof Element) {
		const attributeName = `on:${event.type}`;
		const target = event.target.closest(`[${CSS.escape(attributeName)}]`);
		if (target !== null) {
			const intention = target.getAttribute(attributeName);
			return { intention, target };
		}
	}
	return {};
}