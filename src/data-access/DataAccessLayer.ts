/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import {
  ILayerVersion,
  LayerVersion,
  Runtime,
  Code,
} from 'aws-cdk-lib/aws-lambda';
import {
  StringParameter,
  ParameterType,
  ParameterTier,
} from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import path from 'path';

export default class DataAccessLayer extends Construct {
  //
  static readonly LAYER_ARN_SSM_PARAMETER = '/layer-arn/data-access';

  readonly layer: ILayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.layer = new LayerVersion(this, 'DataAccessLayer', {
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
      code: Code.fromAsset(
        path.join(__dirname, `/../../dist/src/data-access/layer`)
      ),
      description: 'Provides data access clients',
    });

    new StringParameter(this, 'DataAccessLayerArnSsmParameter', {
      parameterName: DataAccessLayer.LAYER_ARN_SSM_PARAMETER,
      stringValue: this.layer.layerVersionArn,
      description: 'The ARN of the latest Data Access layer',
      type: ParameterType.STRING,
      tier: ParameterTier.STANDARD,
    });
  }
}
