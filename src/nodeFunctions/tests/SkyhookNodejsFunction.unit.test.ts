import { Stack } from 'aws-cdk-lib/core';
import { SynthUtils } from '@aws-cdk/assert';
import SkyhookNodejsFunction from '../SkyhookNodejsFunction';
import '@aws-cdk/assert/jest';

const testStack = new Stack();
new SkyhookNodejsFunction(testStack, 'testFunction', { entry: 'dummyEntry' });

it('creates a Lambda Function with the expected defaults', () => {
  // Options at https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
  expect(testStack).toHaveResourceLike('AWS::Lambda::Function', {
    MemorySize: 1024,
    Runtime: 'nodejs20.x',
  });
});

it('creates resources matching the snapshot', () => {
  const cfn = SynthUtils.toCloudFormation(testStack);
  expect(cfn).toMatchSnapshot();
});
