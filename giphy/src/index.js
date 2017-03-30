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
import jsonp from 'b-jsonp'

// Stream
let actions$ = new Subject()
let query$ = new Subject()

// Model
let initModel = {topic: 'cats', url: 'loading.gif', error: null}

// Update
function update({topic, url}, [action, value]) {
  switch (action) {
    case 'changeTopic':
      return {topic: value, url}
    case 'result':
      return {topic, url: value}
    case 'error':
      return {topic, error: value}
  }
}

// View
function view(model) {
  let {topic, url, error} = model
  return (
    <div>
      <input placeholder="Giphy Topic" value={topic} onInput={handleInput} />
      <button onClick={linkEvent(topic, onClick)}>More Please!</button>
      <br />
      { error ? <div>{error}</div> : <img src={url} /> }
    </div>
  )
}

function onClick(topic) {
  query$.next(topic)
}

function handleInput(e){
  let value = e.target.value.trim()
  actions$.next(['changeTopic', value])
}

// Http
let http = Observable.bindNodeCallback(jsonp)

function topicToUrl(topic){
  return `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`
}

function parseResponse({data: {image_url}}) {
  return image_url ? ['result', image_url] : ['error', 'No images found']
}

let effects$ = query$
  .startWith(initModel.topic)
  .map(topicToUrl)
  .switchMap(http)
  .map(parseResponse)
  .catch(e => Observable.of(['error', e.message]))

// Reduce
let model$ = actions$
  .merge(effects$)
  .do(x => console.log('Actions', x))
  .scan(update, initModel)
  .startWith(initModel)
  .do(x => console.log('Model', x))

// Render
let view$ = model$.map(view)
let render = Inferno.createRenderer()
view$.subscribe(vNode => {
  render(document.getElementById('app'), vNode)
})
