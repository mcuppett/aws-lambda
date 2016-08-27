[![npm page](https://nodei.co/npm/aws-lambda.png?downloads=true)](https://www.npmjs.com/package/aws-lambda)

# node-lambda
Command line tool deploy code to [AWS Lambda](http://aws.amazon.com/lambda/).


Forked from node-lambda

Original work [here](https://travis-ci.org/motdotla/node-lambda)

## Installation

```
npm install -g aws-lambda
```

## Usage

```
// if installed globally then
lambda deploy /path/to/my-function.lambda

// if 'npm installed' without the -g then you must use the full path
node_modules/.bin/lambda /path/to/my-function.lambda
```

## Configuration File

```
// PATH must point to your code folder and is relative to the .lambda file
// PATH can be relative or absolute
// if not present, Runtime defaults to "nodejs"

// sample contents of my-function.lambda

{
	"PATH": "./test-function",
	"AWS_KEY": "your_key",
	"AWS_SECRET": "your_secret",
	"AWS_REGION": "us-east-1",

	"Role": "your_amazon_role",
	"Runtime": "nodejs",
	"Handler": "index.handler",
	"MemorySize": "128",
	"Timeout": "3",
	"Description": ""
}
```
