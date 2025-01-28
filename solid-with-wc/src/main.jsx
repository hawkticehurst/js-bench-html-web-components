import { render } from "solid-js/web";
import "./html-web-component";

render(() => {
  return (
    <js-bench>
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Solid with HTML Web Components (keyed)</h1>
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
      </div>
    </js-bench>
  );
}, document.getElementById("main"));
