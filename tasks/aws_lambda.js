/*
 * grunt-aws-lambda
 * https://github.com/mcuppett/aws-lambda
 *
 * Copyright (c) 2017 Matthew Cuppett
 * Licensed under the MIT license.
 */

'use strict';

var aws = require( "aws-sdk" );
var path = require( "path" );
var Zip = require('adm-zip');

module.exports = function(grunt) {

  grunt.registerMultiTask('aws_lambda', 'The best Grunt plugin ever.', function() {

    var options = this.options({
      punctuation: '.',
      separator: ', ',
      runtime: 'nodejs',

    });

    aws.config.update({
      accessKeyId: this.options.awsKey,
      secretAccessKey: this.options.awsSecret,
      region: this.options.awsRegion
    })

    var lambda = new aws.Lambda( { apiVersion: "2014-11-11" } );

    var zip = new Zip();

    zip.addLocalFolder(options.path, "/");

    var params = {
      FunctionName: this.options.functionName,
      FunctionZip: zip.toBuffer(),
      Handler: this.options.handler,
      Mode: 'event',
      Role: this.options.role,
      Runtime: this.options.runtime || 'nodejs',
      Description: this.options.description,
      MemorySize: this.options.memorySize,
      Timeout: this.options.timeout
    }

    lambda.uploadFunction( params, function( err, data ) {
      if ( err ) {
        console.log("upload error:", err )
        process.exit(-1)
      }

      console.log( "Deployed!" );
    });

    
  });

};
