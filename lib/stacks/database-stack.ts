import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly ordersTable: dynamodb.Table;
  public readonly inventoryTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'Orders',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.inventoryTable = new dynamodb.Table(this, 'InventoryTable', {
      tableName: 'Inventory',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'OrdersTableName', { value: this.ordersTable.tableName });
    new cdk.CfnOutput(this, 'InventoryTableName', { value: this.inventoryTable.tableName });
  }
}
