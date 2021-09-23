import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import { ProfileCICD } from './ci-cd-stack';


export class ProfileServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create S3 Buckets
     */
    const profileAssets = new s3.Bucket(
        this,
        'profileAssets',
        {
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
          websiteIndexDocument: "index.html",
        }
    );


    // /**
    //  * Create CloudFront Distribution
    //  */
    // const profileDistribution = new cloudfront.Distribution(
    //     this,
    //     'profileDistribution',
    //     {
    //         defaultBehavior: {
    //             origin: new origins.S3Origin(profileAssets)
    //         }
    //     }
    // );

    /**
     * Create CI/CD stack
     */
    const cicdStack = new ProfileCICD(
      this,
      'cicdStack',
      {
        githubTokenName: 'profileGithubToken',
        githubAccount: 'gaowexu',
        repoName: 'profile',
        branchName: 'master',
        profileAssets: profileAssets,
      }
    );


  }
}
