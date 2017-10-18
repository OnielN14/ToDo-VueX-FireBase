export let TodoList = {
  template :
  "
  <div>
    <ul>
      <li v-for='todo in todos' :id={{todo.id}}>
        <span>{{todo.detail}}</span>
      </li>
    </ul>
  </div>
  "

}
