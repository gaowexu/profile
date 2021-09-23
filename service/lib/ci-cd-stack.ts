import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import {Construct} from "@aws-cdk/core";
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import { IBucket } from "@aws-cdk/aws-s3";


export interface ProfileCICDProps {
    readonly githubTokenName: string,
    readonly githubAccount: string,
    readonly repoName: string,
    readonly branchName: string,
    readonly profileAssets: IBucket,
}


export class ProfileCICD extends Construct {
    constructor(scope: Construct, id: string, props: ProfileCICDProps) {
        super(scope, id);

        /**
         * Create S3 Bucket for Storing Artifacts
         */
        const profileArtifacts = new s3.Bucket(
            this,
            'profileArtifacts',
            {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
            }
        );

        /**
         * Create IAM role
         */
        const profileCodePipelineRole = new iam.Role(
            this,
            "profileCodePipelineRole",
            {
                assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                    iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'),
                ]
            }
        );

        const profileBuildRole = new iam.Role(
            this,
            "profileBuildRole",
            {
                assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                    iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'),
                ]
            }
        );

        const profileSourceArtifact = new codepipeline.Artifact('profileSourceArtifact');
        const profileBuildArtifact = new codepipeline.Artifact('profileBuildArtifact');
        
        
        /**
         * Define Source Action
         */
        const sourceAction = new cpactions.GitHubSourceAction({
            actionName: "Source",
            oauthToken: cdk.SecretValue.secretsManager(props.githubTokenName),
            output: profileSourceArtifact,
            owner: props.githubAccount,
            repo: props.repoName,
            branch: props.branchName,
            runOrder: 1,
            trigger: cpactions.GitHubTrigger.WEBHOOK,
            variablesNamespace: 'Source'
        });


        /**
         * Define Build Action
         */
        const codeBuildProject = new codebuild.Project(
            this,
            'buildProject',
            {
                environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
                },
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        install: {
                            commands: [
                                'echo "-------------- Install Dependencies -------------"',
                                'node --version',
                                'npm --version',
                                'cd web && npm install',
                            ],
                        },
                        pre_build: {
                            commands: [
                                'echo "------------------ Pre-Build --------------------"',
                            ],
                        },
                        build: {
                            commands: [
                                'echo "-------------------- Build ----------------------"',
                                'npm run build',
                            ],
                        },
                        post_build: {
                            commands: [
                                'echo "------------------ Post-Build -------------------"',
                            ],
                        }
                    },
                    artifacts: {
                        files: [
                            "**/*"
                        ],
                        'base-directory': 'web/build',
                    }
                }),
                role: profileBuildRole,
                badge: false,
                timeout: cdk.Duration.hours(1),
                concurrentBuildLimit: 100,
            }
        );


        const buildAction = new cpactions.CodeBuildAction({
            actionName: "Build",
            input: profileSourceArtifact,
            outputs: [profileBuildArtifact],
            project: codeBuildProject,
            checkSecretsInPlainTextEnvVariables: true,
            combineBatchBuildArtifacts: false,
            executeBatchBuild: false,
            runOrder: 1,
            type: cpactions.CodeBuildActionType.BUILD,
            variablesNamespace: "Build",
        });


        // /**
        //  * Define Approve Action
        //  */
        // const approveAction = new cpactions.ManualApprovalAction({
        //     actionName: 'Approve',
        //     runOrder: 1,
        //     variablesNamespace: "Approve",
        // });


        /**
         * Deploy Deploy Action
         */
        const deployAction = new cpactions.S3DeployAction({
            actionName: "DeployToS3",
            bucket: props.profileAssets,
            input: profileBuildArtifact,
            extract: true,
            runOrder: 1,
            variablesNamespace: "Deployment",
        });


        const profilePipeline = new codepipeline.Pipeline(
            this,
            'profilePipeline',
            {
                artifactBucket: profileArtifacts,
                role: profileCodePipelineRole,
                restartExecutionOnUpdate: true,
                crossAccountKeys: false,
                enableKeyRotation: false,
                stages: [
                    {
                        stageName: 'Source',
                        actions: [sourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [buildAction],
                    },
                    // {
                    //     stageName: 'Approve',
                    //     actions: [approveAction],
                    // },
                    {
                        stageName: 'Deployment',
                        actions: [deployAction],
                    },
                ],
            }
        );

    }
}
