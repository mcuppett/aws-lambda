"use strict";

var 
aws = require( "aws-sdk" ),
exec = require( "child_process" ).exec,
fs = require( "fs" ),
os = require( "os" ),
packageJson = require( "./../package.json" ),
path = require( "path" );

var Lambda = function( ) { 
  this.version = packageJson.version;

  return this;
};

Lambda.prototype.run = function( program ) {

  var 
  dir = program.directory,
  splitHandler = program.handler.split( "." ),
  filename = splitHandler[0] + ".js",
  handlername = splitHandler[1];

  var 
  handler = require( process.cwd() + "/" + filename )[handlername],
  event = require( process.cwd() + "/event.json" );

  this._runHandler( handler, event );
}

Lambda.prototype._runHandler = function( handler, event ) {
  var context = {
    done: function( ) {
      process.exit(0);
    }
  }

  handler( event, context );
};

Lambda.prototype._zipfileTmpPath = function( functionName ) {
  var
  ms_since_epoch = +new Date,
  filename = functionName + "-" + ms_since_epoch + ".zip",
  zipfile = path.join( os.tmpDir(), filename );

  return zipfile;
};



Lambda.prototype._params = function( program, buffer ) { 


  return params;
};

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
		accessKeyId: $config.AWS_ACCESS_KEY_ID,
		secretAccessKey: $config.AWS_SECRET_ACCESS_KEY,
		region: $config.AWS_REGION
	});

	$config.FunctionName = program.split('/').slice(-1)[0]
	
	var _this = this
	var lambda = new aws.Lambda( { apiVersion: "2014-11-11" } )
	var tmpfile = this._zipfileTmpPath( $config.FunctionName )
	var $configPath = program.split('/').slice(0,-1).join('/')
	//console.log( $configPath )
	
	if (($config.PATH.substr(0,1) === '/') || ($config.PATH.substr(0,2) == '~/')) {
		var $fullFunctionPath =  ($config.PATH).replace(/\/\.\//g, '\/')
	} else {
		var $fullFunctionPath = (process.cwd() + '/' + $configPath + '/' + $config.PATH).replace(/\/\.\//g, '\/')
	}
	
	if ($fullFunctionPath.substr(-1) !== '/')
		$fullFunctionPath+='/'

	if (!fs.existsSync($fullFunctionPath)) {
		console.log( "No such directory:" + $fullFunctionPath )
		process.exit(-1)
	}
	
	var $zipCmd = "zip " + 
		" -roq " + tmpfile + 
		" " + $fullFunctionPath  +
		" -x '.git' -x '*/\.*' -x '*/\*.log' -x 'event.json' "
	
	exec( 
		$zipCmd, function( err, stdout, stderr ) {
		if ( err ) {
			console.log("Error generating zip file")
			throw err;
		}
		var buffer = fs.readFileSync( tmpfile )
		
		
		
		var params = {               
			FunctionName: $config.FunctionName,
			FunctionZip: buffer,       
			Handler: $config.Handler,  
			Mode: 'event',        
			Role: $config.Role,
			Runtime: 'nodejs',
			Description: $config.Description,
			MemorySize: $config.MemorySize, 
			Timeout: $config.Timeout
		}
		console.log($config)
 
		// remove 
		fs.unlinkSync( tmpfile )

		lambda.uploadFunction( params, function( err, data ) {
		if ( err ) {
			console.log( err )
			process.exit(-1)
		} 
		
		console.log( "Deployed!" );
		console.log( data );

    } );

  } );
}

module.exports = new Lambda( );

