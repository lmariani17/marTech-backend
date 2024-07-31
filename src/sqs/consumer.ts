import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { Campaign } from '../entity/Campaign';
import { AppDataSource } from '../../data-source';
import { EventType } from '../common/eventTypes';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const processMessage = async (messageBody: string) => {
  const { campaignId, interactionType } = JSON.parse(messageBody);
  const campaignRepository = AppDataSource.getRepository(Campaign);

  try {
    const campaign = await campaignRepository.findOne({ where: { id: Number(campaignId), deletedAt: undefined } });
    if (campaign) {
      switch (interactionType) {
        case EventType.CLICK:
          campaign.budget -= 1000;
          await campaignRepository.save(campaign);
          console.log(`Click event processed. Budget decreased by 1000.`);
          break;
        case EventType.ADD:
          campaign.budget += 1000;
          await campaignRepository.save(campaign);
          console.log(`Add event processed. Budget increased by 1000.`);
          break;
        default:
          console.log(`Unknown interaction type: ${interactionType}`);
      }
    }
  } catch (error: any) {
    console.error('Error processing message', error);
  }
};

const consumeMessages = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
  });

  try {
    const response = await sqsClient.send(command);

    if (response.Messages) {
      for (const message of response.Messages) {
        await processMessage(message.Body!);

        const deleteCommand = new DeleteMessageCommand({
          QueueUrl: process.env.SQS_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle!,
        });

        await sqsClient.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error('Error receiving messages', error);
  }
};

const startConsumer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log('[CONSUMER] Data Source has been initialized!');
      setInterval(consumeMessages, 5000);

      break;
    } catch (err: any) {
      console.error('[CONSUMER] Error during Data Source initialization', err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

startConsumer();