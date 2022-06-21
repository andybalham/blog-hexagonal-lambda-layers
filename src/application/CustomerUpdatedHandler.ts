/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  AssetCode,
  Function,
  LayerVersion,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import path from 'path';
import {
  ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME,
  ENV_VAR_CUSTOMER_TABLE_NAME,
} from './customer-updated-handler-function/constants';

export interface CustomerUpdatedProps {
  dataAccessLayerArn: string;
  customerUpdatedTopic: ITopic;
  customerTableName: string;
  accountDetailTableName: string;
}

export default class CustomerUpdatedHandler extends Construct {
  constructor(scope: Construct, id: string, props: CustomerUpdatedProps) {
    super(scope, id);

    const customerTable = Table.fromTableName(
      this,
      'CustomerTable',
      props.customerTableName
    );

    const accountDetailTable = Table.fromTableName(
      this,
      'AccountDetailTable',
      props.accountDetailTableName
    );

    const dataAccessLayer = LayerVersion.fromLayerVersionArn(
      this,
      'DataAccessLayer',
      props.dataAccessLayerArn
    );

    const customerUpdatedHandlerFunction = new Function(
      scope,
      'CustomerUpdatedHandlerFunction',
      {
        runtime: Runtime.NODEJS_14_X,
        handler: 'CustomerUpdatedHandlerFunction.handler',
        code: new AssetCode(
          path.join(
            __dirname,
            `/../../dist/src/application/customer-updated-handler-function`
          )
        ),
        environment: {
          [ENV_VAR_CUSTOMER_TABLE_NAME]: props.customerTableName,
          [ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME]: props.accountDetailTableName,
        },
        layers: [dataAccessLayer],
      }
    );

    props.customerUpdatedTopic.addSubscription(
      new LambdaSubscription(customerUpdatedHandlerFunction)
    );

    customerTable.grantReadData(customerUpdatedHandlerFunction);
    accountDetailTable.grantReadWriteData(customerUpdatedHandlerFunction);
  }
}
