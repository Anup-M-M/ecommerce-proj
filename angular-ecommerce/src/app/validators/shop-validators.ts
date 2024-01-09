import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    // whitespace validation
    static notOnlyWhitespace(control : FormControl) : ValidationErrors {

        // check if the string only contains whitespace
        if((control.value != null) && (control.value.trim().length === 0)){

            // invalid, return error object
            return { 'notOnlyWhiteSpace' : true};
        }else{
            return null;
        }
    }
}

