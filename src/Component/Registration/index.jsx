import React, { useEffect } from 'react';
import Header from '../Layout/header';
import { Container, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import Step2Component from './Step2';
import Step1Component from './Step1';
import './index.css';
import { isValidEmail, isValidPassword } from '../../helper';
import EmailSent from './Step2/emailSent';
import Step3Component from './Step3';
import Step4Component from './Step4';
import Step5Component from './Step5';
import Done from './Done';
import { Stepper } from 'react-form-stepper';
import { Email_Serviceid, Email_Template } from '../../config/AppConfig';
const Main = (props) => {
  // state for active step
  const [steps, setcurrentStep] = React.useState(0);
  const { infoData, setinfoData } = props;

  const { state: locationState } = useLocation();
  //  state to manage error
  const [error, setError] = React.useState({
    numValue: '',
    email: '',
    contact: '',
    expireYearError: '',
    expireMonthError: '',
    password: '',
  });
  const [emailSuccess, setEmailSuccess] = React.useState(false);
  const [isEmailLoading, setisEmailLoading] = React.useState(false);
  let history = useHistory();

  //  Manage routing with hash according to active stepper
  useEffect(() => {
    console.log(Email_Serviceid, Email_Template,'Email_Serviceid, Email_Template');
    
    // go back from child to parent
    if (locationState && locationState.step === 3) {
      setcurrentStep(2);
      history.push(`/Registrationform/#3`);
    } else {
      history.push(`/Registrationform/#${steps + 1}`);
    }

    // eslint-disable-next-line
  }, [steps]);

  //  For sending email
  const sendFeedback = (templateId, params) => {
    setisEmailLoading(true);
    window.emailjs
      .send(Email_Serviceid, templateId, params)
      .then((res) => {
        setEmailSuccess(true);
        setisEmailLoading(false);
      })
      // Handle errors here however you like, or use a React error boundary
      .catch((err) => {
        setEmailSuccess(false);
        setisEmailLoading(false);
        console.log(err);
        alert(err.text);
      });
  };

  // send email
  const handleSubmit = () => {
    const templateId = Email_Template;
    console.log('Email_Template', Email_Template);
    sendFeedback(templateId, {
      message_html: '',
      from_name: infoData.name,
      reply_to: infoData.email,
    });
  };
  console.log('props.infoData', infoData);

  //  handle next & previous button
  const handleStepper = (name) => {
    if (name === 'previous') {
      setcurrentStep(steps - 1);
    } else if (name === 'email') {
      setEmailSuccess(false);
      setcurrentStep(2);
    } else {
      if (steps === 1) {
        handleSubmit();
      } else if (steps === 3) {
        handlePayment();
      } else {
        setcurrentStep(steps + 1);
      }
    }
  };

  // validation for payment method page
  const handlePayment = () => {
    const { cardNumber, expMonth, expYear, cvv, expireDate } = props.infoData;
    const payload = {
      cardNumber: cardNumber.replace(/_/g, ''),
      expMonth: expMonth,
      expYear: expYear,
      cvv: cvv,
    };
    let isError = false;
    let errors = { ...error };
    var n = new Date().getFullYear().toString().substr(2, 2);
    if (parseInt(payload.expMonth) > 12 && payload.expYear) {
      setError({
        ...error,
        expireMonthError: 'Enter valid month.',
        expireYearError: null,
      });
      isError = true;
      return;
    } else if (parseInt(payload.expMonth) && !parseInt(payload.expYear)) {
      setError({
        ...error,
        expireMonthError: 'Enter valid date.',
        expireYearError: null,
      });
      isError = true;
      return;
    } else if (
      parseInt(payload.expYear) < n &&
      payload.expYear &&
      payload.expMonth
    ) {
      errors.expireYearError = 'Invalid date';
      errors.expireMonthError = '';
      isError = true;
    } else {
      errors.expireYearError = '';
      errors.expireMonthError = '';

      isError = false;
    }
    let isValid = true;

    if (!payload.cardNumber.length || payload.cardNumber.length < 19) {
      errors.cardNumber = 'Please enter valid number';
      isValid = false;
    }
    if (!cvv.length) {
      errors.cvv = 'Invalid';
      isValid = false;
    }
    if (!expireDate) {
      errors.expireDate = 'Invalid';
      isValid = false;
    }
    if (isError || !isValid) {
      setError({
        ...error,
        cardNumber: errors.cardNumber,
        cvv: errors.cvv,
        expireDate: errors.expireDate,
        expireYearError: errors.expireYearError,
      });
      return;
    } else {
      setcurrentStep(steps + 1);
    }
  };

  const handleContact = (value) => {
    setinfoData({
      ...infoData,
      contact: value,
    });
  };

  //  function for dropdown selection
  const handleSelectChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setinfoData({
      ...infoData,
      [name]: value,
    });
  };

  // handle change value
  const handleChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (
      name === 'numValue' &&
      value.replace(/-/g, '').replace(/_/g, '').length < 9
    ) {
      setError({
        ...error,
        numValue: 'Incorrect input number',
      });
    } else {
      setError({
        ...error,
        numValue: '',
      });
    }
    if (name === 'email') {
      let temp = isValidEmail(value);
      if (!temp) {
        setError({
          ...error,
          [name]: 'Please enter valid email address',
        });
      } else {
        setError({
          ...error,
          email: '',
        });
      }
    }
    if (name === 'password') {
      let temp = isValidPassword(value);
      if (!temp) {
        setError({
          ...error,
          password:
            'Please enter valid password, It must contain one uppercase, one lowercase, one number and one special character and should be 8 charater long.',
        });
      } else {
        setError({
          ...error,
          password: '',
        });
      }
    }
    if (name === 'contact') {
      console.log('!isNaN(value)', !isNaN(value));

      if (value && isNaN(value)) {
        setError({
          ...error,
          contact: 'Enter valid contact number',
        });
      } else if (value && value.length < 9) {
        setError({
          ...error,
          contact: 'Contact must be greater than 9 numbers',
        });
      } else if (value && value.length > 14) {
        setError({
          ...error,
          contact: 'Contact must be less than 14 numbers',
        });
      } else {
        setError({
          ...error,
          contact: '',
        });
      }
    }

    setinfoData({
      ...infoData,
      [name]: value,
    });
    if (name === 'cardNumber' || name === 'cvv' || name === 'expireDate') {
      setError({
        ...error,
        cardNumber: '',
        cvv: '',
        expireDate: '',
      });
    }
  };

  // handle change for expiry card
  const handleExpireDate = (event) => {
    const {
      target: { value },
    } = event;
    const expireDate = value.split('/');
    setinfoData({
      ...infoData,
      expireDate: value,
      expMonth: expireDate[0],
      expYear: expireDate[1],
    });
    setError({
      ...error,
      expireMonthError: null,
      expireYearError: null,
      cardNumber: '',
      cvv: '',
      expireDate: '',
    });
  };
  console.log('Hiiii i am in parent 125126152');
  return (
    <>
      <Header />
      <section className='form-section'>
        <Container>
          {/* <UserContext.Provider
            value={{
              infoData,
            }}
          > */}
          {!emailSuccess ? (
            <>
              {steps === 5 ? null : (
                <>
                  <h1 className='main-title'>Registration Form</h1>
                  <p className='sub-title'>This is Example Registratino form</p>
                  <Stepper
                    className='stepper'
                    steps={[
                      {
                        label: steps === 1 || steps > 1 ? 'TITULAR' : '',
                      },
                      {
                        label: steps === 2 || steps > 2 ? 'CONTACTO' : '',
                      },
                      {
                        label: steps === 3 || steps > 3 ? 'PLAN' : '',
                      },
                      {
                        label: steps === 4 || steps > 4 ? 'PAGO' : '',
                      },
                      {
                        title: '',
                      },
                    ]}
                    activeStep={steps}
                    completeColor='#49B8AD'
                    activeTitleColor='#49B8AD'
                    completeBorderStyle='#49B8AD'
                    // eslint-disable-next-line
                    className={'stepclass'}
                    stepClassName={'stepclassName'}
                    // disabledSteps={ [0] }
                  />
                </>
              )}
              {steps === 5 ? (
                <div>
                  <Done infoData={infoData} />
                </div>
              ) : (
                <div className='inner-body'>
                  {steps === 0 ? (
                    <Step1Component
                      infoData={infoData}
                      handleSelectChange={handleSelectChange}
                      handleChange={handleChange}
                      error={error}
                    />
                  ) : steps === 1 ? (
                    <Step2Component
                      infoData={infoData}
                      handleContact={handleContact}
                      handleChange={handleChange}
                      error={error}
                    />
                  ) : steps === 2 ? (
                    <Step3Component
                      infoData={infoData}
                      handleSelectChange={handleSelectChange}
                      {...props}
                    />
                  ) : steps === 3 ? (
                    <Step4Component
                      infoData={infoData}
                      handleChange={handleChange}
                      error={error}
                      handleExpireDate={handleExpireDate}
                    />
                  ) : steps === 4 ? (
                    <Step5Component
                      handleChange={handleChange}
                      infoData={infoData}
                      error={error}
                    />
                  ) : null}
                </div>
              )}
              <>
                {steps === 0 ? (
                  <div className='d-flex align-items-center justify-content-end btn-wrap'>
                    <Button
                      variant='link'
                      className='btn-theme mb-2'
                      onClick={() => handleStepper('next')}
                      disabled={
                        error &&
                        (error.email || error.numValue || error.contact)
                          ? true
                          : steps === 1 &&
                            (!infoData.email || !infoData.contact)
                          ? true
                          : steps === 0 && !infoData.numValue
                          ? true
                          : false
                      }
                    >
                      Continue
                    </Button>
                  </div>
                ) : steps === 5 ? null : (
                  <div className='d-flex align-items-center justify-content-between btn-wrap'>
                    {steps === 0 ? null : (
                      <Button
                        variant='link'
                        className='btn-theme-outline mb-2'
                        onClick={() => handleStepper('previous')}
                        disabled={steps === 0 ? 'cursor' : ''}
                      >
                        Previous
                      </Button>
                    )}
                    <div>
                      <Button
                        variant='link'
                        className='btn-theme mb-2'
                        onClick={() => handleStepper('next')}
                        disabled={
                          error &&
                          (error.email || error.numValue || error.contact)
                            ? true
                            : steps === 1 &&
                              (!infoData.email || !infoData.contact)
                            ? true
                            : steps === 0 && !infoData.numValue
                            ? true
                            : false
                        }
                      >
                        {steps === 1 && isEmailLoading
                          ? 'Loading...'
                          : steps === 4
                          ? 'Complete It!'
                          : 'Continue'}
                      </Button>
                      {error &&
                      (error.cvv ||
                        error.expireDate ||
                        error.expireYearError ||
                        error.expireMonthError ||
                        error.cardNumber ||
                        error.numValue) ? (
                        <p className='error-muted'>
                          Please check the Error and resolve it
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              </>
            </>
          ) : (
            <div>
              {' '}
              <EmailSent handleStepper={handleStepper} />{' '}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};
export default Main;
