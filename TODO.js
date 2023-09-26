//*declare and get elements from
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const filters = document.querySelector(".todo-filter");

let filterValue = "all";

class TodoObject{

    addNewTodo(){
       
        if(!todoInput.value) return null;

        const todo = {
            id : Date.now(),
            title : todoInput.value ,
            createdAt : new Date().toISOString(),
            isCompleted :false,
        }
        Storage.saveTodo(todo);
        // TodoObject.filterTodos();
    }

    static filterTodos(){
        const todos = Storage.getAllTodos();
        switch (filterValue){
            case "completed":
                UI.showNewTodo(todos.filter((todo)=>todo.isCompleted));
                break;
            case "uncompleted":
                UI.showNewTodo(todos.filter((todo)=>!todo.isCompleted));
                break;
            case "all":
                UI.showNewTodo(todos);

            default:
                UI.showNewTodo(todos);
                break;
        }
    }

    static removeTodo(e){
        let todos = Storage.getAllTodos();
        const Id = Number(e.target.dataset.id);
        todos = todos.filter((todo)=>todo.id!==Id);
        Storage.saveAllTodos(todos);
        TodoObject.filterTodos();
    }

    static checkTodo(e){
        let todos = Storage.getAllTodos();
        const Id = Number(e.target.dataset.id);
        const todo = todos.find((todo)=> todo.id ==Id);
        todo.isCompleted = !todo.isCompleted;
        Storage.saveAllTodos(todos);
        TodoObject.filterTodos();
    }
}




class UI{
    static showNewTodo(todos){

        let result = "";

        todos.forEach((todo,index)=> {
            result += `
            <li class="todo">
            <span>${index+1}</span>
                <span class="todo__title ${todo.isCompleted ? 'completed' : ''}" >${todo.title}</span>
                <span class="todo__createdAt">${new Date().toLocaleDateString("us", todo.createdAt)}</span>
                <button class="todo__remove" data-id =${todo.id}>
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="todo__check" data-id =${todo.id}>
                    <i class="far fa-check-square"></i>
                </button>
            </li>
            `;
        });
        todoList.innerHTML = result;
        todoInput.value="";

        const removeBtns = [...document.querySelectorAll(".todo__remove")];
        const checkBtns = [...document.querySelectorAll(".todo__check")];

        removeBtns.forEach((btn)=>{
            btn.addEventListener("click", TodoObject.removeTodo);
        });
        checkBtns.forEach((btn)=>{
            btn.addEventListener("click" , TodoObject.checkTodo);
        });
    }
}


class Storage{
    static getAllTodos(){
        return JSON.parse(localStorage.getItem("TODOS")) || [] ;
    }

    static saveTodo(todo){
        const savedTodos = JSON.parse(localStorage.getItem("TODOS")) || [] ;
        savedTodos.push(todo);
        localStorage.setItem("TODOS", JSON.stringify(savedTodos));
    }

    static saveAllTodos(todos){
        localStorage.setItem("TODOS" , JSON.stringify(todos));
    }
}




//*add events

todoForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const newTodo= new TodoObject();
    newTodo.addNewTodo();
    UI.showNewTodo(Storage.getAllTodos());
    TodoObject.filterTodos();
})

filters.addEventListener("change" ,(e) => {
    filterValue = e.target.value;
    TodoObject.filterTodos();
})

document.addEventListener("DOMContentLoaded" , (e)=>{
    UI.showNewTodo(Storage.getAllTodos());
    TodoObject.filterTodos();
})