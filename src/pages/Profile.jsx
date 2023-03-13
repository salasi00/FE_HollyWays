import React, { useContext, useState } from "react";
import { Badge, Button, Card, Col, Container, Image, Row, Stack } from "react-bootstrap";
import User from "../assets/user.png"
import Mail from "../assets/mail.png"
import Phone from "../assets/phone.png"
import Address from "../assets/address.png"
import { useQuery } from "react-query";
import UpdateUser from "./UpdateUser";
import { UserContext } from "../context/UserContext";
import { API } from "../config/api";

import UserImage from "../assets/Avatar.png"
import rupiahFormat from "rupiah-format";
import moment from "moment";

export default function Profile() {
    const [update, setUpdate] = useState(false);
    const [value, setValue] = useState(null)
    const [state] = useContext(UserContext)

    const {data: user, refetch} = useQuery("userProfile", async() => {
        const response = await API.get(`/user/${state.user.id}`)
        console.log("response",response.data.data)
        return response.data.data
    })

    const {data: History, refetch: refetchHistory} = useQuery("historyCache", async() => {
        const response = await API.get(`/transaction-user`)
        return response.data.data
    })
    
    console.log(History)

    const handleUpdate = (user) => {
        setUpdate(true)
        setValue(user)
    }
    


    return (
        <Container className="d-flex justify-content-center w-100">

            <Col md={5} className="text-start mt-4 ms-5">
                <Card.Text style={{ fontWeight: "bold", fontSize: "25px" }}>My Profile</Card.Text>
                <Row className="p-2 my-3 rounded-3" style={{backgroundColor: "white" }}>

                    <Col md={6} key={user?.id}>
                    
                        <Image className="rounded-3 "
                            src={user?.image == "image.png"? UserImage : user?.image}
                            style={{
                                width: "100%",
                                height: "auto",

                            }}
                        />
                        {/* <Button className="mb-1 mt-3 fw-bold" variant="warning" style={{ color: "white" }} onClick={() => setShow(true)}>Change Photo Profile</Button> */}
                        <Button 
                            className="mb-1 mt-3 fw-bold w-100" 
                            variant="danger" 
                            style={{ color: "white" }} 
                            onClick={() => handleUpdate(user)}
                        >
                            Change Profile
                        </Button>

                    </Col>
                    <Col md={4} className="mt-2">
                        <Stack direction="horizontal" gap={5} className="mb-2">


                            <Stack direction="vertical">
                                <Card.Text className="fs-5 fw-bold" style={{ fontSize: "14px", color: "#C32424", marginBottom: "0px"}}>Fullname</Card.Text>
                                <Card.Text style={{ fontSize: "16px", color: "#8A8C90" }}>{user?.fullname}</Card.Text>
                            </Stack>
                        </Stack>
                        <Stack direction="horizontal" gap={5} className="mb-2">


                            <Stack direction="vertical">
                                <Card.Text className="fs-5 fw-bold" style={{ fontSize: "14px", color: "#C32424", marginBottom: "0px"  }}>Email</Card.Text>
                                <Card.Text style={{ fontSize: "16px", color: "#8A8C90"}}>{user?.email}</Card.Text>
                            </Stack>
                        </Stack>
                        <Stack direction="horizontal" gap={5} className="mb-2">

                            <Stack direction="vertical">
                                <Card.Text className="fs-5 fw-bold" style={{ fontSize: "14px", color: "#C32424", marginBottom: "0px" }}>Phone </Card.Text>
                                <Card.Text style={{ fontSize: "16px", color: "#8A8C90"}}>{user?.phone}</Card.Text>
                            </Stack>
                        </Stack>

                        <Stack direction="horizontal" gap={5} className="mb-1">


                            <Stack direction="vertical">
                                <Card.Text className="fs-5 fw-bold" style={{ fontSize: "14px", color: "#C32424", marginBottom: "0px"  }}>Address</Card.Text>
                                <Card.Text style={{ fontSize: "16px", color: "#8A8C90"}}>{user?.address}</Card.Text>
                            </Stack>
                        </Stack>

                    </Col>
                    
                    <UpdateUser
                        show={update}
                        onHide={setUpdate}
                        value={value}
                        onSaves={() => {
                            setUpdate(false)
                            refetch()
                        }}


                    />

                </Row>

            </Col >
            <Col md={4} className=" w-50">
                <Card.Text className="mx-3 fs-3 fw-bold mt-3 ">
                    History Donation
                </Card.Text>
                <Col className="mx-2 col-lg-11 overflow-auto scrollView" style={{ height: '55vh' }} >
                    {History?.map((items, index) => (

                        <Col className="mx-3 rounded-3 mb-3" style={{ boxShadow: "0px 0px 5px black", backgroundColor: "white" }}>
                            <Card.Text className="mx-3 fw-bold fs-5 my-1 pt-2 fs-6">
                                {items?.donation?.title}
                            </Card.Text>
                            <Card.Text className="mx-3 fw-bold" style={{fontSize: "13px", marginBottom: "10px"}}>
                                {items?.donate_at}
                            </Card.Text>
                            <Row>
                                <Col sm={8} className="mx-3 text-start fw-bold" style={{fontSize: "15px", color:"#974A4A"}}>{rupiahFormat.convert(items?.total)}</Col>
                                <Col sm={3} className="text-end me-2 mb-2 ">
                                    {items?.status === "success" ?
                                        <Badge className="bg-success"> Finished</Badge> :
                                        items?.status !== "success" ?
                                            <Badge className="bg-danger">{items?.status}</Badge> :
                                            null
                                    }</Col>
                            </Row>
                        </Col>
                    ))}

                </Col>
            </Col>

        </Container >
    )
}