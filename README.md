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


#### 1. Introduction


#### 2. Architecture
![architecture](./architect.png)



#### 3. Deployment
执行如下命令安装awscli:
```angular2html
sudo apt-get install -y awscli
```
安装成功后进行用户陪配置，即在终端中执行`aws configure`回车，输入用户(如果之前在亚马逊云端账户中没有创建过用户，则需要进入IAM控制台先创建用户，
并对该用户赋予`AdministratorAccess`权限)对应的`AWS Access Key ID`，`AWS Secret Access Key`， `Default region name`和`Default output format`，如下所示：
```angular2html
ubuntu@ip-172-31-16-248:~$ aws configure
AWS Access Key ID [None]: AKIAXKJO247JFXXXXXXXX
AWS Secret Access Key [None]: lRk3GTxx0VYXXXXXXXXXyGhtZ30XXXXXXXXXX
Default region name [None]: us-east-1
Default output format [None]: json
```

##### 步骤三：安装node
执行如下命令安装node环境：

```angular2html
sudo apt-get update
sudo apt-get -y upgrade
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs
```



#### 4. Usage




#### 5. License



