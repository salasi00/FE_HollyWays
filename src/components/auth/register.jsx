import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { redirect } from "react-router-dom";
import { API } from "../../config/api";

export default function Register(props) {
  // const [show, setShow] = useState(false)
  const handleClose = () => props.setShowRegister(false);
  const handleShow = () => props.setShowRegister(true);

  const [message, setMessage] = useState(null);
  const [register, setRegister] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const { fullname, email, password } = register;

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const redirectLogin = () => {
    props.setShowLogin(true);
    props.setShowRegister(false);
}

  const handleRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post('/register', register);

      console.log("register success : ", response)
      props.setShowRegister(false);
      props.setShowLogin(true);

      const alert = (
        <Alert variant="success" className="py-1">
          Register success!
        </Alert>
      );
      setMessage(alert);
      setRegister({
        fullname: '',
        email: '',
        password: '',
      });
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed to register!
        </Alert>
      );
      setMessage(alert);
      console.log("register failed : ", error);
    }
  });

    return (
        <>  
          <Modal 
            show={props.showRegister}
            onHide={handleClose} 
            centered
          > 
            <Modal.Header >
              <h2>Register</h2>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => handleRegister.mutate(e)}>
              {message && message}
                <Form.Group className="mb-2" controlId="fullname">
                  <Form.Label></Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Fullname"
                     value={fullname}
                     name="fullname"
                     onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId="email">
                  <Form.Label></Form.Label>
                  <Form.Control
                     type="email"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={handleChange}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button className="btn  btn-lg btn-danger font-weight-bold text-white btn-fluid w-100" variant="primary" size="md" type='submit' >
                    Register
                </Button>
              </Form>
            </Modal.Body>
                <div className="text-center mb-3">
                          Already have an account ? <span
                          onClick={redirectLogin}
                        style={{ cursor: "pointer",fontWeight:"bold",color:"orange"  }}
                        >Login Here</span> 
                </div>
        </Modal>
        </>
      );
    }
