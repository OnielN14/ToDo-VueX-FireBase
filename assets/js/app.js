const store = new Vuex.Store({
  state : {
    todos : [],
    newTodo : ''
  },
  mutations : {
    LOAD_TODO(state, data){
      state.todos = data
    },
    GET_TODO(state, todo){
      state.newTodo = todo
    },
    ADD_TODO(state){
      todo = {
        detail: state.newTodo,
        done: false
      }
      state.todos.push(todo)
      Vue.http.put('https://my-todo-2f654.firebaseio.com/v1/todos.json',state.todos)
    },
    EDIT_TODO(state, todo){
      let todos = state.todos
      todos.splice(todos.indexOf(todo),1)
      state.todos = todos
      state.newTodo = todo.detail
    },
    REMOVE_TODO(state, todo){
      let todos = state.todos
      todos.splice(todos.indexOf(todo), 1 )
      Vue.http.put('https://my-todo-2f654.firebaseio.com/v1/todos.json',todos)
    },
    DONE_TODO(state, todo){
      todo.done = !todo.done
      Vue.http.put('https://my-todo-2f654.firebaseio.com/v1/todos.json',state.todos)
    },
    CLEAR_TODO(state){
      state.newTodo = ''
    }
  },
  getters: {
    newTodo:function(state){
      return state.newTodo
    },
    todos : function(state){
      return state.todos.filter(function(todo){
        return !todo.done
      })
    },
    doneTodos : function(state){
      return state.todos.filter(function(todo){
        return todo.done
      })
    }
  },
  actions: {
    loadTodo(state){
      Vue.http.get('https://my-todo-2f654.firebaseio.com/v1/todos.json')
        .then(function(data){
          return data.json()
        })
        .then(function(data){
          let temp = []
          for(let key in data){
            temp.push(data[key])
          }
          state.commit('LOAD_TODO',temp)
        })
    },
    getTodo({commit}, todo){
      commit('GET_TODO', todo)
    },
    addTodo(state){
      state.commit('ADD_TODO')
    },
    editTodo({commit}, todo){
      commit('EDIT_TODO', todo)
    },
    removeTodo({commit}, todo){
      commit('REMOVE_TODO', todo)
    },
    doneTodo({commit}, todo){
      commit('DONE_TODO', todo)
    },
    clearTodo({commit}){
      commit('CLEAR_TODO')
    }
  }
})


let GetTodo = {
  template : "#component-get-todo",
  methods : {
    getTodo(e){
      this.$store.dispatch('getTodo', e.target.value)
    },
    addTodo(){
      this.$store.dispatch('addTodo')
      this.$store.dispatch('clearTodo')
    }
  },
  computed : {
    newTodo(){
      return this.$store.getters.newTodo
    }
  }
}

let TodoList = {
  template : '#component-current-todos',
  methods : {
    edit(todo){
      this.$store.dispatch('editTodo',todo)
    },
    done(todo){
      this.$store.dispatch('doneTodo',todo)
    },
    remove(todo){
      this.$store.dispatch('removeTodo',todo)
    }
  },
  computed : {
    todos(){
      return this.$store.getters.todos
    }
  }
}

let CompleteTodo = {
  template : '#component-completed-todos',
  computed : {
    completed(){
      return this.$store.getters.doneTodos
    }
  },
  methods : {
    remove(todo){
      this.$store.dispatch('removeTodo', todo)
    }
  }
}

const app = new Vue({
  el:"#app",
  store,
  components : {
    TodoList, CompleteTodo, GetTodo
  },
  beforeCreate:function(){
    store.dispatch('loadTodo')
  },
  template : "#app-layout"
})

function $(selector){
  return document.querySelector(selector)
}

$('input[type="text"]#addTodo').addEventListener('keyup',function(event){
  if(event.keyCode == 13){
    $('button[type="button"]').click()
  }
})
