import * as cdk from 'aws-cdk-lib';
import { Construct} from "constructs";
import { CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {CdkAngularProjectStack} from "./cdk-angular-project-stack";
import {CdkAngularProjectStage} from "./cdk-angular-project-stage";
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {SecretValue} from "aws-cdk-lib";


export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'CdkngularProject',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('MynorXico/cdk-angular-project', 'main'),
                commands: ['cd infra', 'npm ci', 'npm run build', 'npx cdk synth'],
                primaryOutputDirectory: "infra/cdk.out"
            })
        })

        let prodAngularProjectInfra = new CdkAngularProjectStage(this, 'Production', {})
        const prodInfra = pipeline.addStage(prodAngularProjectInfra)


       // Create the source output artifact
        const sourceOutput = new codepipeline.Artifact();

        // Create the source action to pull code fom GitHub
        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub',
            owner: 'MynorXico',
            repo: 'cdk-angular-project',
            branch: 'main',
            output: sourceOutput,
            oauthToken: SecretValue.secretsManager('github-token')
        })

        // Create CodeBuild project for the application
        const buildProject = new codebuild.PipelineProject(this, 'AngularAppBuildProject', {
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            }
        })

        // Create the build output artifact
        const buildOutput = new codepipeline.Artifact('BuildOutput');

        // Create the build action
        const buildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CodeBuild',
            project: buildProject,
            input: sourceOutput,
            outputs: [buildOutput]
        });


        // Create the S3 deploy action to prod
        const s3DeployAction = new codepipeline_actions.S3DeployAction({
            actionName: 'S3Deploy',
            bucket: s3.Bucket.fromBucketName(this, 'ProdAngularBucket', 'mxico-cdk-angular-project-stack'),// prodAngularProjectInfra.webHostingBucket,
            input: buildOutput
        })

        const appPipeline = new codepipeline.Pipeline(this, 'MyAngularAppPipeline', {
            pipelineName: 'MyPipeline',
            stages: [
                {
                    stageName: 'Source',
                    actions: [sourceAction]
                },
                {
                    stageName: 'Build',
                    actions: [buildAction]
                },
                {
                    stageName: 'Deploy',
                    actions: [s3DeployAction]
                }
            ]
        });

    }
}