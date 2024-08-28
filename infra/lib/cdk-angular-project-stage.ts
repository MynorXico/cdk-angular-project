import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {CdkAngularProjectStack} from "./cdk-angular-project-stack";

export class CdkAngularProjectStage extends cdk.Stage {
    public webHostingBucket;
    constructor(scope: Construct, id: string, props?:cdk.StageProps){
        super(scope, id, props)

        const cdkAngularProjectStack = new CdkAngularProjectStack(this, 'CdkAngularProjectStack', {

        })
        this.webHostingBucket = cdkAngularProjectStack.hostingBucket;
    }
}