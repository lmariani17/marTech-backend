import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { Campaign } from '../entity/Campaign';
import { AppDataSource } from '../../data-source';

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

  const campaign = await campaignRepository.findOneBy({ id: campaignId });

  if (campaign) {
    if (interactionType === 'some_type') {
      campaign.budget -= 10;
    }

    await campaignRepository.save(campaign);
    console.log('Campaign updated successfully');
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

setInterval(consumeMessages, 30000);
