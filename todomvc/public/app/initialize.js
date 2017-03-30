import Inferno, {linkEvent} from 'inferno'
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/observable/bindNodeCallback'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import jsonp from 'b-jsonp'

// Streams
let actions$ = new Subject()
let query$ = new Subject()

// Model
let initModel = []

// Update
function update(model, [action, value]) {
  switch (action) {
    case 'results':
      return value
  }
}

// View
function view(model) {
  return (
    <div>
      <input placeholder="Search Wikipedia" autofocus={true} onInput={onInput} />
      <ul>
        { model.map(result => <li>{result}</li>) }
      </ul>
    </div>
  )
}

function onInput(e) {
  query$.next(e)
}

// Http
let http = Observable.bindNodeCallback(jsonp)

function eventToUrl(e){
  let query = encodeURIComponent(e.target.value.trim())
  return `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${query}`
}

let effects$ = query$
  .debounceTime(150)
  .map(eventToUrl)
  .switchMap(http)
  .map(([,x]) => ['results', x])

// Reduce
let model$ = actions$
  .merge(effects$)
  .scan(update, initModel)
  .startWith(initModel)
  .do(x => console.log('Model', x))

// Render
let view$ = model$.map(view)
let render = Inferno.createRenderer()
view$.subscribe(vNode => {
  render(document.getElementById('app'), vNode)
})
