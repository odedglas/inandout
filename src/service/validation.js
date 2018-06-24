import validator from 'validator';

const validateRule = (rule, state, results) => {
  const field = rule.field;

  // if the field isn't already marked invalid by an earlier rule
  if (!results[field].isInvalid) {

    const value = state[field];
    const args = rule.args || [];
    const validationMethod = rule.method;

    if(!validationMethod(value, field, state, validator, ...args)) {

      results[field] = {
        isInvalid: true,
        message: typeof rule.message === 'function' ? rule.message(value) : rule.message
      };
      results.isValid = false;
    }
  }

  return results;
};

class FormValidator {

  constructor(validations) {
    // validations is an array of rules specific to a form
    this.validations = validations;
    this.result = {};
  }
  validate(state) {

    //Starts as valid
    let validation = this.valid();

    this.validations.forEach(rule => {

      validateRule(rule, state, validation);
    });
    return validation;
  }

  validateSpecific(state, field) {

    //We only validate specific field, First finding matched rule
    const rules = this.validations.filter( v => v.field === field);
    let results = {};
    results[field] = {isInvalid: false, message: ''};

    rules.forEach(rule => {

      validateRule(rule, state, results);
    });

    return results;
  }

  valid() {
    const validation = {};

    this.validations.map(rule => (
      validation[rule.field] = { isInvalid: false, message: '' }
    ));

    return { isValid: true, ...validation };
  }
}

//TODO - Wrap Creation in json validation lifecycle
export default {
  create: validations => new FormValidator(validations),
  validate: (formValidator, state, field) => !field ? formValidator.validate(state)
    : formValidator.validateSpecific(state, field),
};