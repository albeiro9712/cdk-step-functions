#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
};

// Stacks del proyecto (se agregan fase por fase):
new DatabaseStack(app, 'DatabaseStack', { env });       // Fase 1
// new MessagingStack(app, 'MessagingStack', { env });  // Fase 2
// new LambdaStack(app, 'LambdaStack', { env });        // Fase 3
// new WorkflowStack(app, 'WorkflowStack', { env });    // Fase 4
// new ApiStack(app, 'ApiStack', { env });              // Fase 5
