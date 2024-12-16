import { IGraphqlApi, LambdaDataSource, Resolver, ResolverProps } from 'aws-cdk-lib/aws-appsync';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import SkyhookNodejsFunction from './SkyhookNodejsFunction';

/**
 * Appsync Nodejs Resolver
 *
 * Creates a {@link SkyhookNodejsFunction} & hooks it up to an EventBridge rule.
 *
 * The lambda is invoked as a
 * (direct lambda resolver)[https://docs.aws.amazon.com/appsync/latest/devguide/direct-lambda-reference.html] so we
 * recommend using the typescript type `AppSyncResolverHandler` from
 * `types/aws-lambda`, within your handler code.
 */
export default class AppsyncNodejsResolver extends SkyhookNodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    { api, typeName, fieldName, entry, handler, timeout, ...resolverProps }: LambdaMutationResolverProps,
  ) {
    super(scope, `${id}Lambda`, {
      description: `Appsync Resolver for field ${fieldName} on type ${typeName}.`,
      entry,
      handler,
      timeout,
    });

    const dataSource = new LambdaDataSource(scope, `${id}DataSource`, {
      api,
      description: `Data source for field ${fieldName} on type ${typeName}.`,
      lambdaFunction: this,
    });

    new Resolver(scope, `${id}Resolver`, {
      api,
      dataSource,
      fieldName,
      typeName,
      ...resolverProps,
    });
  }
}

type LambdaMutationResolverProps = {
  /**
   * API
   *
   * @example
   * // Import the API
   * const apiID = StringParameter.fromStringParameterAttributes(this, 'apiID', {
   *   parameterName: '/api/apiId',
   * }).stringValue;
   * const api = GraphqlApi.fromGraphqlApiAttributes(this, 'api', {
   *   graphqlApiId: apiID,
   * });
   */
  api: IGraphqlApi;
  entry: NodejsFunctionProps['entry'];
  fieldName: ResolverProps['fieldName'];
  handler?: NodejsFunctionProps['handler'];
  typeName: ResolverProps['typeName'];
  timeout?: NodejsFunctionProps['timeout'];
} & Omit<ResolverProps, 'api' | 'dataSource' | 'fieldName' | 'typeName'>;
