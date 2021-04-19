# Skyhook Golden CDK

[![Built with
typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)

Contains L3 CDK constructs that define company defaults & simplify common practices.

## L3 CDK Constructs Provided

| Construct                 | Description                                                                                                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SkyhookNodejsFunction     | Adds some defaults to the standard [NodejsFunction](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction) that we prefer to use, including higher memory and minifying the code. |
| AppsyncNodejsResolver     | Creates a SkyhookNodejsFunction & hooks it up to an Appsync Resolver.                                                                                                                                                 |
| EventBridgeNodejsListener | Creates a SkyhookNodejsFunction & hooks it up to an EventBridge rule.                                                                                                                                                 |

## Uses CDK Peer Dependencies

CDK requires that all your `@aws-cdk/xyz` modules are the same version. This module therefore uses peer dependencies for
all cdk modules so that whichever version you have on your service should work.

## Built by Skyhook

This module is contributed by the team at [Skyhook](https://www.skyhookadventure.com/).
