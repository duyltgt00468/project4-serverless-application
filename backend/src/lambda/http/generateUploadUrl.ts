import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { AttachmentUtils } from '../../dataLayer/attachmentUtils'
import { updateAttachmentUrl } from '../../bussinessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from "../../utils/logger";
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger("generateUpload-todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const attachmentUtils = new AttachmentUtils()

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)
    try {
      const attachmentId = uuidv4()
      let uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(attachmentId);
      const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)
      await updateAttachmentUrl(userId, todoId, attachmentUrl)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl
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
