const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = dict => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;
const labelOf = r => r.firstChild.nextSibling.firstChild.firstChild;

const {cloneNode} = Node.prototype;
const clone = n => cloneNode.call(n, true);
const insert = (parent, node, ref) => parent.insertBefore(node, ref);

class JsBench extends HTMLElement {
  ID = 1;
  SEL = null;
  TMPL = null;
  SIZE = 0;

  constructor() {
    super();
    this.innerHTML = `
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Portable HTML Web Components (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="add">Append 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="update">Update every 10th row</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="clear">Clear</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button type="button" class="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody id="tbody"></tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>`;

    this.TABLE = this.querySelector('table');
    this.TBODY = this.querySelector('tbody');
    this.TROW = document.createElement('template');
    this.TROW.innerHTML = '<tr><td class="col-md-1">?</td><td class="col-md-4"><a>?</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';
    this.BUTTONS = this.querySelectorAll('button');
    this.ROWS = this.TBODY.children;
    
    this.BUTTONS.forEach(b => b.addEventListener("click", this[b.id].bind(this)));
    this.TBODY.addEventListener("click", this.rowSelect.bind(this));
  }
  run() {
    this.create(1000);
  }
  runlots() {
    this.create(10000);
  }
  add() {
    this.create(1000, true);
  }
  clear() {
    this.TBODY.textContent = '';
    this.SEL = null;
  }
  update() {
    for (let i = 0, r; r = this.ROWS[i]; i += 10) {
      labelOf(r).nodeValue += ' !!!';
    }
  }
  swaprows() {
    const [, r1, r2] = this.ROWS;
    const r998 = this.ROWS[998];
    if (r998) {
      insert(this.TBODY, r1, r998);
      insert(this.TBODY, r998, r2);
    }
  }
  create(count, add = false) {
    if (this.SIZE !== count) {
      this.TMPL = clone(this.TROW.content);
      [...Array((this.SIZE = count) / 50 - 1)].forEach(() => {
        this.TMPL.append(clone(this.TMPL.firstChild));
      });
    }
    if (!add) {
      this.clear();
      this.TBODY.remove();
    }
    while (count) {
      for (const r of this.TMPL.children) {
        (r.$id ??= r.firstChild.firstChild).nodeValue = this.ID++;
        (r.$label ??= labelOf(r)).nodeValue = label();
        count--;
      }
      insert(this.TBODY, clone(this.TMPL), null);
    }
    if (!add) {
      this.TABLE.append(this.TBODY);
    }
  }
  rowSelect(e) {
    const t = e.target;
    const n = t.tagName;
    const r = t.closest('TR');
    e.stopPropagation();
    if (n == 'SPAN' || n == 'A' && t.firstElementChild) {
      r.remove();
    } else if (n == 'A' && (this.SEL && (this.SEL.className = ''), (this.SEL = r))) {
      this.SEL.className = 'danger';
    }
  }
}

customElements.define('js-bench', JsBench);
