import { isSelect, isCheckable } from './utils';

export default {
    // https://jqueryvalidation.org/required-method/
    // oldRequired: function( value, element, param ) {

    //     // Check if dependency is met
    //     if ( !this.depend( param, element ) ) {
    //         return "dependency-mismatch";
    //     }
    //     if ( element.nodeName.toLowerCase() === "select" ) {

    //         // Could be an array for select-multiple or a string, both are fine this way
    //         var val = $( element ).val();
    //         return val && val.length > 0;
    //     }
    //     if ( this.checkable( element ) ) {
    //         return this.getLength( value, element ) > 0;
    //     }
    //     return value !== undefined && value !== null && value.length > 0;
    // },

    required(group){
        return group.reduce((acc, input) => {
            if(isSelect(input)) acc = (input.value() && input.value().length > 0);
            if(isCheckable(input)) acc = this.checked;
            else acc = input.value !== undefined && input.value !== null && input.value.length > 0; 
        }, false);
    },

    // https://jqueryvalidation.org/email-method/
    email: function( value, element ) {

        // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
        // Retrieved 2014-01-14
        // If you have a problem with this implementation, report a bug against the above spec
        // Or use custom methods to implement your own email validation
        return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
    },

    // https://jqueryvalidation.org/url-method/
    url: function( value, element ) {

        // Copyright (c) 2010-2013 Diego Perini, MIT licensed
        // https://gist.github.com/dperini/729294
        // see also https://mathiasbynens.be/demo/url-regex
        // modified to allow protocol-relative URLs
        return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    },

    // https://jqueryvalidation.org/date-method/
    date: function( value, element ) {
        return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
    },

    // https://jqueryvalidation.org/dateISO-method/
    dateISO: function( value, element ) {
        return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
    },

    // https://jqueryvalidation.org/number-method/
    number: function( value, element ) {
        return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
    },

    // https://jqueryvalidation.org/digits-method/
    digits: function( value, element ) {
        return this.optional( element ) || /^\d+$/.test( value );
    },

    // https://jqueryvalidation.org/minlength-method/
    minlength: function( value, element, param ) {
        var length = $.isArray( value ) ? value.length : this.getLength( value, element );
        return this.optional( element ) || length >= param;
    },

    // https://jqueryvalidation.org/maxlength-method/
    maxlength: function( value, element, param ) {
        var length = $.isArray( value ) ? value.length : this.getLength( value, element );
        return this.optional( element ) || length <= param;
    },

    // https://jqueryvalidation.org/rangelength-method/
    rangelength: function( value, element, param ) {
        var length = $.isArray( value ) ? value.length : this.getLength( value, element );
        return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
    },

    // https://jqueryvalidation.org/min-method/
    min: function( value, element, param ) {
        return this.optional( element ) || value >= param;
    },

    // https://jqueryvalidation.org/max-method/
    max: function( value, element, param ) {
        return this.optional( element ) || value <= param;
    },

    // https://jqueryvalidation.org/range-method/
    range: function( value, element, param ) {
        return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
    },

    // https://jqueryvalidation.org/step-method/
    step: function( value, element, param ) {
        var type = $( element ).attr( "type" ),
            errorMessage = "Step attribute on input type " + type + " is not supported.",
            supportedTypes = [ "text", "number", "range" ],
            re = new RegExp( "\\b" + type + "\\b" ),
            notSupported = type && !re.test( supportedTypes.join() ),
            decimalPlaces = function( num ) {
                var match = ( "" + num ).match( /(?:\.(\d+))?$/ );
                if ( !match ) {
                    return 0;
                }

                // Number of digits right of decimal point.
                return match[ 1 ] ? match[ 1 ].length : 0;
            },
            toInt = function( num ) {
                return Math.round( num * Math.pow( 10, decimals ) );
            },
            valid = true,
            decimals;

        // Works only for text, number and range input types
        // TODO find a way to support input types date, datetime, datetime-local, month, time and week
        if ( notSupported ) {
            throw new Error( errorMessage );
        }

        decimals = decimalPlaces( param );

        // Value can't have too many decimals
        if ( decimalPlaces( value ) > decimals || toInt( value ) % toInt( param ) !== 0 ) {
            valid = false;
        }

        return this.optional( element ) || valid;
    },

    // https://jqueryvalidation.org/equalTo-method/
    equalTo: function( value, element, param ) {

        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $( param );
        if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
            target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
                $( element ).valid();
            } );
        }
        return value === target.val();
    },

    // https://jqueryvalidation.org/remote-method/
    remote: function( value, element, param, method ) {
        if ( this.optional( element ) ) {
            return "dependency-mismatch";
        }

        method = typeof method === "string" && method || "remote";

        var previous = this.previousValue( element, method ),
            validator, data, optionDataString;

        if ( !this.settings.messages[ element.name ] ) {
            this.settings.messages[ element.name ] = {};
        }
        previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
        this.settings.messages[ element.name ][ method ] = previous.message;

        param = typeof param === "string" && { url: param } || param;
        optionDataString = $.param( $.extend( { data: value }, param.data ) );
        if ( previous.old === optionDataString ) {
            return previous.valid;
        }

        previous.old = optionDataString;
        validator = this;
        this.startRequest( element );
        data = {};
        data[ element.name ] = value;
        $.ajax( $.extend( true, {
            mode: "abort",
            port: "validate" + element.name,
            dataType: "json",
            data: data,
            context: validator.currentForm,
            success: function( response ) {
                var valid = response === true || response === "true",
                    errors, message, submitted;

                validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
                if ( valid ) {
                    submitted = validator.formSubmitted;
                    validator.resetInternals();
                    validator.toHide = validator.errorsFor( element );
                    validator.formSubmitted = submitted;
                    validator.successList.push( element );
                    validator.invalid[ element.name ] = false;
                    validator.showErrors();
                } else {
                    errors = {};
                    message = response || validator.defaultMessage( element, { method: method, parameters: value } );
                    errors[ element.name ] = previous.message = message;
                    validator.invalid[ element.name ] = true;
                    validator.showErrors( errors );
                }
                previous.valid = valid;
                validator.stopRequest( element, valid );
            }
        }, param ) );
        return "pending";
    }
};