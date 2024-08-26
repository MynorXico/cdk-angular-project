import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {BucketAccessControl} from "aws-cdk-lib/aws-s3";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkAngularProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAngularProjectQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const hostingBucket = new s3.Bucket(this, 'WebHostingBucket', {
      accessControl: BucketAccessControl.PUBLIC_READ,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html'
    })
  }
}
