import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../bussinessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from "../../utils/logger";

const logger = createLogger("update-todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    try {
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId = getUserId(event)
      const resultItem = await updateTodo(userId, todoId, updatedTodo)
      if(resultItem.name.trim() == ""){
        return {
          statusCode: 400,
          body: "Input TODO Name"
        }
      }
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          resultItem
        })
      }
    } catch (e) {
      logger.error(e.message)
      return {
        statusCode: 500,
        body: e.message
      }
    }
  }
)
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
