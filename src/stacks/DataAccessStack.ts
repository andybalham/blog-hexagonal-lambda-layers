/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import DataAccessLayer from '../data-access/DataAccessLayer';

export type DataAccessStackProps = StackProps;

export default class DataAccessStack extends Stack {
  //
  constructor(scope: Construct, id: string, props?: DataAccessStackProps) {
    super(scope, id, props);

    const dataAccessLayer = new DataAccessLayer(this, 'DataAccessLayer');

    new CfnOutput(this, 'DataAccessLayerArn', {
      value: dataAccessLayer.layer.layerVersionArn,
    });
  }
}
