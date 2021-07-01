import TodoListItem from '../components/TodoListItem'
import AddTask from '../components/AddTask'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auth'
import { API_URL } from '../utils/constants'
import AuthRequired from '../middlewares/auth_required'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])

  function getTasks() {
    axios({
      url: API_URL + 'todo/',
      method: 'get',
      headers: {
        Authorization: 'Token ' + token
      }
    }).then(res => {
      console.log(res.data)
      setTasks(res.data)
      console.log("Tasks recieved")
    }).catch(error => {
      console.log(error)
      console.log("Couldn't recieve Tasks")
    })
  }

  const deleteTask = (id) => {
    axios({
      url: API_URL + `todo/${id}/`,
      method: 'delete',
      data: {
        id: id
      },
      headers: {
        Authorization: 'Token ' + token
      }
    }).then(res => {
      setTasks(prevTasks => {
        return (prevTasks.filter((task) => {
          return task.id !== id
        }))
      })
      console.log("Task Deleted!")
    }).catch(error => {
      console.log(error)
      console.log("Couldn't delete task")
    })
  }

  const updateTask = (id, newTitle) => {
    axios({
      url: API_URL + `todo/${id}/`,
      method: 'put',
      data: {
        title: newTitle
      },
      id: id,
      headers: {
        Authorization: 'Token ' + token
      }
    }).then(res => {
      console.log("Task updated successfully")
      getTasks()
    }).catch(error => {
      console.log(error)
      console.log("Couldn't update task")
    })
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <AuthRequired>
      <center>
        <div className="tasks">
          <AddTask
            onClick={getTasks}
          />
          <div className='mt-9 max-w-md mb-3 '>
            <span className='inline-block bg-blue-600 mb-4 py-2 mb-4 px-9 text-md text-white font-bold rounded-full '>
              Available Tasks
            </span>

            <div id="todo-list">
              {tasks.map((todoItem, i) => {
                return (<TodoListItem
                  key={todoItem.id}
                  id={todoItem.id}
                  title={todoItem.title}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />)
                })}
            </div>
          </div>
        </div>
      </center>
    </AuthRequired>
  )
}

