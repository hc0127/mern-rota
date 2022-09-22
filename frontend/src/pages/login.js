import React,{Component} from 'react';
import './../App.css';
import {Row,Col,FloatingLabel,Form,Button} from 'react-bootstrap'
import axios from './../config/server.config';
import {
  setToken
} from './../store/Actions/BasicAction';
import {connect} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { MDBContainer } from 'mdb-react-ui-kit';


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
        };
    }

    onChangeValue = (target,e) =>{
        this.setState({
            ...this.state,
            [target]:e.target.value
        });      
    }
    keypress = (e) =>{
        console.log(e);
        if(e.key == "Enter"){
            this.onLogin();
        }
    }
    onLogin = () =>{
        const _self = this;
        axios.post('basic/login',{...this.state})
        .then(function(response){
            if(response.data.state == "wrong"){
                _self.setState({
                    email:'',
                    password:'',
                });

                toastr.options = {
                  positionClass : 'toast-top-full-width',
                  hideDuration: 300,
                  timeOut: 3000
                }
                toastr.clear()
                setTimeout(() => toastr.info('wrong password!'), 300)

            }else{
                _self.props.setToken(response.data);
            }
        });
    }

    render(){
        return(
            <div className="login-wrapper">
                <MDBContainer>
                        <h1 className='m-5 text-center'>Please Login</h1>
                        <Row className=" align-items-center justify-content-center">
                            <Col md="4">
                                <Form.Group className="m-3" controlId="formBasicEmail">
                                    <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={(e) => this.onChangeValue('email',e)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className=" align-items-center justify-content-center">
                            <Col md="4">
                                <Form.Group className="m-3" controlId="formBasicPassword">
                                    <Form.Control type="password" placeholder="Password" value={this.state.password} onKeyUpCapture={(e) =>this.keypress(e)} onChange={(e) => this.onChangeValue('password',e)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className=" align-items-center justify-content-center">
                            <Col className="align-item text-center" md="4">
                                <Button className="m-3" variant="primary" onClick={() =>this.onLogin()}>
                                    Login
                                </Button>
                            </Col>
                        </Row>
                </MDBContainer>
            </div>
        )
    }
  }


  const mapDispatchToProps = (dispatch) => ({
    setToken:(data) =>dispatch(setToken(data)),
});

  export default connect(null,mapDispatchToProps)(Login)