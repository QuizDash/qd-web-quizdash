export AWS_ACCOUNT_ID=myTargetAccountId
export ENVIRONMENT=prod

cp ./src/environments/environment.ts.config ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{MYDOMAIN}/mydomain.net/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{API_BASE_URL}/api.mydomain.net/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{WS_BASE_URL}/ws.mydomain.net/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{BASE_URL}/mydomain.net/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{ENV_LABEL}/prod/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{AWS_REGION}/ap-southeast-2/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{USERPOOL_ID}/ap-southeast-2_myserpoolid/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{USERPOOL_WEBCLIENTID}/mywebclientid/' ./src/environments/environment.$ENVIRONMENT.ts
sed -i 's/{X_API_KEY}/myXApiKey/' ./src/environments/environment.$ENVIRONMENT.ts
