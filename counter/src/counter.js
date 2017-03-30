import Inferno from 'inferno'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/startWith'

// Stream
let actions$ = new Subject()

// Model
let initModel = 0

// Update
function update(model, action) {
  switch (action) {
    case 'add':
      return model + 1
    case 'subtract':
      return model - 1
  }
}

// View
function Button({action, text}) {
  return <button onClick={e => actions$.next(action)}>{text}</button>
}

function view(model) {
  return (
    <div>
      <Button action="subtract" text="-" />
      <span>{model}</span>
      <Button action="add" text="+" />
    </div>
  )
}

// Reduce
let model$ = actions$
  .do(x => console.log('Actions', x))
  .scan(update, initModel)
  .startWith(initModel)
  .do(x => console.log('Model', x))

// Render
let view$ = model$.map(view)
let render = Inferno.createRenderer();
view$.subscribe(vNode => {
  render(document.getElementById('app'), vNode)
})
