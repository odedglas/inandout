import React from 'react';
import validationService from '@service/validation';

const withValidation = (validatorConfig) => (Component) => {

  class WithValidation extends React.Component {

    constructor(props) {
      super(props);

      const validator = validationService.create(validatorConfig);
      this.state = {
        validator: validator,
        validation: validator.valid()
      }

      this.validationComponentRef = React.createRef();
    }

    validate = (state, field, silent = false) => {

      const wasValid = this.isValid();
      const validationResult = validationService.validate(this.state.validator, state, field);

      if(!silent && !(wasValid && validationResult.isValid)) {
        this.setState({validation: validationResult});
      }

      return validationResult;
    };

    isValid = () => this.state.validation.isValid;

    clearValidation = () => this.setState({ validation: this.state.validator.valid()});

    onStateChange = (oldState, update, fieldName) => {

      //Validating against new input
      const newState = {...oldState, ...update};
      const currentValidation = {...this.state.validation};
      const { validator } = this.state;

      if(!currentValidation.isValid) {

        //Extracting the specific field results, and overrides our component validation state
        const newValidationResult = validationService.validate(validator, newState, fieldName);

        currentValidation.isValid = newValidationResult.isValid;
        currentValidation[fieldName] = newValidationResult[fieldName];

        this.setState({ validation: currentValidation})
      }

    };

    render() {

      const { validation } = this.state;

      return (
        <Component {...this.props}
                   isValid={this.isValid}
                   ref={this.validationComponentRef}
                   validate={this.validate}
                   validation={validation}
                   clearValidation={this.clearValidation}
                   onValidationChange={this.onStateChange}/>
      );
    }
  }
  return WithValidation;
};

export default withValidation;

