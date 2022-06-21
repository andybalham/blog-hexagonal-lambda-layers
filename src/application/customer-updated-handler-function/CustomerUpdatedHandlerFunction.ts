/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/extensions, import/no-absolute-path */
import { SNSEvent } from 'aws-lambda';
import { AccountDetailStore, CustomerStore } from '/opt/nodejs/data-access';
import CustomerUpdatedHandler from './CustomerUpdatedHandler';
import { CustomerUpdatedEvent } from '../../domain-contracts';
import {
  ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME,
  ENV_VAR_CUSTOMER_TABLE_NAME,
} from './constants';

const customerUpdatedHandler = new CustomerUpdatedHandler(
  new CustomerStore(process.env[ENV_VAR_CUSTOMER_TABLE_NAME]),
  new AccountDetailStore(process.env[ENV_VAR_ACCOUNT_DETAIL_TABLE_NAME])
);

export const handler = async (event: SNSEvent): Promise<void> => {
  //
  const CustomerUpdatedHandlerFunctionPromises = event.Records.map((r) => {
    const customerUpdatedEvent = JSON.parse(
      r.Sns.Message
    ) as CustomerUpdatedEvent;
    return customerUpdatedHandler.handleAsync(customerUpdatedEvent);
  });

  const CustomerUpdatedHandlerFunctionResults = await Promise.allSettled(
    CustomerUpdatedHandlerFunctionPromises
  );

  const rejectedReasons = CustomerUpdatedHandlerFunctionResults.filter(
    (r) => r.status === 'rejected'
  ).map((r) => (r as PromiseRejectedResult).reason);

  if (rejectedReasons.length > 0) {
    throw new Error(
      `One or more records were not successfully processed: ${JSON.stringify({
        rejectedReasons,
      })}`
    );
  }
};
