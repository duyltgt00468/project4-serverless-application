import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodosForUser } from '../../bussinessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from "../../utils/logger";

const logger = createLogger("get-todo");

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId = getUserId(event)
      const todos = await getAllTodosForUser(userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items: todos
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
handler.use(
  cors({
    credentials: true
  })
)
