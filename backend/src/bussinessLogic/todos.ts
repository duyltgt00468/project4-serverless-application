import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('Process for TODO business')
const todosAccess = new TodosAccess()
export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Process get all to for user id ' + userId);
    return todosAccess.getAllTodosForUser(userId)
}
export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
  const createdAt = new Date().toISOString()  
  const todoId = uuid.v4()
  let newItem: TodoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    ...newTodo,
    attachmentUrl: ''
  }
  logger.info('Process to create to do for item ' + newItem);
  return await todosAccess.createTodo(newItem)
}
  
export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoUpdate> {
  let todoUpdate: TodoUpdate = {...updatedTodo}
  logger.info('Process to update todo with user id ' + userId);
  return todosAccess.updateTodo(userId, todoId, todoUpdate)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
  logger.info('Process to update Url for user id ' + userId);
  return todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info('Process to delete todo with user id ' + userId);
  return todosAccess.deleteTodo(userId, todoId)
    
}