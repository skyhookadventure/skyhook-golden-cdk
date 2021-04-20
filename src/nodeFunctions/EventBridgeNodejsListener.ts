import { Alarm } from "@aws-cdk/aws-cloudwatch";
import { NodejsFunctionProps } from "@aws-cdk/aws-lambda-nodejs";
import { Rule, RuleProps } from "@aws-cdk/aws-events";
import { Duration, Construct } from "@aws-cdk/core";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { Queue } from "@aws-cdk/aws-sqs";
import SkyhookNodejsFunction from "./SkyhookNodejsFunction";

/**
 * EventBridge Nodejs Listener
 *
 * Creates a SkyhookNodejsFunction {@link SkyhookNodejsFunction} & hooks in up to an Appsync Resolver.
 *
 * We recommend using the typescript type `EventBridgeHandler` from `types/aws-lambda`, within your handler code.
 */
export default class EventBridgeNodejsListener extends SkyhookNodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    {
      description,
      entry,
      eventBus,
      eventPattern,
      handler,
    }: LambdaMutationResolverProps
  ) {
    super(scope, `${id}Lambda`, {
      entry,
      description,
      handler,
    });

    const deadLetterQueue = new Queue(scope, `${id}DeadLetterQueue`, {
      retentionPeriod: Duration.days(14),
    });

    const ruleTarget = new LambdaFunction(this, { deadLetterQueue });

    new Rule(scope, `${id}Rule`, {
      targets: [ruleTarget],
      eventPattern,
      eventBus,
      description,
    });

    new Alarm(scope, `${id}Alarm`, {
      alarmDescription: `Event listener ${id} has failed to process an event.`,
      evaluationPeriods: 1,
      metric: deadLetterQueue.metricNumberOfMessagesReceived(),
      threshold: 1,
    });
  }
}

interface LambdaMutationResolverProps {
  /** Description for both the lambda and the EventBridge rule */
  description?: string;
  entry: NodejsFunctionProps["entry"];
  eventBus?: RuleProps["eventBus"];
  eventPattern: RuleProps["eventPattern"];
  handler?: NodejsFunctionProps["handler"];
}
