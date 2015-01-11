# node-lambda
Command line tool to locally run and deploy your node.js application to [Amazon Lambda](http://aws.amazon.com/lambda/).


Forked from node-lambda
Original work [here](https://travis-ci.org/motdotla/node-lambda)


```
lambda run
```

## Installation

```
npm install -g aws-lambda
```

## Usage

```
lambda deploy my-function.lambda
```

## Configuration File

```
// contents of my-function.lambda
// PATH must point to the deploy folder
// can be relative or absolute
{
	"PATH": "./test-function",
	"AWS_KEY": "your_key",
	"AWS_SECRET": "your_secret",
	"AWS_REGION": "us-east-1",

	"Role": "your_amazon_role",
	"Handler": "index.handler",
	"MemorySize": "128",
	"Timeout": "3",
	"Description": ""
}
```
