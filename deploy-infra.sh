#!/bin/bash

environment=prod
appName=qd-web-main
stackName=qd-web-main-$environment
webDomainName=mydomain.net

aws cloudformation deploy --template-file template.yaml --stack-name $stackName --no-execute-changeset \
--capabilities CAPABILITY_IAM --region us-east-1 --parameter-overrides \
Environment=$environment \
WebDomainName=$webDomainName \
--no-fail-on-empty-changeset \
--tags Environment=$environment StackName=$stackName


