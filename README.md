## Installtion
`sharp` dependency must be installed to work with Linux x64 systems because AWS Lambda uses.
```bash
npm install --cpu=x64 --os=linux --libc=glibc sharp
```

### Uploading new version
On a Mac system, navigate inside the project folder, select all files (index.js, package.json, etc.), right click on selection and click "Compress" option. That will create an `Archive.zip` file. Open AWS Console and navigate to the AWS Lambda page for this Lambda function, look for an "Upload from" drop-down menu, and select ".zip file". Select the `Archive.zip` file that was previously created. This will update the Lambda function to use the latest code.
