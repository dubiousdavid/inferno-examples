import Inferno, { linkEvent } from "inferno"
import createRouter, { loggerPlugin } from "router5"
import browserPlugin from "router5/plugins/browser"
import listenersPlugin from "router5/plugins/listeners"
import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"
import "rxjs/add/operator/do"
import "rxjs/add/operator/map"
import "rxjs/add/operator/scan"
import "rxjs/add/operator/startWith"
import "rxjs/add/operator/switchMap"
import "rxjs/add/operator/publishBehavior"

// Routing
const router = createRouter()
  .addNode("all", "/")
  .addNode("active", "/active")
  .addNode("completed", "/completed")
  .usePlugin(listenersPlugin())
  .usePlugin(loggerPlugin)
  .usePlugin(browserPlugin({ useHash: true }))
  .start()

function Link(props) {
  let { route, params, children, ...rest } = props
  let href = router.buildUrl(route, params)

  return <a {...rest} href={href}>{children}</a>
}

// Streams
let actions$ = new Subject()

// Model
// interface TodoItem {
//   id: number;
//   completed: boolean;
//   editing: boolean;
//   text: string;
// }
//
// interface Model {
//   items: TodoItem[];
//   allCompleted: boolean;
//   filter: string;
//   text: string;
//   uid: number;
// }

let initModel = getFromStorage() || {
  items: [],
  allCompleted: false,
  filter: router.getState().name,
  text: "",
  uid: 0
}

const storageKey = "todos-infernojs"

function getFromStorage() {
  let json = localStorage.getItem(storageKey)
  if (json) {
    return JSON.parse(json)
  }
}

// Update
function update(model, [action, value]) {
  let { items, allCompleted, filter, text, uid } = model
  let newItems

  switch (action) {
    case "changeText":
      return { ...model, text: value }
    case "addItem":
      return {
        ...model,
        text: "",
        allCompleted: false,
        items: [...items, newItem(value, uid)],
        uid: uid + 1
      }
    case "toggleItem":
      newItems = items.map(item => {
        return item.id == value ? { ...item, completed: !item.completed } : item
      })
      return {
        ...model,
        items: newItems,
        allCompleted: allItemsCompleted(newItems)
      }
    case "editItem":
      newItems = items.map(item => {
        return item.id == value ? { ...item, editing: true } : item
      })
      return { ...model, items: newItems }
    case "changeItemText":
      newItems = items.map(item => {
        return item.id == value.id ? { ...item, text: value.text } : item
      })
      return { ...model, items: newItems }
    case "cancelEdit":
      newItems = items.map(item => {
        return item.editing ? { ...item, editing: false } : item
      })
      return { ...model, items: newItems }
    case "updateItem":
      if (value == "") {
        let index = items.findIndex(item => item.editing)
        newItems = index == -1 ? items : removeItem(items, items[index].id)
      } else {
        newItems = items.map(item => {
          return item.editing ? { ...item, editing: false, text: value } : item
        })
      }
      return items != newItems ? { ...model, items: newItems } : model
    case "removeItem":
      newItems = removeItem(items, value)
      return {
        ...model,
        items: newItems,
        allCompleted: allItemsCompleted(newItems)
      }
    case "toggleAll":
      let newAllCompleted = !allCompleted

      newItems = items.map(item => {
        return { ...item, completed: newAllCompleted }
      })
      return { ...model, items: newItems, allCompleted: newAllCompleted }
    case "changeFilter":
      return { ...model, filter: value }
    case "clearCompleted":
      newItems = items.filter(item => !item.completed)
      return { ...model, items: newItems }
  }
}

function removeItem(items, id) {
  return items.filter(item => item.id != id)
}

function allItemsCompleted(items) {
  return items.every(item => item.completed)
}

function newItem(text, id) {
  return { id, text, completed: false, editing: false }
}

// View
function view(model) {
  let { text } = model
  let numItems = model.items.length

  return (
    <div>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autofocus={true}
            value={text}
            onInput={handleInput}
            onKeyDown={onEnter}
          />
        </header>
        {numItems > 0 ? <Main {...model} /> : ""}
        {numItems > 0 ? <Footer {...model} /> : ""}
      </section>
      <Info />
    </div>
  )
}

