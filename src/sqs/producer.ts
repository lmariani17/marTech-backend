import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const sendMessageToQueue = async (messageBody: string) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: messageBody,
  });

  try {
    const response = await sqsClient.send(command);
    console.log('Message sent successfully', response.MessageId);
  } catch (error) {
    console.error('Error sending message', error);
  }
};
