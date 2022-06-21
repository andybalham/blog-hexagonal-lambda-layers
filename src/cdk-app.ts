/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import ApplicationStack from './stacks/ApplicationStack';
import DataAccessStack from './stacks/DataAccessStack';
import DataAccessTestStack from './stacks/DataAccessTestStack';
import DataStorageStack from './stacks/DataStorageStack';
import HandlerTestStack from './stacks/HandlerTestStack';

const app = new App();
Tags.of(app).add('app', 'HexagonalLambdaLayersApp');

new DataStorageStack(app, 'DataStorageStack');
new DataAccessStack(app, 'DataAccessStack');
new ApplicationStack(app, 'ApplicationStack');

new HandlerTestStack(app, 'HandlerTestStack');
new DataAccessTestStack(app, 'DataAccessTestStack');
