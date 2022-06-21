/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import DataAccessLayer from '../data-access/DataAccessLayer';
import CustomerUpdatedHandler from '../application/CustomerUpdatedHandler';
import { AccountDetailTable, CustomerTable } from '../data-storage';

export type TestStackProps = StackProps;

export default class HandlerTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'HandlerTestStack';

  static readonly CustomerUpdatedTopicId = 'CustomerUpdatedTopic';

  static readonly AccountDetailTableId = 'AccountDetailTable';

  static readonly CustomerTableId = 'CustomerTable';

  constructor(scope: Construct, id: string, props?: TestStackProps) {
    super(scope, id, {
      testStackId: HandlerTestStack.Id,
      ...props,
    });

    const customerUpdatedTopic = new Topic(this, 'CustomerUpdatedTopic');
    this.addTestResourceTag(
      customerUpdatedTopic,
      HandlerTestStack.CustomerUpdatedTopicId
    );

    const customerTable = new CustomerTable(this, 'CustomerTable', {
      isTestResource: true,
    });
    this.addTestResourceTag(
      customerTable.table,
      HandlerTestStack.CustomerTableId
    );

    const accountDetailTable = new AccountDetailTable(
      this,
      'AccountDetailTable',
      {
        isTestResource: true,
      }
    );
    this.addTestResourceTag(
      accountDetailTable.table,
      HandlerTestStack.AccountDetailTableId
    );

    const dataAccessLayerArnSsmParameter =
      StringParameter.fromStringParameterName(
        this,
        'DataAccessLayerArnSsmParameter',
        DataAccessLayer.LAYER_ARN_SSM_PARAMETER
      );

    new CustomerUpdatedHandler(this, 'CustomerUpdatedHandler', {
      dataAccessLayerArn: dataAccessLayerArnSsmParameter.stringValue,
      customerUpdatedTopic,
      customerTableName: customerTable.table.tableName,
      accountDetailTableName: accountDetailTable.table.tableName,
    });
  }
}
