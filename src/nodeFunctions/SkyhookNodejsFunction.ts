import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

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
    // removing out bundling from other props to allow minify to be true unless explicitly set to false
    const { bundling, ...propsWithoutBundling } = props;
    super(scope, id, {
      // Skyhook defaults
      bundling: { minify: true, ...bundling },
      memorySize: 1024, // We have found this to typically represent a good balance of performance vs price.
      runtime: Runtime.NODEJS_14_X, // Currently CDK defaults to 12
      // Given props
      ...propsWithoutBundling,
    });
  }
}
