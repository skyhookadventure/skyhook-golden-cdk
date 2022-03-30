import "@aws-cdk/assert/jest";
import { Stack } from "aws-cdk-lib/core";
import { SynthUtils } from "@aws-cdk/assert";
import EventBridgeNodejsListener from "../EventBridgeNodejsListener";

const testStack = new Stack();
new EventBridgeNodejsListener(testStack, "testFunction", {
  entry: "dummyEntry",
  eventPattern: { detailType: ["EventDetailTypeA"] },
});

it("creates a Lambda Function", () => {
  expect(testStack).toHaveResourceLike("AWS::Lambda::Function");
});

it("creates a rule with the provided event pattern", () => {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-eventpattern
  expect(testStack).toHaveResourceLike("AWS::Events::Rule", {
    EventPattern: {
      "detail-type": ["EventDetailTypeA"],
    },
  });
});

it("creates a dead letter queue for failures", () => {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html
  expect(testStack).toHaveResourceLike("AWS::SQS::Queue", {
    MessageRetentionPeriod: 1209600, // 14 days (maximum)
  });
});

it("sets the event target as the lambda, with a dead letter queue", () => {
  // Note we have to put hardcoded random IDs from the snapshot below as there is no way to set these
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html
  expect(testStack).toHaveResourceLike("AWS::Events::Rule", {
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": ["testFunctionLambda78269C17", "Arn"],
        },
        DeadLetterConfig: {
          Arn: {
            "Fn::GetAtt": ["testFunctionDeadLetterQueue126C440D", "Arn"],
          },
        },
        Id: "Target0",
      },
    ],
  });
});

it("creates an alarm on the dead letter queue", () => {
  expect(testStack).toHaveResourceLike("AWS::CloudWatch::Alarm", {
    MetricName: "NumberOfMessagesReceived",
    Namespace: "AWS/SQS",
  });
});

it("creates resources matching the snapshot", () => {
  const cfn = SynthUtils.toCloudFormation(testStack);
  expect(cfn).toMatchSnapshot();
});
