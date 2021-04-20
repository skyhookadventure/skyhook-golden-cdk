import {
  NodejsFunction,
  NodejsFunctionProps,
} from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

/**
 * Skyhook Nodejs Function
 *
 * Adds some defaults to the standard
 * [NodejsFunction](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction) that we
 * prefer to use, including higher memory and minifying the code.
 *
 * Note that we highly recommend having esbuild in your project dev dependencies as cdk will then compile your function
 * using esbuild, which is much faster than webpack.
 */
export default class SkyhookNodejsFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    super(scope, id, {
      // Skyhook defaults
      bundling: { minify: true },
      memorySize: 1024, // We have found this to typically represent a good balance of performance vs price.
      runtime: Runtime.NODEJS_14_X, // Currently CDK defaults to 12
      // Given props
      ...props,
    });
  }
}
