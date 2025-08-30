# Set environment configs
./deploy-configs-prod.sh

cp ./src/environments/environment.ts.config ./src/environments/environment.prod.ts
sed -i 's/{API_BASE_URL}/api.mydomain.net/' ./src/environments/environment.prod.ts
sed -i 's/{WS_BASE_URL}/ws.mydomain.net/' ./src/environments/environment.prod.ts
sed -i 's/{BASE_URL}/mydomain.net/' ./src/environments/environment.prod.ts
sed -i 's/{ENV_LABEL}/prod/' ./src/environments/environment.prod.ts
sed -i 's/{AWS_REGION}/ap-southeast-2/' ./src/environments/environment.prod.ts
sed -i 's/{USERPOOL_ID}/ap-southeast-2_myserpoolid/' ./src/environments/environment.prod.ts
sed -i 's/{USERPOOL_WEBCLIENTID}/mywebclientid/' ./src/environments/environment.prod.ts

npm run build

aws s3 sync ./dist/quizdash/browser s3://web-us-east-1-$AWS_ACCOUNT_ID-fbt-$ENVIRONMENT --profile quizdash
aws cloudfront list-distributions --output json --query "DistributionList.Items[?Comment=='mydomain.net'].Id" | awk -F '"' '{print $2}' | xargs -I{} aws cloudfront create-invalidation --distribution-id {} --paths "/*"
