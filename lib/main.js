"use strict";

var aws = require( "aws-sdk" )
var exec = require( "child_process" ).exec
var fs = require( "fs" )
var os = require( "os" )
var path = require( "path" )
var Zip = require('adm-zip');

var Lambda = function( ) {
	return this;
}

Lambda.prototype.deploy = function( program ) {
	if (program.substr(-7) === '.lambda')
		program = program.substr(0,program.length - 7)

	var config_file = program + '.lambda'
	if ( !fs.existsSync( config_file ) ) {
		console.log('Lambda config not found (' + program + '.lambda )')
		process.exit(-1)
	}

	try {
		var $config = JSON.parse(fs.readFileSync( config_file, "utf8"))
	} catch (e) {
		console.log('Invalid config file (' + program + '.lambda )')
		process.exit(-1)
	}

	aws.config.update({
		accessKeyId: $config.AWS_KEY,
		secretAccessKey: $config.AWS_SECRET,
		region: $config.AWS_REGION
	})

	if (!$config.FunctionName)
		$config.FunctionName = program.split('/').slice(-1)[0]

	var _this = this


	var lambda = new aws.Lambda( { apiVersion: "2014-11-11" } );

	var zip = new Zip();

	zip.addLocalFolder($config.DeployFolder);

	if ( err ) {
		console.log("Error generating zip file")
		throw err;
	}
	var buffer = fs.readFileSync( tmpfile )

	var params = {
		FunctionName: $config.FunctionName,
		FunctionZip: zip.toBuffer(),
		Handler: $config.Handler,
		Mode: 'event',
		Role: $config.Role,
		Runtime: $config.Runtime || 'nodejs',
		Description: $config.Description,
		MemorySize: $config.MemorySize,
		Timeout: $config.Timeout
	}

	// remove temp file
	fs.unlinkSync( tmpfile )

	lambda.uploadFunction( params, function( err, data ) {
		if ( err ) {
			console.log("upload error:", err )
			process.exit(-1)
		}

		console.log( "Deployed!" );
	});
}

module.exports = new Lambda( );
