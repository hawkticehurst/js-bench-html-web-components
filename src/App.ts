const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = (dict: string[]) => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;

class WordList extends HTMLElement {
	private _tbody = this.querySelector('tbody');
	private _rowTemplate = this.querySelector('template');
	private _rowId = 1;
	private _selectedRow: HTMLTableRowElement | null = null;

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
				if (this._tbody) {
					const rows = this._tbody.children;
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
          if (this._selectedRow) {
            this._selectedRow.classList.remove('danger');
          }
          this._selectedRow = row;
          this._selectedRow.classList.add('danger');
        }
        return;
			}
			case 'REMOVE_ROW': {
				const row = target.closest('tr');
				if (row) {
					if (row === this._selectedRow) {
						this._selectedRow = null;
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
		if (!this._tbody || !this._rowTemplate) return;
    const fragment = document.createDocumentFragment();

    while (n > 0) {
      const tr = this._rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
      const td1 = tr.querySelector('td:nth-child(1)');
      if (td1) td1.textContent = String(this._rowId++);
      const td2a = tr.querySelector('td:nth-child(2) a');
      if (td2a) td2a.textContent = label();
      fragment.appendChild(tr);
      n -= 1;
    }

    this._tbody.appendChild(fragment);
	}

	clearRows() {
		if (!this._tbody) return;
    this._tbody.textContent = '';
    this._selectedRow = null;
	}

	swapRows() {
		if (!this._tbody || this._tbody.children.length < 2) return;
		const secondRow = this._tbody.children[1];
		const secondToLastRow = this._tbody.children[this._tbody.children.length - 2];
		this._tbody.insertBefore(secondToLastRow, secondRow);
		this._tbody.insertBefore(secondRow, this._tbody.children[this._tbody.children.length - 1]);
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