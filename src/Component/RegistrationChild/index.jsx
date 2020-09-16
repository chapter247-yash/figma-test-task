import React, { useEffect } from 'react';
import Header from '../Layout/header';
import { Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Step2Component from './Step2';
import Step1Component from './Step1';
import './index.css';
import { isValidEmail} from '../../helper';
import Step3Component from './Step3';
import { Stepper } from 'react-form-stepper';
const Child = () => {
  // state for active step
  const [steps, setcurrentStep] = React.useState(0);

  // state object to store user information
  const [infoData, setinfoData] = React.useState({
    numValue: '985476238',
    name: 'Joe Doe',
    email: '',
    contact: '',
    country: 'India',
  });

  //  state to manage error
  const [error, setError] = React.useState({
    numValue: '',
    email: '',
    contact: '',
  });

  let history = useHistory();

  //  Manage routing with hash according to active stepper
  useEffect(() => {
    // history.push(`/Registrationform/#${steps + 1}`);
    // eslint-disable-next-line
  }, [steps]);

  //  handle next & previous button
  const handleStepper = (name) => {
    if (name === 'previous') {
      setcurrentStep(steps - 1);
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
        numValue: 'Please valid entry.',
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
          [name]: 'Please enter valid email',
        });
      } else {
        setError({
          ...error,
          email: '',
        });
      }
    }
    if (name === 'contact') {
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
  };
  console.log('Hiiii i am in child 125126152');
  return (
    <>
      <Header />
      {console.log('Hiiii i am in child')}
      <section className='form-section'>
        <Container>
          <>
            <h1 className='main-title'>Registration Form</h1>
            <p className='sub-title'>This is Example Registratino form</p>
            <Stepper
              className='stepper'
              steps={[
                {
                  label: steps === 1 || steps > 1 ? 'CONTACT' : '',
                },
                {
                  label: steps === 2 || steps > 2 ? 'INFORMATION' : '',
                },
                {
                  label: steps === 3 || steps > 3 ? '' : '',
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
                />
              ) : null}
            </div>
            <>
              <div className='d-flex align-items-center justify-content-between btn-wrap'>
                <Button
                  variant='link'
                  className='btn-theme-outline mb-2'
                  onClick={() => {
                    if (steps === 0) {
                      // redirect to parent step 3
                    } else {
                      handleStepper('previous');
                    }
                  }}
                >
                  Previous
                </Button>
                <div>
                  <Button
                    variant='link'
                    className='btn-theme mb-2'
                    onClick={() => handleStepper('next')}
                    disabled={
                      error && (error.email || error.numValue || error.contact)
                        ? true
                        : steps === 1 && (!infoData.email || !infoData.contact)
                        ? true
                        : steps === 0 && !infoData.numValue
                        ? true
                        : false
                    }
                  >
                    Continue
                  </Button>
                  {error && (error.email || error.contact || error.numValue) ? (
                    <p className='error-muted'>
                      Please resolve the above errors and verify details again.
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </>
          </>
        </Container>
      </section>
    </>
  );
};
export default Child;