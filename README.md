## Deploy React App to S3 Bucket with AWS Code Pipeline CI/CD

*Solutions Architect: gaowexu*

## Contents
* [Introduction](#Introduction)
* [Architecture](#Architecture)
* [Deployment](#Deployment)
* [Usage](#Usage)
* [License](#License)

**Reference**:
- Youtube Video: https://www.youtube.com/watch?v=Mgs7jl430vs
- How to generate github oauth token: https://docs.aws.amazon.com/codepipeline/latest/userguide/appendix-github-oauth.html#GitHub-create-personal-token-CLI
- CDK docs: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codepipeline-readme.html


#### Introduction
This solution builds a simple React application with AWS Codepipeline CI/CD. Once developers commit to github repo,
it will trigger code commit via webhook and further invoke the code build project, in which the installation and compiling
work will be done. Finally, a S3DeployAction is used to push the React build files to S3 bucket, which is the asset of 
frontend website.


#### Architecture
![architecture](./architect.png)

#### Deployment
##### Step 1: install awscli, git
```angular2html
sudo apt-get install -y awscli git
```

##### Step 2: configure aws account, which is shown below: 
```angular2html
ubuntu@ip-172-31-16-248:~$ aws configure
AWS Access Key ID [None]: AKIAXKJO247JFXXXXXXXX
AWS Secret Access Key [None]: lRk3GTxx0VYXXXXXXXXXyGhtZ30XXXXXXXXXX
Default region name [None]: us-east-1
Default output format [None]: json
```

##### Step 3: install node environment:
```angular2html
sudo apt-get update
sudo apt-get -y upgrade
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs
```

##### Step 4: Github OAuthToken Configuration
In order to grant github authentication to AWS code commit, please refer to `Github Account Profile > 
Setting > Developer Setting > Personal access tokens > Generate new token`, input the personal access 
token note (name), check repo and admin:repo_hook, then click generate new token, a new token is generated,
copy it and paste into AWS KMS, for example, the key secret name is `profileGithubToken`.


##### Step 5: deploy the CI/CD solution:
```angular2html
git clone https://github.com/gaowexu/profile.git
cd profile/service
npm install

// configure parameters: githubTokenName/githubAccount/repoName/branchName
<!--for example:-->
<!--githubTokenName: 'profileGithubToken',-->
<!--githubAccount: 'gaowexu',-->
<!--repoName: 'profile',-->
<!--branchName: 'master',-->

npm run cdk deploy
```


#### Usage
##### Step 1: Configuration of Cloudfront


##### Step 2: Configuration of Route53


##### Step 3: Commit & Test



#### License
See the [LICENSE](LICENSE) file for our project's licensing.