function handleInput(e) {
  let value = e.target.value.trimLeft()
  actions$.next(["changeText", value])
}

function onEnter(e) {
  if (e.code == "Enter") {
    let text = e.target.value.trim()
    if (text !== "") actions$.next(["addItem", text])
  }
}

function Main({ items, filter, allCompleted }) {
  function isVisible(item) {
    switch (filter) {
      case "all":
        return true
      case "completed":
        return item.completed
      case "active":
        return !item.completed
    }
  }

  return (
    <section className="main">
      <input className="toggle-all" type="checkbox" checked={allCompleted} onClick={toggleAll} />
      <label for="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {items.filter(isVisible).map(item => <Item {...item} />)}
      </ul>
    </section>
  )
}

function toggleAll() {
  actions$.next(["toggleAll"])
}

function toggleClass(className, enabled) {
  return enabled ? className : ""
}

function toggleClasses(classes) {
  let output = []
  for (let cls in classes) {
    output.push(toggleClass(cls, classes[cls]))
  }
  return output.join(" ")
}

function Item(item) {
  let { id, completed, editing, text } = item
  return (
    <li className={toggleClasses({ completed, editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onClick={linkEvent(id, checkboxClick)}
        />
        <label onDblClick={linkEvent(id, itemClick)}>{text}</label>
        <button className="destroy" onClick={linkEvent(id, destroyClick)} />
      </div>
      <input
        className="edit"
        onKeyDown={onEditDone}
        onBlur={onBlur}
        value={editing ? text : ""}
        onInput={linkEvent(id, itemInput)}
        onComponentDidMount={focusElement}
      />
    </li>
  )
}

function focusElement(oldVnode, vnode) {
  vnode.elm.focus()
}

function itemInput(id, e) {
  let text = e.target.value.trimLeft()
  actions$.next(["changeItemText", { id, text }])
}

function onEditDone(e) {
  switch (e.code) {
    case "Enter":
      let text = e.target.value.trim()
      actions$.next(["updateItem", text])
      break
    case "Escape":
      actions$.next(["cancelEdit"])
      break
  }
}

function onBlur(e) {
  let text = e.target.value.trim()
  actions$.next(["updateItem", text])
}

function itemClick(id) {
  actions$.next(["editItem", id])
}

function checkboxClick(id) {
  actions$.next(["toggleItem", id])
}

function destroyClick(id) {
  actions$.next(["removeItem", id])
}

function Footer({ items, filter }) {
  let numDone = numCompleted(items)
  let numLeft = items.length - numDone

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{numLeft} item{numLeft == 1 ? "" : "s"} left</strong>
      </span>
      <ul className="filters">
        <Filter filter="all" current={filter} />
        <Filter filter="active" current={filter} />
        <Filter filter="completed" current={filter} />
      </ul>
      {numDone >= 1
        ? <button className="clear-completed" onClick={clearCompleted}>
            Clear Completed ({numDone})
          </button>
        : ""}
    </footer>
  )
}

function numCompleted(items) {
  return items.filter(item => item.completed).length
}

function clearCompleted(e) {
  actions$.next(["clearCompleted"])
}

function Filter({ filter, current }) {
  return (
    <li>
      <Link route={filter} className={toggleClass("selected", filter == current)}>
        {filter}
      </Link>
    </li>
  )
}

function Info() {
  return (
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Created by <a href="https://github.com/dubiousdavid">David Sargeant</a>
      </p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  )
}

// Reduce
let model$ = actions$
  .do(x => console.log("Actions", x))
  .scan(update, initModel)
  .do(x => console.log("Model", x))
  .publishBehavior(initModel)
  .refCount()

// Save to local storage
function writeToStorage(model) {
  localStorage.setItem(storageKey, JSON.stringify(model))
}

model$.map(disableEditing).subscribe(writeToStorage)

function disableEditing(model) {
  let newItems = model.items.map(item => {
    return { ...item, editing: false }
  })
  return { ...model, items: newItems }
}

// Handle route change
router.addListener(changeFilter)

function changeFilter({ name }) {
  actions$.next(["changeFilter", name])
}

// Render
let view$ = model$.map(view)
let render = Inferno.createRenderer()
view$.subscribe(vNode => {
  render(document.getElementById("app"), vNode)
})
