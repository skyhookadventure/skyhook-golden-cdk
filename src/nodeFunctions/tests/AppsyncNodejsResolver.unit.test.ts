import "@aws-cdk/assert/jest";
import { Stack } from "@aws-cdk/core";
import { SynthUtils } from "@aws-cdk/assert";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { AppsyncNodejsResolver } from "../..";

const testStack = new Stack();
const api = GraphqlApi.fromGraphqlApiAttributes(testStack, "api", {
  graphqlApiId: "testID",
});
new AppsyncNodejsResolver(testStack, "testFunction", {
  api,
  entry: "dummyEntry",
  fieldName: "booking",
  typeName: "Query",
});

it("creates a Lambda Function", () => {
  expect(testStack).toHaveResourceLike("AWS::Lambda::Function");
});

it("creates a data source for the lambda", () => {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html
  expect(testStack).toHaveResourceLike("AWS::AppSync::DataSource", {
    ApiId: "testID",
  });
});

it("creates a resolver with the data source", () => {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html
  expect(testStack).toHaveResourceLike("AWS::AppSync::Resolver", {
    ApiId: "testID",
    FieldName: "booking",
    TypeName: "Query",
  });
});

it("creates resources matching the snapshot", () => {
  const cfn = SynthUtils.toCloudFormation(testStack);
  expect(cfn).toMatchSnapshot();
});
