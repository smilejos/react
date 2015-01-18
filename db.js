var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Comment = new Schema({
    author     : {type : String, default : '', trim : true},
    comment    : {type : String, default : '', trim : true},
    updated    : {type : Date, default : Date.now}
});

mongoose.model( 'Comment', Comment );
mongoose.connect( 'mongodb://localhost/React' );

