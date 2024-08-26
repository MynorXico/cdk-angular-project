import * as cdk from 'aws-cdk-lib';
import { Construct} from "constructs";
import { CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {CdkAngularProjectStack} from "./cdk-angular-project-stack";
import {CdkAngularProjectStage} from "./cdk-angular-project-stage";

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'CdkngularProject',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('MynorXico/repo', 'main'),
                commands: ['cd infra', 'npm ci', 'npm run build', 'npx cdk synth']
            })
        })

        const prodStage = pipeline.addStage(new CdkAngularProjectStage(this, 'Production', {}))
    }
}