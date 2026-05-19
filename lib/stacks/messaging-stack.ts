import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class MessagingStack extends cdk.Stack {
  public readonly shippingQueue: sqs.Queue;
  public readonly shippingDlq: sqs.Queue;
  public readonly orderNotificationsTopic: sns.Topic;
  public readonly eventBus: events.EventBus;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.shippingDlq = new sqs.Queue(this, 'ShippingDlq', {
      queueName: 'ShippingDLQ',
      retentionPeriod: cdk.Duration.days(14),
    });

    this.shippingQueue = new sqs.Queue(this, 'ShippingQueue', {
      queueName: 'ShippingQueue',
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: {
        queue: this.shippingDlq,
        maxReceiveCount: 3,
      },
    });

    this.orderNotificationsTopic = new sns.Topic(this, 'OrderNotificationsTopic', {
      topicName: 'OrderNotifications',
      displayName: 'Order Notifications',
    });

    this.eventBus = new events.EventBus(this, 'EcommerceEventBus', {
      eventBusName: 'EcommerceEventBus',
    });

    new events.Rule(this, 'OrderCreatedRule', {
      eventBus: this.eventBus,
      ruleName: 'OrderCreatedRule',
      description: 'Enruta OrderCreated hacia Step Functions',
      eventPattern: {
        source: ['ecommerce.orders'],
        detailType: ['OrderCreated'],
      },
      // targets se agregan en Fase 4 cuando Step Functions exista
    });

    new cdk.CfnOutput(this, 'ShippingQueueUrl', { value: this.shippingQueue.queueUrl });
    new cdk.CfnOutput(this, 'ShippingDlqUrl', { value: this.shippingDlq.queueUrl });
    new cdk.CfnOutput(this, 'OrderNotificationsTopicArn', { value: this.orderNotificationsTopic.topicArn });
    new cdk.CfnOutput(this, 'EventBusName', { value: this.eventBus.eventBusName });
  }
}
