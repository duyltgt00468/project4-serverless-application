import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../bussinessLogic/todos'
import { createLogger } from "../../utils/logger";

const logger = createLogger("create-todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      if(newTodo.name.trim() == ""){
        return {
          statusCode: 400,
          body: "Input TODO name"
        }
      }else{
        const userId = getUserId(event)
        const item = await createTodo(userId, newTodo)
        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            item
          })
        }
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
handler.use(
  cors({
    credentials: true
  })
)
