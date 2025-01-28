const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

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
					const rows = this.tbody.children;
					for (let i = 0; i < rows.length; i += 10) {
					const label = rows[i].querySelector('td:nth-child(2) > a');
					if (label && label.firstChild) {
						label.firstChild.nodeValue += ' !!!';
					}
					}
				}
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
		if (!this.tbody || !this.rowTemplate) return;
    const fragment = document.createDocumentFragment();

    while (n > 0) {
      const tr = this.rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
      const td1 = tr.querySelector('td:nth-child(1)');
      if (td1) td1.textContent = String(this.rowId++);
      const td2a = tr.querySelector('td:nth-child(2) a');
      if (td2a) td2a.textContent = label();
      fragment.appendChild(tr);
      n -= 1;
    }

    this.tbody.appendChild(fragment);
	}

	clearRows() {
		if (!this.tbody) return;
    this.tbody.textContent = '';
    this.selectedRow = null;
	}

	swapRows() {
		if (!this.tbody || this.tbody.children.length < 2) return;
		const secondRow = this.tbody.children[1];
		const secondToLastRow = this.tbody.children[this.tbody.children.length - 2];
		this.tbody.insertBefore(secondToLastRow, secondRow);
		this.tbody.insertBefore(secondRow, this.tbody.children[this.tbody.children.length - 1]);
  }
}

customElements.define('word-list', WordList);

function findClosestIntention(event: Event) {
  if (event.target instanceof Element) {
    const attributeName = `on:${event.type}`;
    let target = event.target;
    while (target && target.parentElement && !target.hasAttribute(attributeName)) {
      target = target.parentElement;
    }
    if (target) {
      return { intention: target.getAttribute(attributeName), target };
    }
  }
  return {};
}